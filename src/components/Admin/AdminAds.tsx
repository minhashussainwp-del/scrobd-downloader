import React, { useState, useEffect } from "react";
import { AdSettings } from "../../types";
import {
  Sparkles,
  Save,
  Check,
  ExternalLink,
  ShieldAlert,
  Clock,
  Layout,
  Globe,
  Layers,
  Code2,
  Eye,
  AlertTriangle,
  RotateCcw,
  Zap,
  MousePointerClick,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";
import { hasValidAdUrl, isNewTabAdEligible } from "../../utils/adTrigger";

interface AdminAdsProps {
  settings: AdSettings;
  onSaveSettings: (settings: AdSettings) => void;
}

export function AdminAds({ settings, onSaveSettings }: AdminAdsProps) {
  const [form, setForm] = useState<AdSettings>(() => ({
    ...settings,
    headerAd: settings.headerAd ?? false,
    headerAdCode: settings.headerAdCode ?? "",
    belowHeroAd: settings.belowHeroAd ?? false,
    belowHeroAdCode: settings.belowHeroAdCode ?? "",
    inFeedAd: settings.inFeedAd ?? false,
    inFeedAdCode: settings.inFeedAdCode ?? "",
    sidebarAd: settings.sidebarAd ?? false,
    sidebarAdCode: settings.sidebarAdCode ?? "",
    footerAd: settings.footerAd ?? false,
    footerAdCode: settings.footerAdCode ?? "",
    adSenseScript: settings.adSenseScript ?? "",
  }));

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [stats, setStats] = useState({ impressions: 0, clicks: 0 });
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  // Sync state if settings prop changes externally
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...settings,
    }));
  }, [settings]);

  // Load telemetry stats
  useEffect(() => {
    try {
      const imp = parseInt(localStorage.getItem("scribd_ad_impressions") || "0", 10);
      const clk = parseInt(localStorage.getItem("scribd_ad_clicks") || "0", 10);
      setStats({ impressions: imp, clicks: clk });
    } catch (_) {}
  }, []);

  const handleResetStats = () => {
    try {
      localStorage.setItem("scribd_ad_impressions", "0");
      localStorage.setItem("scribd_ad_clicks", "0");
      setStats({ impressions: 0, clicks: 0 });
    } catch (_) {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Check state of the Download Button New Tab Ad
  const isDownloadAdReady = form.enabled && form.newTabOnDownload && hasValidAdUrl(form.newTabUrl);
  const isDownloadAdSafeMode = form.enabled && form.newTabOnDownload && !hasValidAdUrl(form.newTabUrl);

  const testNewTabAd = () => {
    if (!form.enabled) {
      setTestResultMsg("❌ Ads are globally disabled. No tab will open.");
      return;
    }
    if (!form.newTabOnDownload) {
      setTestResultMsg("❌ 'New-Tab on Download' is turned OFF. No tab will open.");
      return;
    }
    if (!hasValidAdUrl(form.newTabUrl)) {
      setTestResultMsg("⚠️ Safe Mode Active: Ad URL is empty! As per your rule, NO new tab will open.");
      return;
    }
    let url = form.newTabUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    setTestResultMsg("✅ Opened configured ad URL in new tab! (In production, PDF process runs simultaneously in the original tab)");
  };

  return (
    <div className="space-y-6" id="admin-ads-manager">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            Monetization & Ad Networks Manager
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Advertisement & Revenue Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage ad placement slots (Header, Below Hero, Footer, Sidebar), download-click popunders, and countdown interstitials with individual enable/disable controls.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Advertisement settings have been saved and applied across the website in real-time!</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">Live In-Memory & LocalStorage Updated</span>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Global Status</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${form.enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            <span className="text-base font-extrabold text-slate-900">
              {form.enabled ? "Ads Active" : "Ads Disabled"}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Download PDF Ad</p>
          <div className="mt-1 flex items-center gap-1.5">
            {isDownloadAdReady ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready (New Tab)
              </span>
            ) : isDownloadAdSafeMode ? (
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Safe Mode (No URL)
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Disabled
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Impressions</p>
          <p className="text-base font-extrabold text-indigo-600 mt-1">{stats.impressions.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Clicks</p>
            <p className="text-base font-extrabold text-purple-600 mt-1">{stats.clicks.toLocaleString()}</p>
          </div>
          <button
            type="button"
            onClick={handleResetStats}
            title="Reset click telemetry"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Settings */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Master Switch */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Master Advertisement Switch</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Globally turn all advertising, sponsored banners, countdown modals, and download popunders ON or OFF across the entire site.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* 2. CORE USER REQUIREMENT: Download PDF Button New-Tab Ad */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 p-6 rounded-2xl border-2 border-indigo-200 shadow-xs space-y-5" id="download-pdf-ad-config">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-indigo-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Download PDF Button Ad (New Tab on Click)
                    </h3>
                    <p className="text-[11px] text-indigo-700 font-medium">
                      Same tab me PDF process, New tab me Ad (Strict Condition Aware)
                    </p>
                  </div>
                </div>
              </div>

              {/* Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">
                  {form.newTabOnDownload ? "Enabled" : "Disabled"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={form.newTabOnDownload}
                    onChange={(e) => setForm({ ...form, newTabOnDownload: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Explanation box explaining the exact logic requested */}
            <div className="p-3.5 bg-white/90 rounded-xl border border-indigo-100 text-xs space-y-2 text-slate-700">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">How this works (Aapke rules ke mutabiq):</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                    <li>
                      <strong>Same Tab:</strong> User jab "Download PDF" par click karega to PDF extraction aur download process <strong>isi tab</strong> me chalega bina kisi rukawat ke.
                    </li>
                    <li>
                      <strong>New Tab:</strong> Sponsored Ad <strong>naye tab</strong> me open hogi.
                    </li>
                    <li>
                      <strong className="text-indigo-800">Strict Safety Rule:</strong> Ad tabhi new tab me open hogi jab ye feature <strong>Enable</strong> ho AUR <strong>Ad URL bhara hua ho</strong>.
                    </li>
                    <li>
                      <strong className="text-amber-800">Empty URL Guard:</strong> Agar toggle Enable hai lekin niche Ad URL <strong>khali / blank</strong> hai, to koi bhi new tab ya blank window open <strong>nahi hogi</strong>!
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* URL Input & Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sponsored Ad Target URL (New Tab Destination)</span>
                </label>
                <span className="text-[10px] text-slate-500">
                  Must be a valid destination link (e.g. your affiliate link or ad network)
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={form.newTabUrl}
                  onChange={(e) => {
                    setForm({ ...form, newTabUrl: e.target.value });
                    setTestResultMsg(null);
                  }}
                  placeholder="https://example.com/your-sponsored-link (Khali chhorne par new tab open nahi hoga)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <button
                  type="button"
                  onClick={testNewTabAd}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Open Tab</span>
                </button>
                {form.newTabUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, newTabUrl: "" });
                      setTestResultMsg(null);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition cursor-pointer shrink-0"
                    title="Clear URL to test Safe Mode"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Indicator */}
              <div className="pt-1 flex items-center justify-between text-xs">
                {isDownloadAdReady ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Status: Active & Attached — Will open in new tab on PDF download</span>
                  </span>
                ) : isDownloadAdSafeMode ? (
                  <span className="text-amber-800 font-semibold flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Safe Mode: Toggle is ON but URL is empty — NO new tab will open</span>
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Status: Feature is currently disabled</span>
                  </span>
                )}
              </div>

              {testResultMsg && (
                <div className="p-2.5 bg-slate-900 text-white rounded-xl text-xs font-mono">
                  {testResultMsg}
                </div>
              )}
            </div>
          </div>

          {/* 3. Ad Placement Slots Manager */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Website Ad Placement Slots
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enable or disable ads in specific locations across the website, and attach custom HTML/AdSense code or fallback banners.
              </p>
            </div>

            <div className="divide-y divide-slate-100 space-y-5">
              {/* Slot 1: Header Banner Ad */}
              <div className="pt-4 first:pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-indigo-600" />
                      <span>1. Header Top Banner Ad</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Displays a responsive 728x90 or slim sponsor announcement above the main navbar.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={form.headerAd}
                      onChange={(e) => setForm({ ...form, headerAd: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {form.headerAd && (
                  <div className="pl-5 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Custom Ad Code / HTML (Optional - Leave blank to use native sponsor banner):
                    </label>
                    <textarea
                      rows={2}
                      value={form.headerAdCode || ""}
                      onChange={(e) => setForm({ ...form, headerAdCode: e.target.value })}
                      placeholder="<!-- Paste Google AdSense <ins> or custom banner HTML -->"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Slot 2: Below Downloader / Hero Bottom */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-600" />
                      <span>2. Below Downloader Hero Ad (Homepage)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Displays a high-visibility leaderboard banner immediately below the URL input card.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={form.belowHeroAd}
                      onChange={(e) => setForm({ ...form, belowHeroAd: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {form.belowHeroAd && (
                  <div className="pl-5 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Custom Ad Code / HTML (Optional):
                    </label>
                    <textarea
                      rows={2}
                      value={form.belowHeroAdCode || ""}
                      onChange={(e) => setForm({ ...form, belowHeroAdCode: e.target.value })}
                      placeholder="<!-- Paste Google AdSense or HTML ad code -->"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Slot 3: Pre-Download Interstitial Countdown */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span>3. Pre-Download Countdown Interstitial Modal</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Shows a modal countdown (2-5s) with a sponsor message before initiating the file download.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={form.preDownloadAd}
                      onChange={(e) => setForm({ ...form, preDownloadAd: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {form.preDownloadAd && (
                  <div className="pl-5 flex items-center gap-3 pt-1">
                    <span className="text-xs text-slate-600 font-semibold">Countdown duration:</span>
                    <select
                      value={form.preDownloadSeconds}
                      onChange={(e) => setForm({ ...form, preDownloadSeconds: Number(e.target.value) })}
                      className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-bold text-slate-800"
                    >
                      <option value={2}>2 Seconds</option>
                      <option value={3}>3 Seconds (Recommended)</option>
                      <option value={5}>5 Seconds</option>
                      <option value={10}>10 Seconds</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Slot 4: Post-Download Recommendation Card */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>4. Post-Download Recommendation Card</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Displays a clean companion banner under the completed document result box.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={form.postDownloadAd}
                      onChange={(e) => setForm({ ...form, postDownloadAd: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Slot 5: In-Feed / Slide Viewer Ad */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>5. In-Feed Slide Viewer Ad</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Inserts a sponsored slide or banner inside the horizontal slide preview gallery.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={form.inFeedAd}
                      onChange={(e) => setForm({ ...form, inFeedAd: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {form.inFeedAd && (
                  <div className="pl-5 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Custom Slide/Banner Ad Code (Optional):
                    </label>
                    <textarea
                      rows={2}
                      value={form.inFeedAdCode || ""}
                      onChange={(e) => setForm({ ...form, inFeedAdCode: e.target.value })}
                      placeholder="<!-- Custom slide HTML banner -->"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Slot 6: Desktop Sidebar Ad */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-blue-600" />
                      <span>6. Desktop Sidebar Ad Slot</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Sticky 300x250 or 300x600 banner slot inside the blog & tools desktop sidebar.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={form.sidebarAd}
                      onChange={(e) => setForm({ ...form, sidebarAd: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {form.sidebarAd && (
                  <div className="pl-5 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Custom Sidebar Ad Code (Optional):
                    </label>
                    <textarea
                      rows={2}
                      value={form.sidebarAdCode || ""}
                      onChange={(e) => setForm({ ...form, sidebarAdCode: e.target.value })}
                      placeholder="<!-- 300x250 or responsive sidebar code -->"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Slot 7: Footer Banner Ad */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-600" />
                      <span>7. Footer Ad Banner (Above Global Footer)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Full-width banner appearing right above the footer on all pages.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={form.footerAd}
                      onChange={(e) => setForm({ ...form, footerAd: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {form.footerAd && (
                  <div className="pl-5 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600">
                      Custom Footer Ad Code (Optional):
                    </label>
                    <textarea
                      rows={2}
                      value={form.footerAdCode || ""}
                      onChange={(e) => setForm({ ...form, footerAdCode: e.target.value })}
                      placeholder="<!-- Footer banner HTML or script -->"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Global Ad Network Script (Google AdSense) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Global Ad Network Script (e.g. Google AdSense)
                </h3>
                <p className="text-xs text-slate-500">
                  Paste your AdSense auto-ads snippet or network header script. It will be loaded dynamically on all pages.
                </p>
              </div>
            </div>
            <textarea
              rows={3}
              value={form.adSenseScript || ""}
              onChange={(e) => setForm({ ...form, adSenseScript: e.target.value })}
              placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>'
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* 5. Sponsored Creative Content Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Default Sponsored Creative Content
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Sponsor Brand Name</label>
              <input
                type="text"
                value={form.sponsorName}
                onChange={(e) => setForm({ ...form, sponsorName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Sponsor Tagline / Description</label>
              <textarea
                rows={2}
                value={form.sponsorTagline}
                onChange={(e) => setForm({ ...form, sponsorTagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Call-to-Action Text</label>
                <input
                  type="text"
                  value={form.sponsorCta}
                  onChange={(e) => setForm({ ...form, sponsorCta: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Target URL</label>
                <input
                  type="url"
                  value={form.newTabUrl}
                  onChange={(e) => setForm({ ...form, newTabUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Preview & Save Actions */}
        <div className="space-y-5">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 sticky top-6">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Live Preview of Sponsored Unit
            </h4>

            {/* Simulated Live Unit */}
            <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  Ad Preview
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Responsive Card</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{form.sponsorName || "Sponsor Title"}</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">{form.sponsorTagline || "Sponsor copy description."}</p>
              <a
                href={form.newTabUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!form.newTabUrl) e.preventDefault();
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition"
              >
                <span>{form.sponsorCta || "Learn More"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Download Button Ad Test Simulation */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Download Click Simulation
              </span>
              <p className="text-[11px] text-slate-600">
                Test how the download button behaves with current settings:
              </p>
              <button
                type="button"
                onClick={testNewTabAd}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulate "Download PDF" Click</span>
              </button>
            </div>

            <button
              type="submit"
              id="save-ad-settings-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save Advertisement Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
