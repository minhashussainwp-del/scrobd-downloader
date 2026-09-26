import React, { useState } from "react";
import { X, ExternalLink, Sparkles } from "lucide-react";
import { AdSettings, CmsAd } from "../types";
import { recordAdImpression, recordAdClick, hasValidAdUrl } from "../utils/adTrigger";

interface PlacementProps {
  settings?: AdSettings;
  ads?: CmsAd[];
  className?: string;
}

function findActiveAd(ads: CmsAd[] | undefined, placement: string): CmsAd | undefined {
  if (!ads || ads.length === 0) return undefined;
  const target = placement.toLowerCase();
  return ads.find(
    (a) => a.status === "active" && a.placement && a.placement.toLowerCase() === target
  );
}

/**
 * 1. Top Placement Ad (Header / Top of page)
 * Non-intrusive, fully responsive across desktop, tablet, and mobile.
 */
export function TopAdPlacement({ settings, ads, className = "" }: PlacementProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const cmsAd = findActiveAd(ads, "top");
  const code = cmsAd?.code || settings?.topAdCode || settings?.headerAdCode;
  const isEnabled = (cmsAd && cmsAd.status === "active") || settings?.topAd || settings?.headerAd;

  if (!isEnabled || !code || code.trim() === "") {
    return null;
  }

  return (
    <div
      id="placement-ad-top"
      className={`w-full bg-slate-50/90 border-b border-slate-200/80 py-2 px-3 relative transition-all ${className}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 text-center overflow-hidden">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">
            <span>Advertisement</span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: code }}
            className="inline-block max-w-full overflow-hidden text-xs text-slate-600"
          />
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition shrink-0"
          title="Dismiss ad"
          aria-label="Close Ad"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/**
 * 2. Left Desktop Flank Placement
 * Stays gracefully on the left flank on extra-wide screens (> 1280px).
 * Automatically hidden on mobile and tablet to preserve 100% UI/UX purity.
 */
export function LeftAdPlacement({ settings, ads, className = "" }: PlacementProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const cmsAd = findActiveAd(ads, "left");
  const code = cmsAd?.code || settings?.leftAdCode;
  const isEnabled = (cmsAd && cmsAd.status === "active") || settings?.leftAd;

  if (!isEnabled || !code || code.trim() === "") {
    return null;
  }

  return (
    <aside
      id="placement-ad-left"
      aria-label="Left Advertisement"
      className={`hidden xl:block fixed left-3 top-32 z-30 w-36 2xl:w-40 bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200 shadow-sm p-2 text-center text-xs ${className}`}
    >
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Ad</span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Close Ad"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: code }}
        className="overflow-hidden leading-relaxed text-[11px] text-slate-600"
      />
    </aside>
  );
}

/**
 * 3. Right Desktop Flank Placement
 * Stays gracefully on the right flank on extra-wide screens (> 1280px).
 * Automatically hidden on mobile and tablet.
 */
export function RightAdPlacement({ settings, ads, className = "" }: PlacementProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const cmsAd = findActiveAd(ads, "right");
  const code = cmsAd?.code || settings?.rightAdCode;
  const isEnabled = (cmsAd && cmsAd.status === "active") || settings?.rightAd;

  if (!isEnabled || !code || code.trim() === "") {
    return null;
  }

  return (
    <aside
      id="placement-ad-right"
      aria-label="Right Advertisement"
      className={`hidden xl:block fixed right-3 top-32 z-30 w-36 2xl:w-40 bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200 shadow-sm p-2 text-center text-xs ${className}`}
    >
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Ad</span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Close Ad"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: code }}
        className="overflow-hidden leading-relaxed text-[11px] text-slate-600"
      />
    </aside>
  );
}

/**
 * 4. Center Placement (Between hero and content sections or in articles)
 * Clean, nicely bordered, centered container that fits the theme.
 */
export function CenterAdPlacement({ settings, ads, className = "" }: PlacementProps) {
  const cmsAd = findActiveAd(ads, "center");
  const code = cmsAd?.code || settings?.centerAdCode || settings?.belowHeroAdCode;
  const isEnabled = (cmsAd && cmsAd.status === "active") || settings?.centerAd || settings?.belowHeroAd;

  if (!isEnabled || !code || code.trim() === "") {
    return null;
  }

  return (
    <div
      id="placement-ad-center"
      className={`my-6 max-w-4xl mx-auto px-4 text-center overflow-hidden ${className}`}
    >
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 relative shadow-2xs">
        <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Sponsored Recommendation</span>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: code }}
          className="inline-block max-w-full overflow-hidden text-xs sm:text-sm text-slate-700 leading-relaxed"
        />
      </div>
    </div>
  );
}

/**
 * 5. Bottom Placement (Sticky footer or above global footer)
 * Compact and dismissible so it never blocks UI elements.
 */
export function BottomAdPlacement({ settings, ads, className = "" }: PlacementProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const cmsAd = findActiveAd(ads, "bottom");
  const code = cmsAd?.code || settings?.bottomAdCode || settings?.footerAdCode;
  const isEnabled = (cmsAd && cmsAd.status === "active") || settings?.bottomAd || settings?.footerAd;

  if (!isEnabled || !code || code.trim() === "") {
    return null;
  }

  return (
    <div
      id="placement-ad-bottom"
      className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-4 shadow-lg transition-all ${className}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex-1 text-center overflow-hidden">
          <div
            dangerouslySetInnerHTML={{ __html: code }}
            className="inline-block max-w-full overflow-hidden text-xs text-slate-700"
          />
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          title="Dismiss ad"
          aria-label="Close Ad"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
