import React, { useState, useRef } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  AlertOctagon,
  ExternalLink,
  RotateCcw,
  Image as ImageIcon,
  FolderArchive,
  Terminal,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  Loader2,
  FileDown,
} from "lucide-react";
import { DownloadJob, AdSettings } from "../types";
import { ImageModal } from "./ImageModal";
import { HorizontalSlideViewer } from "./HorizontalSlideViewer";
import { PreDownloadModal, PostDownloadAdBanner } from "./AdBanners";
import { SocialShare } from "./SocialShare";

interface JobResultProps {
  job: DownloadJob;
  onReset: () => void;
  onTryDemo: () => void;
  adSettings?: AdSettings;
  onAdClick?: (type: string) => void;
}

export function JobResult({ job, onReset, onTryDemo, adSettings, onAdClick }: JobResultProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [showPreDownloadModal, setShowPreDownloadModal] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isSuccess = job.status === "completed";

  // Trigger actual file download via resilient multi-engine strategy
  const triggerDirectDownload = async () => {
    if (!job.pdfFile) return;
    setIsDownloading(true);
    setHasDownloaded(true);

    const filename = job.pdfFile.filename || "scribd-document.pdf";
    const downloadUrl = `/api/jobs/${job.id}/download`;

    // Strategy 1: Fetch as Blob (100% reliable inside iframes, browser sandboxes, and mobile)
    try {
      const res = await fetch(downloadUrl);
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(link);
          setIsDownloading(false);
        }, 1500);
        return;
      }
    } catch (err) {
      console.warn("Blob fetch failed, falling back to direct anchor:", err);
    }

    // Strategy 2: Direct anchor navigation fallback
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.target = "_blank";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 1000);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // If pre-download countdown ad is enabled (Item 9) and not already triggered
    if (adSettings?.enabled && adSettings?.preDownloadAd && !hasDownloaded) {
      setShowPreDownloadModal(true);
    } else {
      triggerDirectDownload();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8" id="job-result-card">
      {isSuccess ? (
        <div className="space-y-6">
          {/* Success Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Scrape Completed Successfully
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 break-all">
                  {job.documentTitle || "Scribd Document"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <span>Source:</span>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline inline-flex items-center gap-0.5 max-w-xs truncate"
                  >
                    {job.url}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </p>
              </div>
            </div>

            <button
              type="button"
              id="download-another-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Download Another</span>
            </button>
          </div>

          {/* Primary Action Card */}
          {job.pdfFile && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-emerald-600 text-white shadow-sm shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 break-all">{job.pdfFile.filename}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unified PDF Document • {formatBytes(job.pdfFile.sizeBytes)} • 100% Extracted
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  id="download-pdf-cta-btn"
                  onClick={handleDownloadClick}
                  disabled={isDownloading}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Downloading PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF File</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Post-Download Ad Recommendation (Item 10) */}
          {adSettings?.enabled && adSettings?.postDownloadAd && (
            <div className="mt-4">
              <PostDownloadAdBanner
                settings={adSettings}
                onAdClick={() => onAdClick && onAdClick("post_download")}
              />
            </div>
          )}

          {/* Social Share Component (Item 17) */}
          <div className="pt-2">
            <SocialShare
              shareUrl={job.url}
              title={job.documentTitle || "Scribd Document"}
            />
          </div>

          {/* Page Gallery in Horizontal Slide Format */}
          {job.imageFiles && job.imageFiles.length > 0 && (
            <div className="pt-2">
              <HorizontalSlideViewer
                jobId={job.id}
                documentTitle={job.documentTitle || job.pdfFile?.filename || "Scribd Document"}
                images={job.imageFiles}
                pdfDownloadUrl={`/api/jobs/${job.id}/download`}
              />
            </div>
          )}

          {/* Logs View */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 text-slate-200">
            <button
              type="button"
              id="result-logs-toggle"
              onClick={() => setShowLogs(!showLogs)}
              className="w-full px-4 py-2.5 bg-slate-900 text-xs font-semibold flex items-center justify-between text-slate-300 hover:text-white transition"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Execution Logs from scribd-scraper</span>
              </div>
              {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showLogs && (
              <div className="p-3.5 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto space-y-1">
                {job.logs.map((log, idx) => (
                  <div key={idx} className="break-all text-slate-300">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Failed State */
        <div className="space-y-6">
          <div className="flex items-start gap-3.5 pb-6 border-b border-slate-100">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                Document Scraping Failed
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {job.error || "Unable to extract document content"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: <span className="font-mono text-slate-700">{job.url}</span>
              </p>
            </div>
          </div>

          {/* Troubleshooting Checklist */}
          {job.troubleshooting && job.troubleshooting.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-600" />
                <span>Diagnostic Information & Troubleshooting:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {job.troubleshooting.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="try-again-btn"
              onClick={onReset}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Another Scribd URL</span>
            </button>

            <button
              type="button"
              id="try-demo-btn"
              onClick={onTryDemo}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Test with Demo Pipeline</span>
            </button>
          </div>

          {/* Scraper Logs */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 text-slate-200">
            <div className="px-4 py-2 bg-slate-900 text-xs font-semibold text-slate-300 border-b border-slate-800 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              <span>Scraper Diagnostic Output</span>
            </div>
            <div className="p-3.5 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto space-y-1">
              {job.logs.map((log, idx) => (
                <div key={idx} className="break-all text-slate-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImageIndex !== null && job.imageFiles && (
        <ImageModal
          imageUrl={`/api/jobs/${job.id}/image/${job.imageFiles[selectedImageIndex].filename}`}
          imageName={job.imageFiles[selectedImageIndex].filename}
          pageNumber={job.imageFiles[selectedImageIndex].pageNumber}
          totalPages={job.imageFiles.length}
          isOpen={true}
          onClose={() => setSelectedImageIndex(null)}
          onPrev={
            selectedImageIndex > 0
              ? () => setSelectedImageIndex(selectedImageIndex - 1)
              : undefined
          }
          onNext={
            selectedImageIndex < job.imageFiles.length - 1
              ? () => setSelectedImageIndex(selectedImageIndex + 1)
              : undefined
          }
          onDownloadSingle={() => {
            const img = job.imageFiles![selectedImageIndex];
            const link = document.createElement("a");
            link.href = `/api/jobs/${job.id}/image/${img.filename}`;
            link.download = img.filename;
            link.click();
          }}
        />
      )}

      {/* Pre-Download Interstitial Modal (Item 9) */}
      {showPreDownloadModal && adSettings && (
        <PreDownloadModal
          isOpen={showPreDownloadModal}
          seconds={adSettings.preDownloadSeconds || 3}
          settings={adSettings}
          onCountdownComplete={() => {
            setShowPreDownloadModal(false);
            triggerDirectDownload();
          }}
          onClose={() => setShowPreDownloadModal(false)}
        />
      )}
    </div>
  );
}
