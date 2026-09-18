import React, { useState, useRef } from "react";
import { SiteSettings, DownloadSettings, AuthorProfile } from "../../types";
import {
  Save,
  Check,
  ShieldCheck,
  Sliders,
  Bell,
  Code,
  HardDrive,
  AlertTriangle,
  User,
  Upload,
  Camera,
  RotateCcw
} from "lucide-react";
import { useAuthorProfile, DEFAULT_AUTHOR_PROFILE } from "../../data/authorData";

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
  const { profile: authorProfile, updateProfile: updateAuthorProfile, resetProfile: resetAuthorProfile } = useAuthorProfile();
  const [authorForm, setAuthorForm] = useState<AuthorProfile>(authorProfile);
  const [siteForm, setSiteForm] = useState<SiteSettings>(siteSettings);
  const [downloadForm, setDownloadForm] = useState<DownloadSettings>(downloadSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [authorImageUploadError, setAuthorImageUploadError] = useState("");
  const authorFileRef = useRef<HTMLInputElement>(null);

  const handleAuthorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAuthorImageUploadError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAuthorImageUploadError("File exceeds 5MB. Please choose a smaller image.");
      return;
    }

    setAuthorImageUploadError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setAuthorForm((prev) => ({ ...prev, avatar: res }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteSettings(siteForm);
    onSaveDownloadSettings(downloadForm);
    updateAuthorProfile(authorForm);
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

        {/* 5. Author Profile & Bio Settings (Minhas Hussain) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Author & Developer Profile (Minhas Hussain)</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                resetAuthorProfile();
                setAuthorForm(DEFAULT_AUTHOR_PROFILE);
              }}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Author Photo / Avatar Uploader */}
            <div className="md:col-span-4 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold text-slate-800 block">Author Photo / Avatar</label>
              
              <div className="flex items-center gap-4">
                <img
                  src={authorForm.avatar}
                  alt={authorForm.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm bg-white shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-2 flex-1 min-w-0">
                  <input
                    type="file"
                    ref={authorFileRef}
                    accept="image/*"
                    onChange={handleAuthorImageUpload}
                    className="hidden"
                    id="admin-author-photo-file"
                  />
                  <button
                    type="button"
                    onClick={() => authorFileRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <p className="text-[10px] text-slate-500">
                    JPG, PNG, WebP up to 5MB.
                  </p>
                </div>
              </div>

              {authorImageUploadError && (
                <p className="text-xs text-red-600">{authorImageUploadError}</p>
              )}

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-semibold text-slate-600">Or Paste Image URL</label>
                <input
                  type="url"
                  value={authorForm.avatar}
                  onChange={(e) => setAuthorForm({ ...authorForm, avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Author Details Inputs */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Author Name</label>
                  <input
                    type="text"
                    required
                    value={authorForm.name}
                    onChange={(e) => setAuthorForm({ ...authorForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={authorForm.email}
                    onChange={(e) => setAuthorForm({ ...authorForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Role & Title</label>
                  <input
                    type="text"
                    required
                    value={authorForm.role}
                    onChange={(e) => setAuthorForm({ ...authorForm, role: e.target.value })}
                    placeholder="e.g. SEO Expert & Full Stack Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Secondary Specialization</label>
                  <input
                    type="text"
                    value={authorForm.title || ""}
                    onChange={(e) => setAuthorForm({ ...authorForm, title: e.target.value })}
                    placeholder="e.g. WordPress Website Designer & Vibe Coder"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Biography</label>
                <textarea
                  rows={3}
                  required
                  value={authorForm.bio}
                  onChange={(e) => setAuthorForm({ ...authorForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Specialization Tags (comma separated)</label>
                <input
                  type="text"
                  value={authorForm.skills.join(", ")}
                  onChange={(e) => setAuthorForm({
                    ...authorForm,
                    skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
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
