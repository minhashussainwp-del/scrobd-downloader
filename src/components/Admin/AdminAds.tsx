import React, { useState } from "react";
import { AdSettings } from "../../types";
import { Sparkles, Save, Check, ExternalLink, ShieldAlert, Clock, Layout } from "lucide-react";

interface AdminAdsProps {
  settings: AdSettings;
  onSaveSettings: (settings: AdSettings) => void;
}

export function AdminAds({ settings, onSaveSettings }: AdminAdsProps) {
  const [form, setForm] = useState<AdSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6" id="admin-ads-manager">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
          Monetization & Sponsorship
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          Advertisement System Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure pre-download countdown interstitials, new-tab sponsored links, sidebar banners, post-download thank you units, and adblock fallback notices.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Advertisement settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Toggles & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Master Switch */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Master Advertisement Switch</h3>
              <p className="text-xs text-slate-500">Globally enable or disable all sponsored ad units across the application.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Ad Formats Matrix */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Active Ad Unit Formats
            </h3>

            {/* 1. Pre-Download Ad */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900">Pre-Download Interstitial Countdown (Item 9)</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Shows a modal countdown (3-5s) with sponsor recommendation before starting the PDF download.
                </p>
                {form.preDownloadAd && (
                  <div className="flex items-center gap-2 pt-1.5">
                    <span className="text-[11px] text-slate-600 font-semibold">Countdown duration:</span>
                    <select
                      value={form.preDownloadSeconds}
                      onChange={(e) => setForm({ ...form, preDownloadSeconds: Number(e.target.value) })}
                      className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white font-bold"
                    >
                      <option value={2}>2 Seconds</option>
                      <option value={3}>3 Seconds</option>
                      <option value={5}>5 Seconds</option>
                    </select>
                  </div>
                )}
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

            {/* 2. New Tab on Download */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs font-bold text-slate-900">New-Tab Sponsored Link on Download (Item 8)</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Opens a verified sponsored partner tool in a new tab when the user initiates document download.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={form.newTabOnDownload}
                  onChange={(e) => setForm({ ...form, newTabOnDownload: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* 3. Post-Download Ad */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">Post-Download Recommendation Card (Item 10)</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Displays a clean companion banner below the result box suggesting cloud PDF editing/OCR tools.
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

            {/* 4. Sidebar Ad */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900">Sticky Sidebar Ad Slot (Item 11)</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Renders a sponsored card or custom HTML script in the desktop sidebar next to articles and tools.
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

            {/* 5. Adblock Fallback Notice */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-900">Adblock Fallback Notice (Item 13)</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Politely asks users with active ad-blocking software to consider whitelisting our free conversion lab.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={form.adblockNotice}
                  onChange={(e) => setForm({ ...form, adblockNotice: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Sponsor Content Configuration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Sponsored Creative Content
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Sponsor Name</label>
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
                <label className="text-xs font-bold text-slate-700">Destination URL</label>
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

        {/* Right 1 Col: Live Preview & Save */}
        <div className="space-y-5">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Live Preview of Sponsored Unit
            </h4>

            {/* Simulated Live Unit */}
            <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                  Ad Preview
                </span>
                <span className="text-[10px] text-slate-400 font-mono">300x250 unit</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{form.sponsorName || "Sponsor Title"}</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">{form.sponsorTagline || "Sponsor copy description."}</p>
              <button
                type="button"
                className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
              >
                <span>{form.sponsorCta || "Learn More"}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <button
              type="submit"
              id="save-ad-settings-btn"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
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
