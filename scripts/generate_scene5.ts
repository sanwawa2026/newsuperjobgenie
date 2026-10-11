import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI();

async function run() {
  const outDir = path.resolve(process.cwd(), "public", "audio");
  const prompt = "Speak with punchy authority, memorable closing: SuperJobGenie. Move faster. Land better. Add to Chrome — it's free. Available now on the Chrome Web Store.";
  console.log("Generating scene5.wav...");
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
    fs.writeFileSync(path.join(outDir, "scene5.wav"), buffer);
    console.log(`Saved scene5.wav (${(buffer.length / 1024).toFixed(1)} KB)!`);
  }
}

run().catch(console.error);
