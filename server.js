import http from "http";
import fs from "fs";
import path from "path";
import { removeBackground } from "@imgly/background-removal-node";
import { cleanEdges } from "./cleaner.js";

const PORT = 3000;
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Edge-Threshold, X-Defringe");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoint: Background Removal + Halo Cleaner
  if (req.url === "/api/remove-bg" && req.method === "POST") {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const mimeType = req.headers["content-type"] || "image/jpeg";
      const threshold = parseInt(req.headers["x-edge-threshold"] || "105", 10);
      const defringe = parseFloat(req.headers["x-defringe"] || "0.85");

      // 1. Core AI background removal with max quality
      const blob = await removeBackground(new Blob([buffer], { type: mimeType }), {
        output: { quality: 1.0, format: "image/png" }
      });
      const arrayBuffer = await blob.arrayBuffer();
      const rawCutout = Buffer.from(arrayBuffer);

      // 2. Post-process to remove white halo / edge bleed
      const cleanedBuffer = await cleanEdges(rawCutout, { threshold, defringe });

      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(cleanedBuffer);
      return;
    } catch (err) {
      console.error("API Processing Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
  }

  // Static File Serving
  let reqUrl = req.url.split("?")[0];
  let filePath = reqUrl === "/" ? "index.html" : reqUrl.replace(/^\//, "");
  filePath = path.resolve(process.cwd(), filePath);

  if (!filePath.startsWith(process.cwd())) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Enhanced Server running at: http://localhost:${PORT}`);
});
