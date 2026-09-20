import React from "react";
import {
  BookOpen,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Copy,
  Edit,
  Globe,
  RotateCcw,
  Calendar,
  Tag,
} from "lucide-react";
import { BlogPost } from "../../types";

interface AdminPostsProps {
  posts: any[];
  filter: "all" | "published" | "draft" | "scheduled" | "trash";
  onFilterChange: (filter: "all" | "published" | "draft" | "scheduled" | "trash") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onEditPost: (post: any, lang?: string) => void;
  onNewPost: () => void;
  onTrashPost: (id: string) => void;
  onRestorePost: (id: string) => void;
  onDeletePermanently: (id: string) => void;
  onDuplicatePost: (post: any) => void;
  onPreviewPost: (slug: string, lang?: string) => void;
  counts: {
    all: number;
    published: number;
    draft: number;
    scheduled: number;
    trash: number;
  };
}

const SUPPORTED_LANGS = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇲🇽" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
];

export function AdminPosts({
  posts,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onEditPost,
  onNewPost,
  onTrashPost,
  onRestorePost,
  onDeletePermanently,
  onDuplicatePost,
  onPreviewPost,
  counts,
}: AdminPostsProps) {
  return (
    <div className="space-y-5">
      {/* Header & New Post Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Blog Articles & Guides</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your educational tutorials, download guides, format analysis articles, and multilingual blog posts.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewPost}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Post</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "all" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("published")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "published" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Published ({counts.published})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("draft")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "draft" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Drafts ({counts.draft})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("scheduled")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "scheduled" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Scheduled ({counts.scheduled})
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("trash")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === "trash" ? "bg-rose-900 text-white font-semibold" : "text-rose-600 hover:bg-rose-50"
            }`}
          >
            Trash ({counts.trash})
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search posts by title or slug..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-600">No blog posts found</p>
            <p className="text-xs text-slate-400">
              {searchQuery ? "Try refining your search query." : "Click 'Add New Post' to create an article."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Title & Slug</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Polylang Translations</th>
                  <th className="py-3 px-3">Author</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((p) => {
                  const translatedLangs = new Set(p.translatedLanguages || [p.language || "en"]);
                  const isTrash = filter === "trash" || p.inTrash;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition group">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition">
                          {p.title}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>/blog/{p.slug}</span>
                          <button
                            type="button"
                            onClick={() => onPreviewPost(p.slug, p.language)}
                            className="text-slate-400 hover:text-emerald-600 transition"
                            title="Preview live article"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {p.category || "Guides"}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            p.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : p.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.status === "published" ? "Published" : p.status === "scheduled" ? "Scheduled" : "Draft"}
                        </span>
                      </td>

                      {/* Polylang Translations Matrix */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          {SUPPORTED_LANGS.map((lang) => {
                            const hasLang = translatedLangs.has(lang.code);
                            return (
                              <button
                                key={lang.code}
                                type="button"
                                onClick={() => onEditPost(p, lang.code)}
                                title={`${lang.name} (${lang.code.toUpperCase()}): ${
                                  hasLang ? "Click to edit translation" : "Click to create translation"
                                }`}
                                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition ${
                                  hasLang
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                                    : "bg-slate-100 text-slate-400 border border-dashed border-slate-300 hover:border-emerald-500 hover:text-emerald-600"
                                }`}
                              >
                                {hasLang ? lang.code.toUpperCase() : "+"}
                              </button>
                            );
                          })}
                          <span className="text-[10px] text-slate-400 ml-1 font-mono">
                            {p.translationsCount || 1}/{SUPPORTED_LANGS.length}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {p.author?.name || "Editorial Team"}
                      </td>

                      <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                        {p.date || "Recent"}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isTrash ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onRestorePost(p.id)}
                              className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition"
                              title="Restore from Trash"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeletePermanently(p.id)}
                              className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition"
                              title="Delete Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onEditPost(p)}
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                              title="Edit Post"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDuplicatePost(p)}
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                              title="Duplicate Post"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onTrashPost(p.id)}
                              className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition"
                              title="Move to Trash"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
