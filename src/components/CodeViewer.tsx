import { useState } from "react";
import { Copy, Check, Terminal, ExternalLink, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DownloadFormat } from "../types";

interface CodeViewerProps {
  currentUrl: string;
  currentFormat: DownloadFormat;
  isOpen: boolean;
  onClose: () => void;
}

export function CodeViewer({ currentUrl, currentFormat, isOpen, onClose }: CodeViewerProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>(currentFormat);
  const [moduleType, setModuleType] = useState<"cjs" | "esm">("cjs");
  const [copied, setCopied] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const activeUrl = currentUrl.trim() || "https://pt.scribd.com/document/477711709/1990-02-mara-maravilha-pdf";

  const getCode = () => {
    if (moduleType === "cjs") {
      if (selectedFormat === "images") {
        return `// Only download images using scribd-scraper
const scrapeScribd = require('scribd-scraper');

const url = '${activeUrl}';
const dir = './images';

scrapeScribd(url, dir)
  .then(() => {
    console.log("Images downloaded successfully.");
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });`;
      } else {
        return `// Download and convert to PDF using scribd-scraper
const scrapeScribd = require('scribd-scraper');

const url = '${activeUrl}';
const dir = './images';
const pdf = true;

scrapeScribd(url, dir, pdf)
  .then(() => {
    console.log("Images downloaded and converted to PDF successfully.");
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });`;
      }
    } else {
      if (selectedFormat === "images") {
        return `// Only download images (ESM syntax)
import scrapeScribd from 'scribd-scraper';

const url = '${activeUrl}';
const dir = './images';

try {
  await scrapeScribd(url, dir);
  console.log("Images downloaded successfully.");
} catch (error) {
  console.error("Error:", error.message);
}`;
      } else {
        return `// Download and convert to PDF (ESM syntax)
import scrapeScribd from 'scribd-scraper';

const url = '${activeUrl}';
const dir = './images';
const pdf = true;

try {
  await scrapeScribd(url, dir, pdf);
  console.log("Images downloaded and converted to PDF successfully.");
} catch (error) {
  console.error("Error:", error.message);
}`;
      }
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText("npm i scribd-scraper");
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-lg border border-slate-800 mb-8"
        id="code-snippet-panel"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-800 text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Node.js API Usage Reference</h2>
              <p className="text-xs text-slate-400">Exact code structure from your prompt examples</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Install command pill */}
            <button
              type="button"
              id="copy-npm-install-btn"
              onClick={handleCopyInstall}
              className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              title="Click to copy npm install command"
            >
              <code className="text-emerald-400 font-mono text-[11px]">npm i scribd-scraper</code>
              {copiedInstall ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              id="close-code-panel-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800 transition"
            >
              Hide
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-800/90 border border-slate-700">
            <button
              type="button"
              id="code-tab-pdf"
              onClick={() => setSelectedFormat("pdf")}
              className={`px-3 py-1 rounded-md transition font-medium ${
                selectedFormat === "pdf"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              PDF Mode (pdf: true)
            </button>
            <button
              type="button"
              id="code-tab-images"
              onClick={() => setSelectedFormat("images")}
              className={`px-3 py-1 rounded-md transition font-medium ${
                selectedFormat === "images"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Images Mode (pdf: false)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-800/90 border border-slate-700">
              <button
                type="button"
                id="module-type-cjs"
                onClick={() => setModuleType("cjs")}
                className={`px-2.5 py-1 rounded-md transition font-mono text-[11px] ${
                  moduleType === "cjs" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                require()
              </button>
              <button
                type="button"
                id="module-type-esm"
                onClick={() => setModuleType("esm")}
                className={`px-2.5 py-1 rounded-md transition font-mono text-[11px] ${
                  moduleType === "esm" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                import
              </button>
            </div>

            <button
              type="button"
              id="copy-code-btn"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto">
          <pre>{getCode()}</pre>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
