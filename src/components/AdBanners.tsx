import React, { useState, useEffect } from "react";
import { ExternalLink, Sparkles, ShieldAlert, X, Zap, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { AdSettings } from "../types";

interface AdBannerProps {
  settings: AdSettings;
  onAdClick?: () => void;
}

// Track ad impression
function recordImpression() {
  try {
    const raw = localStorage.getItem("scribd_ad_impressions") || "0";
    localStorage.setItem("scribd_ad_impressions", String(parseInt(raw, 10) + 1));
  } catch (e) {
    console.error(e);
  }
}

// Track ad click
function recordClick() {
  try {
    const raw = localStorage.getItem("scribd_ad_clicks") || "0";
    localStorage.setItem("scribd_ad_clicks", String(parseInt(raw, 10) + 1));
  } catch (e) {
    console.error(e);
  }
}

/**
 * 11. Sidebar Ad Banner (Sticky, Responsive, AdBlock Fallback aware)
 */
export function SidebarAdBanner({ settings, onAdClick }: AdBannerProps) {
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    recordImpression();
    // Simple adblock heuristic detection
    const testAd = document.createElement("div");
    testAd.className = "adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAds banner-ad text-ad-links";
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
  }, []);

  if (!settings.enabled || !settings.sidebarAd) return null;

  if (adBlocked && settings.adblockNotice) {
    return (
      <aside aria-label="Support Our Service" className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-2.5 shadow-xs" id="adblock-sidebar-notice">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Ad Blocker Detected</span>
        </div>
        <p className="text-amber-800 leading-relaxed text-[11px]">
          We keep document extractions 100% free through non-intrusive sponsors. Please consider whitelisting our website!
        </p>
      </aside>
    );
  }

  if (settings.sidebarAdCode && settings.sidebarAdCode.trim() !== "") {
    return (
      <aside aria-label="Sponsored Content" className="my-4 text-center overflow-hidden" id="sidebar-custom-ad">
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
          <span>Sponsored</span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-mono">Ad</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: settings.sidebarAdCode }} />
      </aside>
    );
  }

  return (
    <aside aria-label="Sponsored Content" className="bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-slate-50 border border-indigo-100 rounded-2xl p-4 sm:p-5 relative overflow-hidden group shadow-xs" id="sidebar-ad-card">
      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
        <span>Sponsored Partner</span>
        <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-mono">Ad</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
            {settings.sponsorName}
          </h4>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          {settings.sponsorTagline}
        </p>

        <a
          href={settings.newTabUrl || "https://pdfviewer.org"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            recordClick();
            onAdClick?.();
          }}
          className="w-full mt-2 py-2 px-3 rounded-lg bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition group-hover:border-indigo-400"
        >
          <span>{settings.sponsorCta}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
}

/**
 * 9. Pre-Download Ad Interstitial Modal with Countdown
 */
interface PreDownloadModalProps {
  isOpen: boolean;
  settings: AdSettings;
  onComplete?: () => void;
  onCancel?: () => void;
  seconds?: number;
  onCountdownComplete?: () => void;
  onClose?: () => void;
}

