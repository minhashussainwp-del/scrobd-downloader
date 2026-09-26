import path from "path";
import fs from "fs";
import {
  runUltraScraperJob,
  DOWNLOADS_ROOT,
  jobs,
  extractDocId,
  DownloadJob,
} from "../server/scribdScraper.ts";

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { url, format = "pdf", demoMode = false, quality } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Please provide a valid Scribd URL." });
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    return res.status(400).json({ error: "URL must begin with http:// or https://" });
  }

  const docId = extractDocId(trimmedUrl);
  if (!trimmedUrl.includes("scribd.com") && !trimmedUrl.includes("demo") && !demoMode && !docId) {
    return res.status(400).json({ error: "The provided URL is not a valid Scribd document link." });
  }

  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const jobDir = path.join(DOWNLOADS_ROOT, jobId);
  try {
    if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir, { recursive: true });
  } catch (e) {
    console.warn("Directory creation notice:", e);
  }

  const job: DownloadJob = {
    id: jobId,
    url: trimmedUrl,
    format: "pdf",
    status: "queued",
    progress: 10,
    stepMessage: "Engaging Ultra-Fast Scraper engine...",
    logs: [
      `[${new Date().toLocaleTimeString()}] Initialized Job ${jobId}`,
      `[${new Date().toLocaleTimeString()}] Target: ${trimmedUrl}`,
    ],
    createdAt: Date.now(),
    dir: jobDir,
  };
  (job as any).demoMode = demoMode;
  (job as any).quality = quality;

  jobs.set(jobId, job);

  // Await the scraper job in serverless execution environment so Lambda does not freeze before completion
  try {
    const completedJob = await runUltraScraperJob(job);
    return res.status(200).json({
      jobId: completedJob.id,
      status: completedJob.status,
      progress: completedJob.progress,
      stepMessage: completedJob.stepMessage,
      documentTitle: completedJob.documentTitle,
      pdfFile: completedJob.pdfFile,
      imageFiles: completedJob.imageFiles,
      speedStats: completedJob.speedStats,
      logs: completedJob.logs,
      error: completedJob.error,
      troubleshooting: completedJob.troubleshooting,
      message:
        completedJob.status === "completed"
          ? "Ultra fast download ready!"
          : "Extraction finished",
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "Failed to process document.",
      jobId,
    });
  }
}
