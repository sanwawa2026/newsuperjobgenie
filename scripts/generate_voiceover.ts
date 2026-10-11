import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI();

const scenes = [
  {
    id: "scene1_the_void",
    filename: "scene1.wav",
    time: "0:00 - 0:09",
    prompt: "Speak in a deep, calm, confident Silicon Valley tech documentary narrator voice. Natural pacing, slight pause between sentences: Stop shouting into the void. Hours tailoring resumes for black holes where human eyes never look. Fifty applications. Zero replies. Six hours lost."
  },
  {
    id: "scene2_meet_superjobgenie",
    filename: "scene2.wav",
    time: "0:10 - 0:19",
    prompt: "Speak in an energetic, confident, crisp tech founder voice: Meet SuperJobGenie. The local-first intelligence layer, built directly into your browser. Over six thousand characters of deep job description verified in real time."
  },
  {
    id: "scene3_dopamine_score",
    filename: "scene3.wav",
    time: "0:20 - 0:34",
    prompt: "Speak with momentum and satisfaction, crisp cadence: Role fit score: ninety-seven percent. Top one percent exceptional match. C-sharp, .NET, SQL, Python, PostgreSQL. Zero skill gaps."
  },
  {
    id: "scene4_tailored_pivot",
    filename: "scene4.wav",
    time: "0:35 - 0:47",
    prompt: "Speak in an authoritative, inspiring tech product leader tone: From raw JD to offer-ready. Tailored professional applications in seconds. Plus smart career pivot discovery to unlock high-demand adjacent tracks."
  },
  {
    id: "scene5_call_to_action",
    filename: "scene5.wav",
    time: "0:48 - 1:00",
    prompt: "Speak with punchy authority, memorable closing: SuperJobGenie. Move faster. Land better. Add to Chrome — it's free. Available now on the Chrome Web Store."
  }
];

async function run() {
  const outDir = path.resolve(process.cwd(), "public", "audio");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log("Generating 5-scene master voiceover via gemini-3.8-flash-tts...");

  for (const scene of scenes) {
    console.log(`Generating ${scene.filename} (${scene.time})...`);
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3.8-flash-tts",
        contents: scene.prompt,
        config: {
          responseModalities: ["AUDIO"]
        }
      });

      const part = res.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
        const buffer = Buffer.from(part.inlineData.data, "base64");
        const filePath = path.join(outDir, scene.filename);
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved ${scene.filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
      } else {
        console.error(`No audio data for ${scene.filename}`);
      }
    } catch (err) {
      console.error(`Failed ${scene.filename}:`, err);
    }
  }

  console.log("All audio generated in public/audio/!");
}

run();
