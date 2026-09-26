import path from "path";
import fs from "fs";
import {
  jobs,
  documentCache,
  CACHE_ROOT,
} from "../../../server/scribdScraper.ts";

export default function handler(req: any, res: any) {
  const rawId = req.query?.id || req.url?.split("/jobs/")[1]?.split("/download")[0];
  let targetPdfPath = "";
  let targetFilename = "scribd-document.pdf";

  // Check jobs map
  const job = rawId ? jobs.get(rawId) : null;
  if (job && job.pdfFile && fs.existsSync(job.pdfFile.path)) {
    targetPdfPath = job.pdfFile.path;
    targetFilename = job.pdfFile.filename;
  } else if (rawId) {
    // Check cache
    const cachePath = path.join(CACHE_ROOT, `${rawId}.pdf`);
    if (fs.existsSync(cachePath)) {
      targetPdfPath = cachePath;
      targetFilename = `scribd-${rawId}.pdf`;
    } else {
      const cached = documentCache.get(rawId);
      if (cached && fs.existsSync(cached.pdfPath)) {
        targetPdfPath = cached.pdfPath;
        targetFilename = `${cached.title}.pdf`;
      }
    }
  }

  if (targetPdfPath && fs.existsSync(targetPdfPath)) {
    const stats = fs.statSync(targetPdfPath);
    const safeFilename = targetFilename.replace(/[^\w.-]/g, "_");
    const isInline = req.query?.inline === "true" || req.query?.view === "true";
    const disposition = isInline ? "inline" : "attachment";

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Length": stats.size,
      "Content-Disposition": `${disposition}; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(targetFilename)}`,
      "Cache-Control": "public, max-age=86400, immutable",
      "Access-Control-Allow-Origin": "*",
      "Accept-Ranges": "bytes",
    });

    const stream = fs.createReadStream(targetPdfPath, { highWaterMark: 128 * 1024 });
    return stream.pipe(res);
  }

  res.status(404).json({ error: "PDF not found." });
}
