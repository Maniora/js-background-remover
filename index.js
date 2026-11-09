import { removeBackground } from "@imgly/background-removal-node";
import { cleanEdges } from "./cleaner.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

async function run() {
  const inputImage = path.resolve("./input.jpg");
  const outputImage = path.resolve("./output.png");

  console.log("⏳ Processing image locally...");
  console.time("⏱️ Execution Time");

  try {
    const imageUri = pathToFileURL(inputImage).href;
    const blob = await removeBackground(imageUri, {
      output: { quality: 1.0, format: "image/png" }
    });
    const rawBuffer = Buffer.from(await blob.arrayBuffer());

    // Clean white halos and defringe edges
    const cleanedBuffer = await cleanEdges(rawBuffer, { threshold: 115, defringe: 0.85 });

    fs.writeFileSync(outputImage, cleanedBuffer);

    console.timeEnd("⏱️ Execution Time");
    console.log("✅ Background removed & clean cutout saved to output.png!");
  } catch (error) {
    console.error("❌ Error removing background:", error);
  }
}

run();
