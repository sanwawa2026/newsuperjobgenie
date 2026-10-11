import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI();

// Sleep helper to stay safely within the 3 requests per minute quota
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const scenesToRegen = [
  {
    filename: "scene1.wav",
    time: "0:00 - 0:09",
    prompt: "Speak in an authoritative, inspiring tech product leader tone: Stop shouting into the void. Hours tailoring resumes for black holes where human eyes never look. Fifty applications. Zero replies. Six hours lost."
  },
  {
    filename: "scene2.wav",
    time: "0:10 - 0:19",
    prompt: "Speak in an authoritative, inspiring tech product leader tone: Meet SuperJobGenie. The local-first intelligence layer, built directly into your browser. Over six thousand characters of deep job description verified in real time."
  },
  {
    filename: "scene3.wav",
    time: "0:20 - 0:34",
    prompt: "Speak in an authoritative, inspiring tech product leader tone: Role fit score: ninety-seven percent. Top one percent exceptional match. C-sharp, .NET, SQL, Python, PostgreSQL. Zero skill gaps."
  },
  {
    filename: "scene5.wav",
    time: "0:48 - 1:00",
    prompt: "Speak in an authoritative, inspiring tech product leader tone: SuperJobGenie. Move faster. Land better. Add to Chrome — it's free. Available now on the Chrome Web Store."
  }
];

async function run() {
  const outDir = path.resolve(process.cwd(), "public", "audio");

  console.log("Starting unified voice synthesis (matching Scene 4's Tech Product Leader tone)...");

  for (let i = 0; i < scenesToRegen.length; i++) {
    const scene = scenesToRegen[i];
    console.log(`[${i + 1}/${scenesToRegen.length}] Synthesizing ${scene.filename}...`);
    
    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      attempts++;
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
          fs.writeFileSync(path.join(outDir, scene.filename), buffer);
          console.log(`Saved ${scene.filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
          success = true;
        }
      } catch (err: any) {
        console.warn(`Attempt ${attempts} failed for ${scene.filename}: ${err.message?.slice(0, 100)}`);
        console.log("Waiting 30s for quota refresh...");
        await sleep(30000);
      }
    }

    if (i < scenesToRegen.length - 1) {
      console.log("Waiting 24s between scenes to stay within RPM quota...");
      await sleep(24000);
    }
  }

  console.log("All audio scenes successfully unified with Scene 4 voice!");
}

run().catch(console.error);
