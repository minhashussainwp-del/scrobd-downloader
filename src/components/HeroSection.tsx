import React, { useState } from "react";
import {
  Check,
  FileText,
  Sparkles,
  ArrowRight,
  Play,
  AlertCircle,
  Link2,
  Clipboard,
  X,
  Download
} from "lucide-react";
import { DownloadJob, AdSettings, SupportedLanguage } from "../types";
import { JobProgress } from "./JobProgress";
import { JobResult } from "./JobResult";
import { t } from "../data/translations";

interface HeroSectionProps {
  url: string;
  setUrl: (url: string) => void;
  format: string;
  setFormat: (format: string) => void;
  demoMode: boolean;
  setDemoMode: (mode: boolean) => void;
  currentJob: DownloadJob | null;
  setCurrentJob: (job: DownloadJob | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  adSettings: AdSettings;
  currentLang: SupportedLanguage;
}

const SAMPLE_DOCS = [
  {
    label: "Sample Presentation (6 Slides)",
    url: "https://www.scribd.com/presentation/359613425/KDM-Kegiatan-Awal-Pelajaran-Off-C-Kelompok-3-Andy-Dan-Farah",
  },
  {
    label: "Academic Paper (161 Pages)",
    url: "https://www.scribd.com/document/394290904/Curriculum-Research-Analysis",
  },
  {
    label: "Technical Manual",
    url: "https://www.scribd.com/document/258343050/Technical-Engineering-Manual",
  },
];

export function HeroSection({
  url,
  setUrl,
  format,
  demoMode,
  setDemoMode,
  currentJob,
  setCurrentJob,
  isLoading,
  setIsLoading,
  adSettings,
  currentLang,
}: HeroSectionProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const startDownload = async (targetUrl: string, isDemo = false) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) {
      setFormError("Please enter a Scribd document URL.");
      return;
    }

    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    setFormError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl, format: "pdf", demoMode: isDemo || demoMode }),
      });

      const data = await res.json();

      if (res.ok && data.jobId) {
        setCurrentJob({
          id: data.jobId,
          url: cleanUrl,
          format: "pdf",
          status: "queued",
          progress: 10,
          stepMessage: "Connecting to Scribd parallel scraper...",
          logs: [data.message || "Download job initiated."],
          createdAt: Date.now(),
          dir: "",
        });
      } else {
        // Show job error card
        setCurrentJob({
          id: `err_${Date.now()}`,
          url: cleanUrl,
          format: "pdf",
          status: "failed",
          progress: 100,
          stepMessage: "Failed to initialize extraction",
          error: data.error || "The server could not process this document URL.",
          troubleshooting: [
            "Ensure the URL belongs to a public Scribd document or presentation.",
            "Verify the link starts with https://www.scribd.com/...",
            "Click on one of our pre-cached sample documents below to test the pipeline.",
          ],
          logs: [data.error || "Request failed"],
          createdAt: Date.now(),
          dir: "",
        });
        setIsLoading(false);
      }
    } catch (err: any) {
      // In case network fetch completely fails, provide clean demo fallback
      setCurrentJob({
        id: `demo_${Date.now()}`,
        url: cleanUrl,
        format: "pdf",
        status: "extracting",
        progress: 50,
        stepMessage: "Processing document pages (Demo fallback)...",
        documentTitle: "Scribd Document (Sample)",
        logs: ["Simulating extraction pipeline..."],
        createdAt: Date.now(),
        dir: "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startDownload(url);
  };

  const handleTryDemo = () => {
    const demoUrl = "https://www.scribd.com/presentation/359613425/KDM-Kegiatan-Awal-Pelajaran-Off-C-Kelompok-3-Andy-Dan-Farah";
    setUrl(demoUrl);
    startDownload(demoUrl, true);
  };

  const isProcessing =
    currentJob &&
    (currentJob.status === "queued" ||
      currentJob.status === "fetching" ||
      currentJob.status === "extracting" ||
      currentJob.status === "converting");

  const isFinished = currentJob && (currentJob.status === "completed" || currentJob.status === "failed");

  return (
    <section className="bg-slate-100 py-12 md:py-20 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        
        <div className="space-y-6 w-full flex flex-col items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#3b5998] bg-[#e6edff] border border-[#d0ddff] rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {t("hero.badge", currentLang)}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-slate-900 leading-[1.15] tracking-tight">
            {t("hero.title", currentLang)}
          </h1>
          
          <p className="text-base md:text-lg text-slate-700 font-medium max-w-2xl mx-auto">
            {t("hero.subtitle", currentLang)}
          </p>

          {/* Active Job Progress */}
          {isProcessing && currentJob && (
            <div className="w-full max-w-3xl mt-6 text-left">
              <JobProgress
                job={currentJob}
                onCancel={() => {
                  setCurrentJob(null);
                  setIsLoading(false);
                }}
              />
            </div>
          )}

          {/* Completed / Failed Job Result */}
          {isFinished && currentJob && (
            <div className="w-full max-w-3xl mt-6 text-left">
              <JobResult
                job={currentJob}
                onReset={() => {
                  setCurrentJob(null);
                  setUrl("");
                  setIsLoading(false);
                }}
                onTryDemo={handleTryDemo}
                adSettings={adSettings}
              />
            </div>
          )}

          {/* Input Form (Shown when not showing result) */}
          {!currentJob && (
            <div className="w-full max-w-3xl mx-auto mt-4">
              <form onSubmit={handleSubmit} className="relative z-20 w-full">
                <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-slate-200/90 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-blue-900/10 focus-within:ring-4 focus-within:ring-blue-500/15 focus-within:border-blue-500 transition-all duration-300 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {/* Left Icon Pill */}
                  <div className="hidden sm:flex w-12 h-12 rounded-xl bg-slate-100 group-focus-within:bg-blue-50 text-slate-400 group-focus-within:text-blue-600 items-center justify-center transition-colors shrink-0">
                    <Link2 className="w-5 h-5" />
                  </div>

                  {/* Input Element & Action Helpers */}
                  <div className="flex-1 flex items-center min-w-0 px-2 sm:px-0">
                    <div className="sm:hidden pr-2 text-slate-400">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      placeholder={t("hero.placeholder", currentLang)}
                      className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 font-medium text-base sm:text-lg focus:outline-none py-3"
                    />

                    {/* Clear Button (shown when text present) */}
                    {url && (
                      <button
                        type="button"
                        onClick={() => {
                          setUrl("");
                          if (formError) setFormError(null);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0 cursor-pointer mr-1"
                        title="Clear input"
                        aria-label="Clear URL"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {/* Paste Button (shown when input empty) */}
                    {!url && typeof navigator !== "undefined" && navigator.clipboard && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                              setUrl(text);
                              if (formError) setFormError(null);
                            }
                          } catch (_) {}
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition shrink-0 cursor-pointer mr-1"
                        title="Paste from clipboard"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Paste</span>
                      </button>
                    )}
                  </div>

                  {/* Modern Action CTA Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    id="hero-download-submit-btn"
                    className="group/btn relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-base transition-all duration-200 shadow-md shadow-slate-950/20 hover:shadow-xl hover:shadow-slate-950/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer shrink-0 border border-slate-800"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-blue-400 group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors duration-200 shrink-0">
                          <Download className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-y-0.5" />
                        </div>
                        <span className="tracking-tight whitespace-nowrap">
                          {t("hero.downloadBtn", currentLang)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all duration-200 shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {formError && (
                <div className="mt-3 text-sm text-red-600 font-semibold flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {formError}
                </div>
              )}

              {/* Quick Sample Links & Demo Button */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-500 font-medium mr-1">Quick Test Samples:</span>
                {SAMPLE_DOCS.map((doc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrl(doc.url);
                      startDownload(doc.url);
                    }}
                    className="bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg font-semibold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    {doc.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleTryDemo}
                  className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                  Instant Demo (0s)
                </button>
              </div>
            </div>
          )}

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-4">
            {[t("hero.check1", currentLang), t("hero.check2", currentLang), t("hero.check3", currentLang)].map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
