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
} from "lucide-react";
import { CmsAd } from "../../types";

export function AdminAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [placements, setPlacements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadAds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ads");
      const data = await res.json();
      setAds(data.ads || []);
      setPlacements(data.placements || []);
    } catch (err) {
      console.error("Load ads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleToggleStatus = async (ad: any) => {
    const updated = { ...ad, status: ad.status === "active" ? "disabled" : "active" };
    try {
      const res = await fetch("/api/admin/ads", {
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
      const res = await fetch("/api/admin/ads", {
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
    if (!confirm("Are you sure you want to delete this advertisement?")) return;
    try {
      const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
      const data = await res.json();
      setAds(data.ads || []);
      if (editingAd?.id === id) setEditingAd(null);
    } catch (err) {
      console.error("Delete ad error:", err);
    }
  };

  const handleNewAd = () => {
    setEditingAd({
      id: `ad-${Date.now()}`,
      name: "New Banner Placement",
      placement: placements[0] || "Header",
      type: "html",
      code: '<div class="p-3 bg-slate-100 text-center text-xs text-slate-500 rounded border">Ad Banner</div>',
      status: "active",
      device: "all",
      impressions: 0,
      clicks: 0,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-600" />
            <span>Advertisements Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure header banners, in-article ads, sticky mobile units, and responsive HTML/JS placements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewAd}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Ad Unit</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Ads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : ads.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Megaphone className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-700">No advertisements configured</p>
            <p className="text-xs text-slate-400">Click "Add New Ad Unit" to create a placement.</p>
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
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{ad.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Type: {ad.type?.toUpperCase() || "HTML"}
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
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

      {/* Ad Unit Edit Modal / Drawer */}
      {editingAd && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4 text-xs">
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
                  placeholder="e.g. Header Sponsor Banner"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Placement Position</label>
                  <select
                    value={editingAd.placement || "Header"}
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
                  Ad HTML / JavaScript Code
                </label>
                <textarea
                  rows={6}
                  value={editingAd.code || ""}
                  onChange={(e) => setEditingAd({ ...editingAd, code: e.target.value })}
                  placeholder="<!-- Paste Google AdSense, media code, or banner HTML here -->"
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
