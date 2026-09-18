import React from "react";
import { ArrowRight } from "lucide-react";
import { SupportedLanguage } from "../types";
import { AboutAuthorCard } from "./Blog/AboutAuthorCard";

interface ModernArticleSidebarProps {
  currentLang?: SupportedLanguage;
  onOpenDownloader?: () => void;
  title?: string;
  subtitle?: string;
}

export function ModernArticleSidebar({
  currentLang = "en",
  onOpenDownloader,
  title,
  subtitle,
}: ModernArticleSidebarProps) {
  const handleOpenDownloader = () => {
    if (onOpenDownloader) {
      onOpenDownloader();
      return;
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const input = document.getElementById("hero-url-input") as HTMLInputElement;
      input?.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Author Profile Spotlight */}
      <AboutAuthorCard compact showEditTrigger />

      {/* Box 1: Knowledge Base */}
      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-5 shadow-2xs">
        <h3 className="text-base font-bold text-[#1e3a8a] mb-1">
          Knowledge Base
        </h3>
        <p className="text-sm text-[#1e40af] font-semibold leading-relaxed">
          No Login • High-Quality PDF • Works on All Devices
        </p>
      </div>

      {/* Section 2: Latest Guides & Articles */}
      <div className="pt-2 space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Latest Guides & Articles
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Explore tutorials on document formats, digital reading, and research methods.
        </p>
      </div>

      {/* Box 3: Purple CTA Box */}
      <div className="bg-[#4338ca] rounded-2xl p-6 sm:p-7 text-white text-center shadow-lg relative overflow-hidden space-y-3">
        <h3 className="text-lg sm:text-xl font-extrabold leading-snug text-white">
          {title || "Have a Scribd Link Ready to Convert?"}
        </h3>
        <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
          {subtitle ||
            "Paste the URL into our web tool right now to preview pages and download your document as a pure PDF file."}
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleOpenDownloader}
            className="w-full py-3 px-5 bg-white text-[#4f46e5] rounded-xl font-bold text-sm sm:text-base hover:bg-slate-50 transition shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Open PDF Downloader</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
