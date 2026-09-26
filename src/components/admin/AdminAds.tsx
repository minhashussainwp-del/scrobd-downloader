import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Eye,
  Smartphone,
  Monitor,
  Layers,
  Code,
  Save,
  Loader2,
  ExternalLink,
  MousePointerClick,
  Compass,
  Sliders,
  ShieldCheck,
  Info,
} from "lucide-react";
import { CmsAd, AdSettings } from "../../types";
import { adminFetch } from "../../utils/adminApi";
import { DEFAULT_AD_SETTINGS, saveAdSettings } from "../../data/siteConfig";

export function AdminAds() {
  const [ads, setAds] = useState<CmsAd[]>([]);
  const [placements, setPlacements] = useState<string[]>([
    "Top",
    "Left",
    "Bottom",
    "Right",
    "Center",
    "Button",
    "Header",
    "After Hero",
    "Inside Article",
    "Footer",
    "Sidebar",
    "Mobile Sticky",
  ]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activePlacementFilter, setActivePlacementFilter] = useState<string>("all");

  // Global & Button Ad Settings State
  const [adSettings, setLocalAdSettings] = useState<AdSettings>(DEFAULT_AD_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adsRes, settingsRes] = await Promise.all([
        adminFetch("/api/admin/ads"),
        adminFetch("/api/admin/ad-settings"),
      ]);

      if (adsRes.ok) {
        const adsData = await adsRes.json();
        setAds(adsData.ads || []);
        if (adsData.placements?.length) {
          setPlacements(adsData.placements);
        }
      }

      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        if (sData.adSettings) {
          setLocalAdSettings(sData.adSettings);
          saveAdSettings(sData.adSettings);
        }
      }
    } catch (err) {
      console.error("Load ads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (ad: any) => {
    const updated = { ...ad, status: ad.status === "active" ? "disabled" : "active" };
    try {
      const res = await adminFetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      setAds(data.ads || []);
    } catch (err) {
      console.error("Toggle ad error:", err);
    }
  };

  const handleSaveAd = async () => {
    if (!editingAd || !editingAd.name) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAd),
      });
      const data = await res.json();
      setAds(data.ads || []);
      setEditingAd(null);
      setSaveMessage("Ad placement successfully updated!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage("Error saving ad: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?")) return;
    try {
      const res = await adminFetch(`/api/admin/ads/${id}`, { method: "DELETE" });
      const data = await res.json();
      setAds(data.ads || []);
      if (editingAd?.id === id) setEditingAd(null);
    } catch (err) {
      console.error("Delete ad error:", err);
    }
  };

  const handleNewAd = (defaultPlacement = "Top") => {
    setEditingAd({
      id: `ad-${Date.now()}`,
      name: `New ${defaultPlacement} Placement`,
      placement: defaultPlacement,
      type: defaultPlacement === "Button" ? "custom" : "html",
      code:
        defaultPlacement === "Button"
          ? ""
          : '<div class="p-3 bg-slate-100 text-center text-xs text-slate-500 rounded border">Ad Banner</div>',
      status: "active",
      device: defaultPlacement === "Left" || defaultPlacement === "Right" ? "desktop" : "all",
      impressions: 0,
      clicks: 0,
    });
  };

  const handleSaveButtonSettings = async () => {
    setSavingSettings(true);
    setSettingsMessage(null);
    try {
      // Clean up any stray pdfviewer.org url
      const cleaned = { ...adSettings };
      if (cleaned.buttonAdUrl && cleaned.buttonAdUrl.includes("pdfviewer.org")) {
        cleaned.buttonAdUrl = "";
      }
      if (cleaned.newTabUrl && cleaned.newTabUrl.includes("pdfviewer.org")) {
        cleaned.newTabUrl = "";
      }

      saveAdSettings(cleaned);
      const res = await adminFetch("/api/admin/ad-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned),
      });
      if (res.ok) {
        setSettingsMessage("Button ad settings saved successfully!");
      } else {
        setSettingsMessage("Settings saved locally.");
      }
      setTimeout(() => setSettingsMessage(null), 3000);
    } catch (err: any) {
      setSettingsMessage("Saved to local config: " + err.message);
      setTimeout(() => setSettingsMessage(null), 3000);
    } finally {
      setSavingSettings(false);
    }
  };

  // Filter ads by placement
  const filteredAds =
    activePlacementFilter === "all"
      ? ads
      : ads.filter(
          (a) => a.placement && a.placement.toLowerCase() === activePlacementFilter.toLowerCase()
        );

  const placementTabs = ["all", "Top", "Left", "Bottom", "Right", "Center", "Button"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-600" />
            <span>Advertisements & Placement Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure placement positions (Top, Left, Bottom, Right, Center) and Download Button Ads without degrading UI/UX.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNewAd("Top")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Ad Unit</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* 1. BUTTON AD SETTINGS CARD (User Explicit Request: "button ma bi add lagne ka option ho") */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Download Button Ad Option</h2>
              <p className="text-xs text-slate-500">
                Attach an advertisement / sponsor URL to the Download button.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveButtonSettings}
              disabled={savingSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition disabled:opacity-50"
            >
              {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Button Ad</span>
            </button>
          </div>
        </div>

        {settingsMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{settingsMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Enable Ad on Download Button</span>
                  <span className="text-[11px] text-slate-500 block">
                    Trigger sponsor link in new tab when user clicks "Download PDF File"
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(adSettings.buttonAdEnabled || adSettings.newTabOnDownload)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLocalAdSettings({
                      ...adSettings,
                      buttonAdEnabled: checked,
                      newTabOnDownload: checked,
                    });
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Button Ad / Sponsor URL
              </label>
              <input
                type="url"
                value={adSettings.buttonAdUrl || adSettings.newTabUrl || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocalAdSettings({
                    ...adSettings,
                    buttonAdUrl: val,
                    newTabUrl: val,
                  });
                }}
                placeholder="https://example-sponsor.com/offer"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Leave blank or disable if you don't want any ad on the button. When empty, 0 new tabs open.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Strict UX Rule Enforced:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Agr ad add ho:</strong> Sirf tab new tab me open hoga jab enabled ho aur valid sponsor URL mojood ho.
                </li>
                <li>
                  <strong>Agr ad add NA ho (ya khali ho):</strong> Download process bilkul clean rahega aur koi bhi new tab ya pdfviewer.org open nahi hoga.
                </li>
                <li>
                  <strong>pdfviewer.org:</strong> Permanently removed and blocked across all buttons and components.
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Current Status:</span>
              {(adSettings.buttonAdEnabled || adSettings.newTabOnDownload) &&
              (adSettings.buttonAdUrl || adSettings.newTabUrl) ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Sponsor Attached
                </span>
              ) : (
                <span className="font-semibold text-slate-500">
                  Clean Download (No Ads Triggered)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PLACEMENT GUIDE & FILTER TABS (Top, Left, Bottom, Right, Center, Button) */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Placements:</span>
          </span>
          {placementTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActivePlacementFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition capitalize ${
                activePlacementFilter === tab
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab === "all" ? "All Units" : `${tab} Placement`}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {filteredAds.length} unit{filteredAds.length === 1 ? "" : "s"} found
        </span>
      </div>

      {/* 3. ADS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Megaphone className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-700">
              No advertisements configured for {activePlacementFilter === "all" ? "any placement" : `"${activePlacementFilter}"`}
            </p>
            <p className="text-xs text-slate-400">
              Click below to create an ad unit specifically for this location.
            </p>
            <button
              type="button"
              onClick={() => handleNewAd(activePlacementFilter === "all" ? "Top" : activePlacementFilter)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create {activePlacementFilter === "all" ? "Top" : activePlacementFilter} Ad</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Ad Placement Name</th>
                  <th className="py-3 px-3">Position</th>
                  <th className="py-3 px-3">Device Targeting</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Performance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{ad.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Type: {ad.type?.toUpperCase() || "HTML"}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                        {ad.placement}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                        {ad.device === "mobile" ? (
                          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        ) : ad.device === "desktop" ? (
                          <Monitor className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className="capitalize">{ad.device || "All Devices"}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(ad)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold transition ${
                          ad.status === "active"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {ad.status === "active" ? "Active" : "Disabled"}
                      </button>
                    </td>

                    <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      <span>{ad.impressions?.toLocaleString() || 0} views</span>
                      <span className="text-slate-300 mx-1">•</span>
                      <span>{ad.clicks || 0} clicks</span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingAd(ad)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                          title="Edit Ad Unit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition"
                          title="Delete Ad Unit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. AD UNIT EDIT MODAL */}
      {editingAd && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-600" />
              <span>Configure Advertisement Placement</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ad Unit Name *</label>
                <input
                  type="text"
                  value={editingAd.name || ""}
                  onChange={(e) => setEditingAd({ ...editingAd, name: e.target.value })}
                  placeholder="e.g. Top Header Banner"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Placement Position *</label>
                  <select
                    value={editingAd.placement || "Top"}
                    onChange={(e) => setEditingAd({ ...editingAd, placement: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none font-medium"
                  >
                    {placements.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Device Targeting</label>
                  <select
                    value={editingAd.device || "all"}
                    onChange={(e) => setEditingAd({ ...editingAd, device: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none font-medium"
                  >
                    <option value="all">All Devices</option>
                    <option value="desktop">Desktop Only</option>
                    <option value="tablet">Tablet Only</option>
                    <option value="mobile">Mobile Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ad HTML / JavaScript Code or Sponsor URL
                </label>
                <textarea
                  rows={5}
                  value={editingAd.code || ""}
                  onChange={(e) => setEditingAd({ ...editingAd, code: e.target.value })}
                  placeholder="<!-- Paste Google AdSense script, custom HTML, or banner markup here -->"
                  className="w-full p-3 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAd.status === "active"}
                    onChange={(e) =>
                      setEditingAd({ ...editingAd, status: e.target.checked ? "active" : "disabled" })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800">Enable this advertisement live on site</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAd(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAd}
                disabled={saving || !editingAd.name}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Ad Placement</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
