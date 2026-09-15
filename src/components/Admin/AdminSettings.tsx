import React, { useState } from "react";
import { SiteSettings, DownloadSettings } from "../../types";
import { Save, Check, ShieldCheck, Sliders, Bell, Code, HardDrive, AlertTriangle } from "lucide-react";

interface AdminSettingsProps {
  siteSettings: SiteSettings;
  downloadSettings: DownloadSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
  onSaveDownloadSettings: (settings: DownloadSettings) => void;
}

export function AdminSettings({
  siteSettings,
  downloadSettings,
  onSaveSiteSettings,
  onSaveDownloadSettings,
}: AdminSettingsProps) {
  const [siteForm, setSiteForm] = useState<SiteSettings>(siteSettings);
  const [downloadForm, setDownloadForm] = useState<DownloadSettings>(downloadSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteSettings(siteForm);
    onSaveDownloadSettings(downloadForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="admin-site-settings">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
          Global Configuration
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          Site & Download Engine Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Control header notices, custom tracking scripts, footer copyright, download rate limits, and server-side system caching.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Site and system configuration updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. General Site Identity (Item 27) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Site Identity & Meta Defaults</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Site Name</label>
            <input
              type="text"
              required
              value={siteForm.siteName}
              onChange={(e) => setSiteForm({ ...siteForm, siteName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Site Tagline</label>
            <input
              type="text"
              value={siteForm.tagline}
              onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Contact Email</label>
            <input
              type="email"
              value={siteForm.contactEmail}
              onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Default SEO Title</label>
            <input
              type="text"
              value={siteForm.defaultMetaTitle}
              onChange={(e) => setSiteForm({ ...siteForm, defaultMetaTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Default Meta Description</label>
            <textarea
              rows={2}
              value={siteForm.defaultMetaDescription}
              onChange={(e) => setSiteForm({ ...siteForm, defaultMetaDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
          </div>
        </div>

        {/* 2. Download system & Rate Limit Settings (Item 29) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Download Engine & Rate Limits</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Rate Limit Threshold (Requests per minute per IP)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={downloadForm.rateLimitPerMin}
              onChange={(e) => setDownloadForm({ ...downloadForm, rateLimitPerMin: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
            />
            <p className="text-[11px] text-slate-400">Protects backend system from automated bots and abuse.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Document Cache Expiry Duration (Hours)
            </label>
            <input
              type="number"
              min={1}
              max={72}
              value={downloadForm.cacheDurationHours}
              onChange={(e) => setDownloadForm({ ...downloadForm, cacheDurationHours: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
            />
            <p className="text-[11px] text-slate-400">Pre-compiled vector PDF files are cached in memory/disk for instant re-download.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Max Document File Size Limit (MB)
            </label>
            <input
              type="number"
              min={10}
              max={500}
              value={downloadForm.maxFileSizeMb}
              onChange={(e) => setDownloadForm({ ...downloadForm, maxFileSizeMb: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={downloadForm.autoDownloadDefault}
                onChange={(e) => setDownloadForm({ ...downloadForm, autoDownloadDefault: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-800">
                Auto-download PDF trigger enabled by default
              </span>
            </label>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Strict PDF-Only Constraint</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Downloads strictly generate universal .pdf files. ZIP compression and image dumps remain permanently disabled.
            </p>
          </div>
        </div>

        {/* 3. Header & Footer Management (Item 26) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Custom Header & Footer Management</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Header Announcement Banner */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={siteForm.noticeBannerEnabled}
                  onChange={(e) => setSiteForm({ ...siteForm, noticeBannerEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Enable Top Announcement Banner</span>
              </label>

              <input
                type="text"
                value={siteForm.noticeBannerText}
                onChange={(e) => setSiteForm({ ...siteForm, noticeBannerText: e.target.value })}
                placeholder="Announcement banner text..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
              />

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700">Custom Header Code (&lt;head&gt;)</label>
                <textarea
                  rows={3}
                  value={siteForm.headerScripts}
                  onChange={(e) => setSiteForm({ ...siteForm, headerScripts: e.target.value })}
                  placeholder="<!-- Google Analytics tag, verification tags, or custom css -->"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            {/* Footer Copyright & Scripts */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Footer Copyright Text</label>
                <input
                  type="text"
                  value={siteForm.footerCopyright}
                  onChange={(e) => setSiteForm({ ...siteForm, footerCopyright: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700">Custom Footer Code (&lt;body&gt; end)</label>
                <textarea
                  rows={3}
                  value={siteForm.footerScripts}
                  onChange={(e) => setSiteForm({ ...siteForm, footerScripts: e.target.value })}
                  placeholder="<!-- Custom analytics script, chat widgets, or conversion pixels -->"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          id="save-all-settings-btn"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>
    </form>
  );
}
