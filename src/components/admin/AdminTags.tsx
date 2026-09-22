import React, { useState, useEffect } from "react";
import { Tag, Plus, Trash2, Edit2, Search, Loader2 } from "lucide-react";

interface TagItem {
  id: string;
  name: string;
  slug: string;
}

interface AdminTagsProps {
  posts?: Array<{ tags?: string[]; [key: string]: any }>;
}

export function AdminTags({ posts = [] }: AdminTagsProps) {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadTags = async () => {
    try {
      const res = await fetch("/api/admin/tags");
      const json = await res.json();
      setTags(json.tags || []);
    } catch (err) {
      console.error("Failed to load tags:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleSlugify = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(handleSlugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSaving(true);
    try {
      const item: Partial<TagItem> = {
        name: name.trim(),
        slug: slug.trim(),
      };
      if (editingId) item.id = editingId;

      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      if (data.tags) {
        setTags(data.tags);
        setName("");
        setSlug("");
        setEditingId(null);
        setFeedback(editingId ? "Tag updated." : "Tag created.");
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      setFeedback("Failed to save tag.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tag: TagItem) => {
    setEditingId(tag.id);
    setName(tag.name);
    setSlug(tag.slug);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
  };

  const handleDelete = async (id: string, tagName: string) => {
    if (!confirm(`Are you sure you want to delete tag "${tagName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.tags) {
        setTags(data.tags);
      }
    } catch (err) {
      alert("Failed to delete tag");
    }
  };

  const filtered = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Loading Post Tags...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Tag className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Post Tags</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage granular keywords and metadata tags attached to articles and guides.
          </p>
        </div>
      </div>

      {/* WordPress 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Add / Edit Tag Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            {editingId ? "Edit Tag" : "Add New Tag"}
          </h2>

          {feedback && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              {feedback}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Free Download"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">The name is how it appears on your site.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., free-download"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 text-slate-800 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">URL-friendly version of the name.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Tag" : "Add New Tag"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Tag List Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-slate-900">Existing Tags ({tags.length})</h2>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tags..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Name</th>
                  <th className="py-2.5 px-3 font-semibold">Slug</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Count</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((tag) => {
                  const postCount = posts.filter(
                    (p) => p.tags && Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
                  ).length;

                  return (
                    <tr key={tag.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{tag.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{tag.slug}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {postCount}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(tag)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Edit Tag"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(tag.id, tag.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Tag"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                      No tags found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
