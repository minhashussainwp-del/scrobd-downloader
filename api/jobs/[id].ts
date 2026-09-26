import path from "path";
import fs from "fs";
import {
  jobs,
  documentCache,
  CACHE_ROOT,
} from "../../server/scribdScraper.ts";

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const rawId = req.query?.id || req.url?.split("/").pop()?.split("?")[0];
  if (!rawId) {
    return res.status(400).json({ error: "Missing job ID." });
  }

  // 1. Check in-memory jobs map
  const job = jobs.get(rawId);
  if (job) {
    return res.json(job);
  }

  // 2. Check document cache by ID
  const cached = documentCache.get(rawId);
  if (cached) {
    return res.json({
      id: rawId,
      url: `https://www.scribd.com/document/${rawId}`,
      format: "pdf",
      status: "completed",
      progress: 100,
      stepMessage: "Ready from cache",
      documentTitle: cached.title,
      pdfFile: {
        filename: `${cached.title}.pdf`,
        sizeBytes: cached.pdfSize,
        path: cached.pdfPath,
      },
      imageFiles: cached.images.slice(0, 30),
      createdAt: cached.timestamp,
      logs: ["Loaded from ultra cache"],
    });
  }

  // 3. Check disk for pre-cached PDF in CACHE_ROOT
  const diskPdf = path.join(CACHE_ROOT, `${rawId}.pdf`);
  if (fs.existsSync(diskPdf)) {
    const stats = fs.statSync(diskPdf);
    return res.json({
      id: rawId,
      url: `https://www.scribd.com/document/${rawId}`,
      format: "pdf",
      status: "completed",
      progress: 100,
      stepMessage: "Document ready",
      documentTitle: `scribd-document-${rawId}`,
      pdfFile: {
        filename: `scribd-${rawId}.pdf`,
        sizeBytes: stats.size,
        path: diskPdf,
      },
      createdAt: Date.now(),
      logs: ["Located on disk cache"],
    });
  }

  return res.status(404).json({ error: "Download job not found or expired." });
}
