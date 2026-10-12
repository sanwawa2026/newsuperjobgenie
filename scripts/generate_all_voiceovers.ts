import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ai = new GoogleGenAI();
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const outDir = path.resolve(process.cwd(), "public", "audio");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function generateAudio(filename: string, prompt: string) {
  console.log(`Generating ${filename}...`);
  const res = await ai.models.generateContent({
    model: "gemini-3.8-flash-tts",
    contents: prompt,
    config: {
      responseModalities: ["AUDIO"]
    }
  });

  const part = res.candidates?.[0]?.content?.parts?.[0];
  if (part?.inlineData?.data) {
    const buffer = Buffer.from(part.inlineData.data, "base64");
    const filePath = path.join(outDir, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return filePath;
  } else {
    throw new Error(`No audio data received for ${filename}`);
  }
}

async function main() {
  console.log("=== 1. Generating 38s Vertical Short Audio ===");
  const prompt38s = "Speak in an energetic, authoritative, inspiring tech product leader tone with crisp, punchy delivery: Stop shouting into the void. Fifty applications, zero replies. Meet SuperJobGenie. The local-first AI built right into your browser. Instant role alignment across six thousand characters of deep job description. Don't just match current jobs. Discover high-paying adjacent tracks. And generate tailored, executive cover letters in seconds. SuperJobGenie. Move faster. Switch tracks. Add to Chrome — it's free.";
  
  await generateAudio("short_38s_raw.wav", prompt38s);

  console.log("Waiting 25s for quota safety...");
  await sleep(25000);

  console.log("=== 2. Generating 73s Long-Form YouTube/Landing Page Audio ===");
  const prompt73s = "Speak in a calm, authoritative, inspiring tech product leader tone with measured, cinematic pacing and natural pauses between sections: Stop shouting into the void. Hours tailoring resumes for black holes where human eyes never look. Fifty applications. Zero replies. Six hours lost. Meet SuperJobGenie. The local-first intelligence layer, built directly into your browser. Over six thousand characters of deep job description verified in real time. Role fit score: ninety-seven percent. Top one percent exceptional match. C-sharp, .NET, SQL, Python, PostgreSQL. Zero skill gaps. From raw JD to offer-ready. Tailored professional applications in seconds. Plus smart career pivot discovery to unlock high-demand adjacent tracks. SuperJobGenie. Move faster. Switch tracks. Add to Chrome — it's free. Available now on the Chrome Web Store.";

  await generateAudio("long_73s_raw.wav", prompt73s);

  console.log("=== 3. Post-Processing & Timing Alignment via FFmpeg ===");
  
  // Format 38s short voiceover
  execSync(`ffmpeg -y -i ${path.join(outDir, "short_38s_raw.wav")} -filter:a "volume=1.35,alimiter=limit=0.98" -ar 48000 ${path.join(outDir, "short_38s_voiceover.wav")}`);
  console.log("Generated short_38s_voiceover.wav");

  // Format 73s long voiceover
  execSync(`ffmpeg -y -i ${path.join(outDir, "long_73s_raw.wav")} -filter:a "volume=1.35,alimiter=limit=0.98" -ar 48000 ${path.join(outDir, "long_73s_voiceover.wav")}`);
  console.log("Generated long_73s_voiceover.wav");

  // Generate 38s full mix with BGM (using the cyber ambient pad scaled to 38s)
  const bgm38Path = path.join(outDir, "cyber_bgm_38s.wav");
  const bgm38Command = `ffmpeg -y -f lavfi -i "
    anoisesrc=d=39:c=pink:r=48000:a=0.03,lowpass=f=220[noise];
    sine=f=65.4:d=39,volume=0.35[sub1];
    sine=f=130.8:d=39,volume=0.2[sub2];
    sine=f=196:d=39,volume=0.15[fifth];
    sine=f=261.6:d=39,volume=0.1[octave];
    [sub1][sub2][fifth][octave][noise]amix=inputs=5:normalize=0,
    aecho=0.8:0.88:120|240:0.4|0.25,
    flanger=delay=8:depth=4:speed=0.2,
    volume=0.22,
    afade=t=in:ss=0:d=1.5,
    afade=t=out:st=36.5:d=2.5
  " -ar 48000 ${bgm38Path}`;
  execSync(bgm38Command.replace(/\n\s+/g, ' '));

  execSync(`ffmpeg -y -i ${bgm38Path} -i ${path.join(outDir, "short_38s_voiceover.wav")} -filter_complex "[0]volume=0.38[bgm];[1]volume=1.3[vox];[bgm][vox]amix=inputs=2:duration=longest,alimiter=limit=0.98" -ar 48000 ${path.join(outDir, "short_38s_master_mix.wav")}`);
  console.log("Generated short_38s_master_mix.wav");

  // Generate 73s full mix with BGM
  const bgm73Path = path.join(outDir, "cyber_bgm_73s.wav");
  const bgm73Command = `ffmpeg -y -f lavfi -i "
    anoisesrc=d=74:c=pink:r=48000:a=0.03,lowpass=f=220[noise];
    sine=f=65.4:d=74,volume=0.35[sub1];
    sine=f=130.8:d=74,volume=0.2[sub2];
    sine=f=196:d=74,volume=0.15[fifth];
    sine=f=261.6:d=74,volume=0.1[octave];
    [sub1][sub2][fifth][octave][noise]amix=inputs=5:normalize=0,
    aecho=0.8:0.88:120|240:0.4|0.25,
    flanger=delay=8:depth=4:speed=0.2,
    volume=0.22,
    afade=t=in:ss=0:d=2.5,
    afade=t=out:st=70.5:d=3.0
  " -ar 48000 ${bgm73Path}`;
  execSync(bgm73Command.replace(/\n\s+/g, ' '));

  execSync(`ffmpeg -y -i ${bgm73Path} -i ${path.join(outDir, "long_73s_voiceover.wav")} -filter_complex "[0]volume=0.38[bgm];[1]volume=1.3[vox];[bgm][vox]amix=inputs=2:duration=longest,alimiter=limit=0.98" -ar 48000 ${path.join(outDir, "long_73s_master_mix.wav")}`);
  console.log("Generated long_73s_master_mix.wav");

  console.log("=== All short & long audio tracks generated successfully! ===");
}

main().catch(console.error);
