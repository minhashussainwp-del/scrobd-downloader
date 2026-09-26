import fs from "fs";
import { documentCache, extractDocId } from "../server/scribdScraper.ts";

export const SAMPLES = [
  {
    title: "KDM - Kegiatan Awal Pelajaran (Scribd Presentation)",
    url: "https://www.scribd.com/presentation/359613425/KDM-Kegiatan-Awal-Pelajaran-Off-C-Kelompok-3-Andy-Dan-Farah",
    description: "Public educational slide deck with 6 high-res presentation slides",
    type: "presentation",
  },
  {
    title: "Comprehensive Curriculum & Research Analysis (161 Pages)",
    url: "https://www.scribd.com/document/394290904/Curriculum-Research-Analysis",
    description: "High quality full-length public academic paper with 161 extracted pages",
    type: "document",
  },
  {
    title: "Technical Engineering Specification & Manual",
    url: "https://www.scribd.com/document/258343050/Technical-Engineering-Manual",
    description: "Technical reference document with vector diagrams",
    type: "document",
  },
  {
    title: "Limba Romana B - Syllabus (Public Document)",
    url: "https://www.scribd.com/document/171137081/Sample-Document",
    description: "Public academic syllabus document",
    type: "document",
  },
  {
    title: "Scribd Engineering & Design Guide (Demo Reference)",
    url: "https://www.scribd.com/document/359613425/engineering-guide",
    description: "High speed vector compiled sample document",
    type: "document",
  },
];

export default function handler(_req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const list = SAMPLES.map((s) => {
    const docId = extractDocId(s.url) || s.url;
    const cached = documentCache.get(docId);
    return {
      ...s,
      prewarmed: Boolean(cached?.pdfPath && fs.existsSync(cached.pdfPath)),
      pageCount: cached?.pageCount || 6,
      fileSizeFormatted: cached?.pdfSize
        ? `${(cached.pdfSize / 1024 / 1024).toFixed(2)} MB`
        : "Instant (Cached)",
    };
  });

  return res.status(200).json(list);
}
