const fs = require('fs');

const code = `import React, { useState } from "react";
import { BlogPost, GutenbergBlock, SupportedLanguage } from "../../types";
import { ClassicEditor } from "./ClassicEditor";
import { SUPPORTED_LANGUAGES } from "../../data/translations";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Tag,
  Folder,
  X,
  Sparkles,
  Globe
} from "lucide-react";

interface AdminPostsProps {
  posts: BlogPost[];
  onSavePost: (post: BlogPost) => void;
  onDeletePost: (id: string, permanent?: boolean) => void;
  categories: string[];
  tags: string[];
}

export function AdminPosts({
  posts,
  onSavePost,
  onDeletePost,
  categories,
  tags,
}: AdminPostsProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "published" | "draft" | "trash">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [trashList, setTrashList] = useState<string[]>([]);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState("Guides");
  const [formReadTime, setFormReadTime] = useState("4 min read");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formImage, setFormImage] = useState("");
  
  // Multilingual & Editor State
  const [formLanguage, setFormLanguage] = useState<SupportedLanguage>("en");
  const [formTranslationGroupId, setFormTranslationGroupId] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [formHtmlContent, setFormHtmlContent] = useState("");

  const startCreate = () => {
    setIsCreating(true);
    setEditingPost(null);
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormCategory("Guides");
    setFormReadTime("4 min read");
    setFormFeatured(false);
    setFormImage("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80");
    setFormLanguage("en");
    setFormTranslationGroupId(\`tg-\${Date.now()}-\${Math.random().toString(36).substr(2, 5)}\`);
    setFormStatus("published");
    setFormHtmlContent("");
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(true);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormCategory(post.category || "Guides");
    setFormReadTime(post.readTime || "4 min read");
    setFormFeatured(!!post.featured);
    setFormImage(post.image || "");
    setFormLanguage(post.language || "en");
    setFormTranslationGroupId(post.translationGroupId || \`tg-\${post.id}\`);
    setFormStatus(post.status || "published");
    
    // Migrate old blocks to HTML if htmlContent doesn't exist
    let html = post.htmlContent || "";
    if (!html && post.blocks && post.blocks.length > 0) {
      html = post.blocks.map(b => {
        if (b.type === 'heading') return \`<h\${b.level || 2}>\${b.content}</h\${b.level || 2}>\`;
        if (b.type === 'paragraph') return \`<p>\${b.content}</p>\`;
        if (b.type === 'list') return \`<ul>\${b.listItems?.map(li => \`<li>\${li}</li>\`).join('')}</ul>\`;
        if (b.type === 'quote') return \`<blockquote>\${b.content}</blockquote>\`;
        return \`<p>\${b.content}</p>\`;
      }).join('\\n');
    }
    setFormHtmlContent(html);
  };

  const handleCreateTranslation = (langCode: SupportedLanguage) => {
    if (!formTranslationGroupId) return;
    const newPost: BlogPost = {
      id: \`post-\${Date.now()}\`,
      slug: \`\${formSlug}-\${langCode}\`,
      title: \`[\${langCode.toUpperCase()}] \${formTitle}\`,
      excerpt: formExcerpt,
      category: formCategory,
      readTime: formReadTime,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      author: editingPost?.author || {
        name: "Admin",
        role: "Editor",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      },
      image: formImage,
      featured: formFeatured,
      language: langCode,
      translationGroupId: formTranslationGroupId,
      status: "draft",
      htmlContent: formHtmlContent, // copy current content as starting point
    };
    onSavePost(newPost);
    startEdit(newPost);
  };

  const handleSwitchTranslation = (post: BlogPost) => {
    // If there are unsaved changes on current, save them (optional), but we just switch
    startEdit(post);
  };

  const saveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = editingPost ? editingPost.id : \`post-\${Date.now()}\`;
    
    const post: BlogPost = {
      id: newId,
      slug: formSlug || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: formTitle,
      excerpt: formExcerpt,
      category: formCategory,
      readTime: formReadTime,
      date: editingPost ? editingPost.date : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      author: editingPost ? editingPost.author : {
        name: "Admin",
        role: "Editor",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      },
      image: formImage,
      featured: formFeatured,
      language: formLanguage,
      translationGroupId: formTranslationGroupId,
      status: formStatus,
      htmlContent: formHtmlContent,
    };

    onSavePost(post);
    setIsCreating(false);
    setEditingPost(null);
  };

  const moveToTrash = (id: string) => {
    setTrashList((prev) => [...prev, id]);
  };

  const restoreFromTrash = (id: string) => {
    setTrashList((prev) => prev.filter((item) => item !== id));
  };

  const filteredPosts = posts.filter((p) => {
    const isTrashed = trashList.includes(p.id);
    if (activeFilter === "trash") return isTrashed;
    if (isTrashed) return false;
    if (activeFilter === "published") return (p.status === "published" || !p.status);
    if (activeFilter === "draft") return p.status === "draft";

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6" id="admin-posts-manager">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Posts & Guides</h2>
          <p className="text-sm text-slate-500 font-medium">Manage SEO articles, blog posts, and translations.</p>
        </div>
        {!isCreating && (
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Write New Post
          </button>
        )}
      </div>

      {isCreating ? (
        <form onSubmit={saveForm} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {editingPost ? "Edit Post" : "Write New Post"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingPost(null);
              }}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left 3 Cols: Editor */}
            <div className="lg:col-span-3 space-y-5">
              <div className="space-y-1.5">
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Article Title..."
                  className="w-full px-0 py-2 border-0 border-b border-slate-200 text-slate-900 font-bold text-2xl focus:ring-0 focus:border-indigo-500 placeholder-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <ClassicEditor value={formHtmlContent} onChange={setFormHtmlContent} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">URL Slug</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="how-to-convert-scribd-to-pdf"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-indigo-500/15"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Excerpt / Meta Description</label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-indigo-500/15"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Polylang & Settings Sidebar */}
            <div className="space-y-6">
              
              {/* Language Settings (Polylang Style) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4" />
                  Language & Translations
                </h4>
                
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Current Language</label>
                  <select 
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white"
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-3">
                  <label className="text-xs font-bold text-slate-700">Translations</label>
                  <ul className="space-y-1.5 text-sm">
                    {SUPPORTED_LANGUAGES.map(lang => {
                      // Skip current if not grouped (though they should all list)
                      if (lang.code === formLanguage) {
                        return (
                          <li key={lang.code} className="flex items-center justify-between p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                            <span className="flex items-center gap-1.5 font-bold text-indigo-900">
                              {lang.flag} {lang.code.toUpperCase()}
                            </span>
                            <span className="text-xs text-indigo-600 font-semibold bg-indigo-100 px-1.5 py-0.5 rounded">Current</span>
                          </li>
                        );
                      }
                      
                      // Check if a translation exists in the group
                      const existingTranslation = posts.find(p => p.translationGroupId === formTranslationGroupId && p.language === lang.code && p.id !== editingPost?.id);
                      
                      if (existingTranslation) {
                        return (
                          <li key={lang.code} className="flex items-center justify-between p-1.5 hover:bg-slate-100 rounded-lg group transition">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              {lang.flag} {lang.code.toUpperCase()}
                            </span>
                            <button 
                              type="button" 
                              onClick={() => handleSwitchTranslation(existingTranslation)}
                              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 group-hover:underline"
                            >
                              <Edit2 className="w-3 h-3 inline mr-1" /> Edit
                            </button>
                          </li>
                        );
                      } else {
                        return (
                          <li key={lang.code} className="flex items-center justify-between p-1.5 hover:bg-slate-100 rounded-lg group transition">
                            <span className="flex items-center gap-1.5 font-medium text-slate-400">
                              {lang.flag} {lang.code.toUpperCase()}
                            </span>
                            <button 
                              type="button"
                              onClick={() => handleCreateTranslation(lang.code)}
                              className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 group-hover:underline"
                            >
                              + Create
                            </button>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>

              {/* Publish Settings */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Publish
                </h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "published" | "draft")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition cursor-pointer"
                >
                  Save Post
                </button>
              </div>

              {/* General Settings */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Properties
                </h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-semibold text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    {!categories.includes(formCategory) && (
                       <option value={formCategory}>{formCategory}</option>
                    )}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Featured Image URL</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-semibold text-xs"
                  />
                  {formImage && (
                    <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-slate-200">
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500/20"
                  />
                  <span className="text-xs font-bold text-slate-700">Featured Post</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Posts Table & Filters */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5 sm:p-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={\`px-3 py-1.5 rounded-lg transition cursor-pointer \${
                  activeFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }\`}
              >
                All ({posts.length - trashList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("published")}
                className={\`px-3 py-1.5 rounded-lg transition cursor-pointer \${
                  activeFilter === "published" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }\`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("draft")}
                className={\`px-3 py-1.5 rounded-lg transition cursor-pointer \${
                  activeFilter === "draft" ? "bg-white text-amber-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }\`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("trash")}
                className={\`px-3 py-1.5 rounded-lg transition cursor-pointer \${
                  activeFilter === "trash" ? "bg-white text-red-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }\`}
              >
                Trash ({trashList.length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <th className="p-4">Title</th>
                  <th className="p-4">Language</th>
                  <th className="p-4">Translations</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPosts.map((post) => {
                  const isTrashed = trashList.includes(post.id);
                  const langOpt = SUPPORTED_LANGUAGES.find(l => l.code === (post.language || 'en'));
                  
                  // Get other translations in this group
                  const siblingTranslations = post.translationGroupId 
                    ? posts.filter(p => p.translationGroupId === post.translationGroupId && p.id !== post.id && !trashList.includes(p.id))
                    : [];

                  return (
                    <tr key={post.id} className="hover:bg-slate-50 transition group">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {post.featured && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                          {post.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Folder className="w-3 h-3" />
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                           {langOpt?.flag} {langOpt?.code.toUpperCase()}
                         </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {siblingTranslations.length > 0 ? (
                            siblingTranslations.map(sib => {
                              const sLang = SUPPORTED_LANGUAGES.find(l => l.code === sib.language);
                              return (
                                <span key={sib.id} title={sLang?.name} className="text-lg cursor-help opacity-70 hover:opacity-100 transition">
                                  {sLang?.flag}
                                </span>
                              )
                            })
                          ) : (
                            <span className="text-xs text-slate-400 italic">None</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={\`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider \${
                          post.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }\`}>
                          {post.status === 'draft' ? 'DRAFT' : 'PUBLISHED'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                        {post.date}
                      </td>
                      <td className="p-4 text-right">
                        {!isTrashed ? (
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(post)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveToTrash(post.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Trash"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => restoreFromTrash(post.id)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition flex items-center gap-1 text-xs font-bold"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Restore
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeletePost(post.id, true)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1 text-xs font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Forever
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No posts found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/Admin/AdminPosts.tsx', code);