export function PreDownloadModal({
  isOpen,
  settings,
  onComplete,
  onCancel,
  seconds,
  onCountdownComplete,
  onClose,
}: PreDownloadModalProps) {
  const initialSeconds =
    seconds !== undefined ? seconds : settings.preDownloadSeconds || 3;
  const [countdown, setCountdown] = useState(initialSeconds);

  const handleFinish = onComplete || onCountdownComplete || (() => {});
  const handleDismiss = onCancel || onClose || (() => {});

  useEffect(() => {
    if (!isOpen) return;
    recordImpression();
    setCountdown(initialSeconds);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, initialSeconds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 text-center relative animate-in zoom-in-95 duration-200" id="pre-download-ad-modal">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            Sponsored Fast Download Link
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            Preparing Your Clean PDF Document
          </h3>
          <p className="text-xs text-slate-500">
            Your high-speed extraction is ready. Please view a short message from our sponsor.
          </p>
        </div>

        {/* Sponsored Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 text-left space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{settings.sponsorName}</p>
                <p className="text-[10px] text-slate-500">Verified Document Utility</p>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
              Ad
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {settings.sponsorTagline}
          </p>

          <a
            href={settings.newTabUrl || "https://pdfviewer.org"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={recordClick}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>{settings.sponsorCta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Countdown & Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            id="proceed-download-btn"
            disabled={countdown > 0}
            onClick={handleFinish}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
              countdown > 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 cursor-pointer active:scale-98"
            }`}
          >
            {countdown > 0 ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                <span>Download starts in {countdown}s...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Start Direct PDF Download Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {countdown > 0 && (
            <button
              type="button"
              id="skip-ad-btn"
              onClick={handleFinish}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer"
            >
              Skip countdown & download immediately
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 10. Post-Download Ad Banner
 */
export function PostDownloadAdBanner({ settings }: AdBannerProps) {
  if (!settings.enabled || !settings.postDownloadAd) return null;

  return (
    <div className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 shadow-xs" id="post-download-ad-banner">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-900">{settings.sponsorName}</h4>
            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">Sponsor</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Need to edit, sign, or merge your downloaded PDF? Use our recommended cloud companion tool.
          </p>
        </div>
      </div>

      <a
        href={settings.newTabUrl || "https://pdfviewer.org"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={recordClick}
        className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
      >
        <span>{settings.sponsorCta}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

/**
 * 12. Interstitial / Popup Ad Modal (Timed or Triggered)
 */
interface PopupAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdSettings;
}

export function PopupAdModal({ isOpen, onClose, settings }: PopupAdModalProps) {
  if (!isOpen || !settings.enabled || !settings.popupAd) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4 relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
          aria-label="Close Ad"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Featured Tool</span>
          <h3 className="text-base font-extrabold text-slate-900">{settings.sponsorName}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {settings.sponsorTagline}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <a
            href={settings.newTabUrl || "https://pdfviewer.org"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              recordClick();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <span>{settings.sponsorCta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline font-medium"
          >
            Continue to website
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Header Ad Banner Unit (728x90 responsive leaderboard / banner)
 */
export function HeaderAdBanner({ settings, onAdClick }: AdBannerProps) {
  useEffect(() => {
    recordImpression();
  }, []);

  if (!settings.enabled || !settings.headerAd) return null;

  if (settings.headerAdCode && settings.headerAdCode.trim() !== "") {
    return (
      <div id="header-custom-ad" className="my-2 max-w-5xl mx-auto text-center overflow-hidden">
        <div dangerouslySetInnerHTML={{ __html: settings.headerAdCode }} />
      </div>
    );
  }

  return (
    <div
      id="header-ad-banner"
      className="bg-white rounded-xl border border-slate-200/90 p-3 sm:px-5 sm:py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
          Ad
        </span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-slate-900 mr-2">
              {settings.sponsorName}:
            </span>
            <span className="text-xs text-slate-600 truncate">
              {settings.sponsorTagline}
            </span>
          </div>
        </div>
      </div>

      <a
        href={settings.newTabUrl || "https://pdfviewer.org"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          recordClick();
          onAdClick?.();
        }}
        className="shrink-0 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold inline-flex items-center gap-1.5 transition"
      >
        <span>{settings.sponsorCta}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

/**
 * Below Hero Ad Banner Unit (Homepage Leaderboard)
 */
export function BelowHeroAdBanner({ settings, onAdClick }: AdBannerProps) {
  useEffect(() => {
    recordImpression();
  }, []);

  if (!settings.enabled || !settings.belowHeroAd) return null;

  if (settings.belowHeroAdCode && settings.belowHeroAdCode.trim() !== "") {
    return (
      <div id="below-hero-custom-ad" className="my-6 max-w-5xl mx-auto text-center overflow-hidden">
        <div dangerouslySetInnerHTML={{ __html: settings.belowHeroAdCode }} />
      </div>
    );
  }

  return (
    <div
      id="below-hero-ad-banner"
      className="my-6 max-w-5xl mx-auto rounded-2xl bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 border border-blue-100/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Featured Tool Partner</span>
            <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[10px] font-mono">Ad</span>
          </div>
          <h4 className="text-xs font-extrabold text-slate-900 mt-0.5">{settings.sponsorName}</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">{settings.sponsorTagline}</p>
        </div>
      </div>
      <a
        href={settings.newTabUrl || "https://pdfviewer.org"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          recordClick();
          onAdClick?.();
        }}
        className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
      >
        <span>{settings.sponsorCta}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

/**
 * Footer Ad Banner Unit (Above Global Footer)
 */
export function FooterAdBanner({ settings, onAdClick }: AdBannerProps) {
  useEffect(() => {
    recordImpression();
  }, []);

  if (!settings.enabled || !settings.footerAd) return null;

  if (settings.footerAdCode && settings.footerAdCode.trim() !== "") {
    return (
      <div id="footer-custom-ad" className="w-full text-center overflow-hidden py-3 bg-slate-900 border-t border-slate-800">
        <div dangerouslySetInnerHTML={{ __html: settings.footerAdCode }} />
      </div>
    );
  }

  return (
    <div
      id="footer-ad-banner"
      className="w-full bg-slate-900 text-slate-200 border-t border-slate-800 py-3.5 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white mr-2">{settings.sponsorName}:</span>
            <span className="text-slate-400">{settings.sponsorTagline}</span>
          </div>
        </div>
        <a
          href={settings.newTabUrl || "https://pdfviewer.org"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            recordClick();
            onAdClick?.();
          }}
          className="shrink-0 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
        >
          <span>{settings.sponsorCta}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

/**
 * In-Feed Ad Banner Unit (Inside blog posts and guide feeds)
 */
export function InFeedAdBanner({ settings, onAdClick }: AdBannerProps) {
  useEffect(() => {
    recordImpression();
  }, []);

  if (!settings.enabled || !settings.inFeedAd) return null;

  if (settings.inFeedAdCode && settings.inFeedAdCode.trim() !== "") {
    return (
      <aside aria-label="Sponsored In-Feed Announcement" id="in-feed-custom-ad" className="my-6 text-center overflow-hidden">
        <div dangerouslySetInnerHTML={{ __html: settings.inFeedAdCode }} />
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sponsored In-Feed Announcement"
      id="in-feed-ad-banner"
      className="my-8 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-slate-50 border border-indigo-100 p-5 sm:p-6 shadow-xs relative overflow-hidden"
    >
      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">
        <span className="flex items-center gap-1 text-indigo-600">
          <Sparkles className="w-3.5 h-3.5" /> Recommended Productivity Utility
        </span>
        <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-mono">
          Sponsored
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm sm:text-base font-bold text-slate-900">
            {settings.sponsorName}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            {settings.sponsorTagline} — Fast, zero-registration, browser-based PDF suite with multi-format export.
          </p>
        </div>

        <a
          href={settings.newTabUrl || "https://pdfviewer.org"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            recordClick();
            onAdClick?.();
          }}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs transition"
        >
          <span>{settings.sponsorCta}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
}

/**
 * AdBlock Detector Alert / Popup
 */
export function AdBlockDetector() {
  const [detected, setDetected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    if (sessionStorage.getItem("scribd_adblock_dismissed")) {
      return;
    }

    const testAd = document.createElement("div");
    testAd.className =
      "adsbox pub_300x250 pub_300x250m pub_728x90 text-ad textAds banner-ad text-ad-links";
    testAd.style.height = "1px";
    testAd.style.position = "absolute";
    testAd.style.left = "-9999px";
    document.body.appendChild(testAd);

    const timer = setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        setDetected(true);
      }
      testAd.remove();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("scribd_adblock_dismissed", "true");
  };

  if (!detected || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm bg-white rounded-2xl border border-amber-300 shadow-xl p-4 space-y-3 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1 pr-6">
          <h4 className="text-xs font-bold text-slate-900">
            Ad Blocker Detected
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            We offer our document conversion completely free of charge. Please consider disabling your ad blocker or adding us to your whitelist to support server upkeep.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          I understand
        </button>
      </div>
    </div>
  );
}

