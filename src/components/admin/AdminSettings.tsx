import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Download,
  Upload,
  Sparkles,
  Shield,
  Code,
  Globe,
  Loader2,
} from "lucide-react";

export function AdminSettings() {
  const [settings, setSettings] = useState<any>({
    siteName: "Scribd Downloader",
    tagline: "Free & Fast Scribd Document Downloader to PDF / TXT",
    siteUrl: "https://scribddownloader.org",
    adminEmail: "admin@scribddownloader.org",
    defaultLanguage: "en",
    gaId: "G-XXXXXXXXXX",
    enableAiAssistant: true,
    maxDownloadPages: 500,
    enableDirectDownload: true,
    headerScripts: "",
    footerScripts: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "engine" | "scripts" | "backup">("general");

  const handleChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      // simulate save / store in local storage or server endpoint
      localStorage.setItem("cms_global_settings", JSON.stringify(settings));
      setSaveMessage("Settings successfully saved!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const [pagesRes, postsRes, adsRes] = await Promise.all([
        fetch("/api/admin/pages"),
        fetch("/api/admin/posts"),
        fetch("/api/admin/ads"),
      ]);
      const backup = {
        timestamp: new Date().toISOString(),
        settings,
        pages: (await pagesRes.json()).pages || [],
        posts: (await postsRes.json()).posts || [],
        ads: (await adsRes.json()).ads || [],
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scribd-cms-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export backup: " + err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>Platform & CMS Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure platform branding, analytics scripts, downloader engine parameters, and site-wide preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save All Settings</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-slate-200 bg-slate-50/70 px-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "general"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            General Branding
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("engine")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "engine"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Downloader Engine
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("scripts")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "scripts"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Analytics & Scripts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("backup")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "backup"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Backup & Export
          </button>
        </div>

        {/* Tab 1: General */}
        {activeTab === "general" && (
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Domain URL</label>
                <input
                  type="text"
                  value={settings.siteUrl}
                  onChange={(e) => handleChange("siteUrl", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Site Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Admin Notification Email</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleChange("adminEmail", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Default Base Language</label>
                <select
                  value={settings.defaultLanguage}
                  onChange={(e) => handleChange("defaultLanguage", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none"
                >
                  <option value="en">English (US)</option>
                  <option value="id">Indonesian (Bahasa Indonesia)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="nl">Dutch (Nederlands)</option>
                  <option value="ur">Urdu (اردو)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Downloader Engine */}
        {activeTab === "engine" && (
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Maximum Document Pages Processed</label>
                <input
                  type="number"
                  value={settings.maxDownloadPages}
                  onChange={(e) => handleChange("maxDownloadPages", parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Prevents server resource exhaustion on gigantic files.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Direct Download Streaming</label>
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableDirectDownload}
                      onChange={(e) => handleChange("enableDirectDownload", e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-800">Allow instant browser PDF download stream</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Analytics & Scripts */}
        {activeTab === "scripts" && (
          <div className="p-5 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Google Analytics Measurement ID</label>
              <input
                type="text"
                value={settings.gaId}
                onChange={(e) => handleChange("gaId", e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Custom Header Code Injection (&lt;head&gt;)
              </label>
              <textarea
                rows={4}
                value={settings.headerScripts}
                onChange={(e) => handleChange("headerScripts", e.target.value)}
                placeholder="<!-- Paste Google Tag Manager or meta verification tags here -->"
                className="w-full p-3 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Custom Footer Code Injection (before &lt;/body&gt;)
              </label>
              <textarea
                rows={4}
                value={settings.footerScripts}
                onChange={(e) => handleChange("footerScripts", e.target.value)}
                placeholder="<!-- Paste tracking pixels or custom chat scripts here -->"
                className="w-full p-3 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Backup & Export */}
        {activeTab === "backup" && (
          <div className="p-5 space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="font-bold text-slate-800">Complete CMS Data Backup</div>
              <p className="text-slate-600 text-[11px]">
                Export all static pages, blog articles, translations, media metadata, ad placements, and configurations into a single portable JSON file.
              </p>
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Export Full CMS Snapshot (.json)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
