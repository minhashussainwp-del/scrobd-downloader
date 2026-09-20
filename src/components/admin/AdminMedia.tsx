import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  CheckCircle2,
  ExternalLink,
  Plus,
  Loader2,
  FileText,
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  sizeBytes?: number;
  type?: string;
  alt?: string;
  title?: string;
  createdAt?: string;
}

interface AdminMediaProps {
  onSelect?: (url: string) => void;
  selectable?: boolean;
}

export function AdminMedia({ onSelect, selectable }: AdminMediaProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadName, setUploadName] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setMedia(data.media || []);
    } catch (err) {
      console.error("Load media error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [search]);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadUrl = async () => {
    if (!uploadUrl) return;
    setUploading(true);
    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: uploadUrl,
          name: uploadName || "imported-image.png",
          alt: uploadAlt || uploadName || "Media item",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowUploadModal(false);
        setUploadUrl("");
        setUploadName("");
        setUploadAlt("");
        loadMedia();
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      setMedia((prev) => prev.filter((m) => m.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      console.error("Delete media error:", err);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return "150 KB";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-600" />
            <span>Media Library</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store, organize, and manage image assets for pages, articles, and meta cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Upload className="w-4 h-4" />
            <span>Add Media Item</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search media by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {media.length} items
        </span>
      </div>

      {/* Grid of media items */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-medium text-slate-700">No media assets found</p>
          <p className="text-xs text-slate-400">Click "Add Media Item" to import images.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {media.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`group bg-white rounded-xl border p-2 cursor-pointer transition flex flex-col justify-between ${
                selectedItem?.id === item.id
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center relative">
                <img
                  src={item.url}
                  alt={item.alt || item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
                {selectable && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect?.(item.url);
                    }}
                    className="absolute inset-x-2 bottom-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold shadow-xs hover:bg-emerald-700 transition"
                  >
                    Select Image
                  </button>
                )}
              </div>

              <div className="mt-2 space-y-0.5">
                <div className="text-xs font-semibold text-slate-800 truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{formatBytes(item.sizeBytes)}</span>
                  <span>{item.type?.split("/")[1]?.toUpperCase() || "PNG"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Item Drawer / Details Modal */}
      {selectedItem && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-start gap-5">
          <img
            src={selectedItem.url}
            alt={selectedItem.alt || selectedItem.name}
            className="w-full md:w-56 h-40 object-cover rounded-lg border border-slate-200"
          />

          <div className="flex-1 space-y-3 text-xs w-full">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{selectedItem.name}</h3>
              <button
                type="button"
                onClick={() => handleDelete(selectedItem.id)}
                className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Asset</span>
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-0.5">File URL</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={selectedItem.url}
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(selectedItem.url, selectedItem.id)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-semibold flex items-center gap-1 transition"
                >
                  {copiedId === selectedItem.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === selectedItem.id ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Image Alt Text (SEO)</label>
                <input
                  type="text"
                  value={selectedItem.alt || ""}
                  readOnly
                  className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-0.5">Dimensions & Format</label>
                <div className="px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 text-slate-500 font-mono text-[11px]">
                  Web-Optimized • {formatBytes(selectedItem.sizeBytes)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Import Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Import Media Asset</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  placeholder="scribd-guide-banner.png"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  placeholder="Scribd document download step preview"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadUrl}
                disabled={uploading || !uploadUrl}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Import Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
