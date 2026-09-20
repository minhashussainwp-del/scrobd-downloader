import React, { useState, useEffect } from "react";
import {
  ArrowRightLeft,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Edit,
  Save,
  Loader2,
} from "lucide-react";
import { CmsRedirect } from "../../types";

export function AdminRedirects() {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({
    fromPath: "",
    toPath: "",
    statusCode: 301,
    description: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadRedirects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/redirects");
      const data = await res.json();
      setRedirects(data.redirects || []);
    } catch (err) {
      console.error("Load redirects error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRedirects();
  }, []);

  const handleSave = async () => {
    if (!formData.fromPath || !formData.toPath) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setRedirects(data.redirects || []);
      setShowModal(false);
      setFormData({ fromPath: "", toPath: "", statusCode: 301, description: "", active: true });
      setSaveMessage("Redirect rule successfully updated!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this redirect rule?")) return;
    try {
      const res = await fetch(`/api/admin/redirects/${id}`, { method: "DELETE" });
      const data = await res.json();
      setRedirects(data.redirects || []);
    } catch (err) {
      console.error("Delete redirect error:", err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
            <span>301 & 302 URL Redirects</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Forward outdated inbound links, handle legacy URLs, and avoid 404 crawl errors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({ fromPath: "", toPath: "", statusCode: 301, description: "", active: true });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Redirect Rule</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Redirects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : redirects.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ArrowRightLeft className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-700">No active redirects configured</p>
            <p className="text-xs text-slate-400">Click "Add Redirect Rule" to create a 301 redirect.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">From Path (Source)</th>
                  <th className="py-3 px-4">Destination Target</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Hits</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {redirects.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {r.fromPath}
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-700">
                      <div className="flex items-center gap-1.5">
                        <span>{r.toPath}</span>
                        <a
                          href={r.toPath}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-emerald-600"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {r.statusCode || 301}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          r.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {r.active ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {r.hits || 0}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition"
                        title="Delete Redirect Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
              <span>Add URL Redirect Rule</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source Path (Old URL) *</label>
                <input
                  type="text"
                  placeholder="/old-guide.html"
                  value={formData.fromPath}
                  onChange={(e) => setFormData({ ...formData, fromPath: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Path / URL *</label>
                <input
                  type="text"
                  placeholder="/blog/how-to-download-scribd-pdf"
                  value={formData.toPath}
                  onChange={(e) => setFormData({ ...formData, toPath: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">HTTP Redirect Status Code</label>
                <select
                  value={formData.statusCode}
                  onChange={(e) => setFormData({ ...formData, statusCode: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none"
                >
                  <option value={301}>301 - Moved Permanently (Recommended for SEO)</option>
                  <option value={302}>302 - Found / Temporary Redirect</option>
                  <option value={307}>307 - Temporary Redirect</option>
                  <option value={308}>308 - Permanent Redirect</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Legacy migration redirect"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !formData.fromPath || !formData.toPath}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Create Redirect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
