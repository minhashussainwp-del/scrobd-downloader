import { documentCache } from "../server/scribdScraper.ts";

export default function handler(_req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    cacheEntries: documentCache.size,
    engine: "Ultra-Fast Multi-Threaded Scraper v3",
    serverless: true,
  });
}
