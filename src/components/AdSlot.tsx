import React, { useEffect, useState } from "react";
import { Sparkles, ExternalLink, ShieldAlert } from "lucide-react";
import { AdSettings } from "../types";
import { recordAdImpression, recordAdClick } from "../utils/adTrigger";

export type AdSlotPlacement =
  | "header"
  | "below-hero"
  | "in-feed"
  | "sidebar"
  | "footer";

interface AdSlotProps {
  placement: AdSlotPlacement;
  settings?: AdSettings;
  className?: string;
}

export function AdSlot({ placement, settings, className = "" }: AdSlotProps) {
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    if (!settings?.enabled) return;
    recordAdImpression();

    // Lightweight heuristic to detect ad blocking
    const testAd = document.createElement("div");
    testAd.className = "pub_300x250 pub_300x250m pub_728x90 text-ad textAds banner-ad text-ad-links";
    testAd.style.height = "1px";
    testAd.style.position = "absolute";
    testAd.style.left = "-9999px";
    document.body.appendChild(testAd);
    setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        setAdBlocked(true);
      }
      testAd.remove();
    }, 150);
  }, [settings?.enabled]);

  if (!settings || !settings.enabled) {
    return null;
  }

  // Check placement toggle and specific ad code
  let isPlacementEnabled = false;
  let customCode: string | undefined = "";

  switch (placement) {
    case "header":
      isPlacementEnabled = Boolean(settings.headerAd);
      customCode = settings.headerAdCode;
      break;
    case "below-hero":
      isPlacementEnabled = Boolean(settings.belowHeroAd);
      customCode = settings.belowHeroAdCode;
      break;
    case "in-feed":
      isPlacementEnabled = Boolean(settings.inFeedAd);
      customCode = settings.inFeedAdCode;
      break;
    case "sidebar":
      isPlacementEnabled = Boolean(settings.sidebarAd);
      customCode = settings.sidebarAdCode;
      break;
    case "footer":
      isPlacementEnabled = Boolean(settings.footerAd);
      customCode = settings.footerAdCode;
      break;
  }

  if (!isPlacementEnabled) {
    return null;
  }

  // If adblock detected and notice enabled
  if (adBlocked && settings.adblockNotice) {
    return (
      <div className={`p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">Support Free Downloads: Consider whitelisting our website in your ad blocker.</span>
        </div>
      </div>
    );
  }

  // If custom HTML/AdSense code is provided, render it directly
  if (customCode && customCode.trim() !== "") {
    return (
      <div className={`ad-slot-container my-3 overflow-hidden text-center ${className}`} id={`ad-slot-${placement}`}>
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
          <span>Advertisement</span>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: customCode }}
          className="inline-block max-w-full overflow-hidden"
        />
      </div>
    );
  }

  // Fallback: Elegant high-contrast native sponsor banner
  const sponsorUrl = settings.newTabUrl || "https://pdfviewer.org";
  const sponsorName = settings.sponsorName || "CloudPDF Pro Tools";
  const sponsorTagline =
    settings.sponsorTagline ||
    "Compress, OCR, and convert documents instantly with 1-click cloud workflows.";
  const sponsorCta = settings.sponsorCta || "Learn More";

  if (placement === "header") {
    return (
      <div className={`w-full bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-b border-indigo-100 py-2 px-4 ${className}`} id="ad-slot-header">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
              Sponsored
            </span>
            <span className="font-bold text-slate-900">{sponsorName}</span>
            <span className="hidden md:inline text-slate-600">— {sponsorTagline}</span>
          </div>
          <a
            href={sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={recordAdClick}
            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs text-xs"
          >
            <span>{sponsorCta}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  if (placement === "footer") {
    return (
      <div className={`w-full bg-slate-900 text-slate-200 border-t border-slate-800 py-4 px-4 ${className}`} id="ad-slot-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Sponsored Partner</span>
                <span className="font-bold text-white">{sponsorName}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{sponsorTagline}</p>
            </div>
          </div>
          <a
            href={sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={recordAdClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm shrink-0"
          >
            <span>{sponsorCta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Default block banner (below-hero, in-feed, sidebar)
  return (
    <div className={`my-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/50 border border-indigo-100/80 shadow-xs relative overflow-hidden ${className}`} id={`ad-slot-${placement}`}>
      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-600" />
          Sponsored Partner
        </span>
        <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-mono">Ad</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900">{sponsorName}</h4>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{sponsorTagline}</p>
        </div>
        <a
          href={sponsorUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={recordAdClick}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition shrink-0"
        >
          <span>{sponsorCta}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
