import React, { useState, useEffect } from "react";
import { AdminLayout, AdminTab } from "./AdminLayout";
import { AdminDashboard } from "./AdminDashboard";
import { AdminPages } from "./AdminPages";
import { AdminPageEditor } from "./AdminPageEditor";
import { AdminPosts } from "./AdminPosts";
import { AdminPostEditor } from "./AdminPostEditor";
import { AdminHomepage } from "./AdminHomepage";
import { AdminMedia } from "./AdminMedia";
import { AdminAds } from "./AdminAds";
import { AdminLanguages } from "./AdminLanguages";
import { AdminSeo } from "./AdminSeo";
import { AdminRedirects } from "./AdminRedirects";
import { AdminSettings } from "./AdminSettings";
import { Loader2 } from "lucide-react";

interface AdminPanelProps {
  onExitToSite: () => void;
  onPreviewUrl?: (url: string) => void;
}

export function AdminPanel({ onExitToSite, onPreviewUrl }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [pages, setPages] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Pages state
  const [pageFilter, setPageFilter] = useState<"all" | "published" | "draft" | "trash">("all");
  const [pageSearch, setPageSearch] = useState("");
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [targetLangForPage, setTargetLangForPage] = useState("en");

  // Posts state
  const [postFilter, setPostFilter] = useState<"all" | "published" | "draft" | "scheduled" | "trash">("all");
  const [postSearch, setPostSearch] = useState("");
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [targetLangForPost, setTargetLangForPost] = useState("en");

  // Fetch initial data
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [pagesRes, postsRes, metricsRes] = await Promise.all([
        fetch("/api/admin/pages"),
        fetch("/api/admin/posts"),
        fetch("/api/admin/metrics"),
      ]);
      const pagesData = await pagesRes.json();
      const postsData = await postsRes.json();
      const metricsData = await metricsRes.json();

      setPages(pagesData.pages || []);
      setPosts(postsData.posts || []);
      setMetrics(metricsData.metrics || null);
    } catch (err) {
      console.error("Failed to load CMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filtered pages
  const filteredPages = pages.filter((p) => {
    if (pageFilter === "trash") {
      if (!p.inTrash) return false;
    } else {
      if (p.inTrash) return false;
      if (pageFilter === "published" && p.status !== "published") return false;
      if (pageFilter === "draft" && p.status !== "draft") return false;
    }
    if (pageSearch) {
      const q = pageSearch.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pageCounts = {
    all: pages.filter((p) => !p.inTrash).length,
    published: pages.filter((p) => !p.inTrash && p.status === "published").length,
    draft: pages.filter((p) => !p.inTrash && p.status === "draft").length,
    trash: pages.filter((p) => p.inTrash).length,
  };

  // Filtered posts
  const filteredPosts = posts.filter((p) => {
    if (postFilter === "trash") {
      if (!p.inTrash) return false;
    } else {
      if (p.inTrash) return false;
      if (postFilter === "published" && p.status !== "published") return false;
      if (postFilter === "draft" && p.status !== "draft") return false;
      if (postFilter === "scheduled" && p.status !== "scheduled") return false;
    }
    if (postSearch) {
      const q = postSearch.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const postCounts = {
    all: posts.filter((p) => !p.inTrash).length,
    published: posts.filter((p) => !p.inTrash && p.status === "published").length,
    draft: posts.filter((p) => !p.inTrash && p.status === "draft").length,
    scheduled: posts.filter((p) => !p.inTrash && p.status === "scheduled").length,
    trash: posts.filter((p) => p.inTrash).length,
  };

  // Page Actions
  const handleSavePage = async (pageData: any) => {
    const res = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Save failed");
    // Reload pages list
    const refreshed = await fetch("/api/admin/pages");
    const data = await refreshed.json();
    setPages(data.pages || []);
    setEditingPage(null);
  };

  const handleTrashPage = async (id: string) => {
    await fetch(`/api/admin/pages/trash/${id}`, { method: "POST" });
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inTrash: true } : p))
    );
  };

  const handleRestorePage = async (id: string) => {
    await fetch(`/api/admin/pages/restore/${id}`, { method: "POST" });
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inTrash: false } : p))
    );
  };

  const handleDeletePagePermanently = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this page?")) return;
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicatePage = async (page: any) => {
    const res = await fetch(`/api/admin/pages/duplicate/${page.id}`, { method: "POST" });
    const data = await res.json();
    if (data.duplicated) {
      setPages((prev) => [data.duplicated, ...prev]);
    }
  };

  // Post Actions
  const handleSavePost = async (postData: any) => {
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Save failed");
    // Reload posts list
    const refreshed = await fetch("/api/admin/posts");
    const data = await refreshed.json();
    setPosts(data.posts || []);
    setEditingPost(null);
  };

  const handleTrashPost = async (id: string) => {
    await fetch(`/api/admin/posts/trash/${id}`, { method: "POST" });
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inTrash: true } : p))
    );
  };

  const handleRestorePost = async (id: string) => {
    await fetch(`/api/admin/posts/restore/${id}`, { method: "POST" });
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inTrash: false } : p))
    );
  };

  const handleDeletePostPermanently = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this post?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicatePost = async (post: any) => {
    const res = await fetch(`/api/admin/posts/duplicate/${post.id}`, { method: "POST" });
    const data = await res.json();
    if (data.duplicated) {
      setPosts((prev) => [data.duplicated, ...prev]);
    }
  };

  // Homepage Actions
  const handleSaveHomepage = async (lang: string, content: any) => {
    const res = await fetch("/api/admin/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, content }),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Save failed");
  };

  // Previews
  const handlePreviewPage = (slug: string, lang: string = "en") => {
    const url = lang === "en" ? `/${slug}` : `/${lang}/${slug}`;
    if (onPreviewUrl) {
      onPreviewUrl(url);
    } else {
      window.open(url, "_blank");
    }
  };

  const handlePreviewPost = (slug: string, lang: string = "en") => {
    const url = lang === "en" ? `/blog/${slug}` : `/${lang}/blog/${slug}`;
    if (onPreviewUrl) {
      onPreviewUrl(url);
    } else {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white space-y-3 flex-col">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Initializing CMS Admin Workspace...</p>
      </div>
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={(tab) => {
        setActiveTab(tab);
        setEditingPage(null);
        setEditingPost(null);
      }}
      onExitToSite={onExitToSite}
      counts={{
        pages: pageCounts.all,
        posts: postCounts.all,
        ads: 5,
        media: 12,
      }}
    >
      {/* 1. DASHBOARD */}
      {activeTab === "dashboard" && (
        <AdminDashboard
          onNavigate={(tab) => {
            setActiveTab(tab);
            setEditingPage(null);
            setEditingPost(null);
          }}
          metrics={metrics}
        />
      )}

      {/* 2. PAGES (LIST OR EDITOR) */}
      {activeTab === "pages" && (
        editingPage ? (
          <AdminPageEditor
            initialPage={editingPage}
            targetLang={targetLangForPage}
            onBack={() => setEditingPage(null)}
            onSave={handleSavePage}
            onPreview={(slug, lang) => handlePreviewPage(slug, lang)}
          />
        ) : (
          <AdminPages
            pages={filteredPages}
            filter={pageFilter}
            onFilterChange={setPageFilter}
            searchQuery={pageSearch}
            onSearchChange={setPageSearch}
            onEditPage={(page, lang) => {
              const targetLang = lang || page.language || "en";
              const existingTranslation = page.allTranslations?.find(
                (t: any) => (t.language || "en") === targetLang
              );
              if (existingTranslation) {
                setEditingPage(existingTranslation);
              } else {
                setEditingPage({
                  ...page,
                  id: "",
                  language: targetLang,
                  slug: targetLang === "en" ? page.slug : `${page.slug}-${targetLang}`,
                  title: `${page.title} (${targetLang.toUpperCase()})`,
                  status: "draft",
                  translationGroupId: page.translationGroupId || page.id,
                  inTrash: false,
                });
              }
              setTargetLangForPage(targetLang);
            }}
            onNewPage={() => {
              setEditingPage({
                title: "",
                slug: "",
                content: "",
                excerpt: "",
                status: "published",
                language: "en",
                translationGroupId: `group-page-${Date.now()}`,
              });
              setTargetLangForPage("en");
            }}
            onTrashPage={handleTrashPage}
            onRestorePage={handleRestorePage}
            onDeletePermanently={handleDeletePagePermanently}
            onDuplicatePage={handleDuplicatePage}
            onPreviewPage={handlePreviewPage}
            counts={pageCounts}
          />
        )
      )}

      {/* 3. POSTS (LIST OR EDITOR) */}
      {activeTab === "posts" && (
        editingPost ? (
          <AdminPostEditor
            initialPost={editingPost}
            targetLang={targetLangForPost}
            onBack={() => setEditingPost(null)}
            onSave={handleSavePost}
            onPreview={(slug, lang) => handlePreviewPost(slug, lang)}
          />
        ) : (
          <AdminPosts
            posts={filteredPosts}
            filter={postFilter}
            onFilterChange={setPostFilter}
            searchQuery={postSearch}
            onSearchChange={setPostSearch}
            onEditPost={(post, lang) => {
              const targetLang = lang || post.language || "en";
              const existingTranslation = post.allTranslations?.find(
                (t: any) => (t.language || "en") === targetLang
              );
              if (existingTranslation) {
                setEditingPost(existingTranslation);
              } else {
                setEditingPost({
                  ...post,
                  id: "",
                  language: targetLang,
                  slug: targetLang === "en" ? post.slug : `${post.slug}-${targetLang}`,
                  title: `${post.title} (${targetLang.toUpperCase()})`,
                  status: "draft",
                  translationGroupId: post.translationGroupId || post.id,
                  inTrash: false,
                });
              }
              setTargetLangForPost(targetLang);
            }}
            onNewPost={() => {
              setEditingPost({
                title: "",
                slug: "",
                content: "",
                excerpt: "",
                category: "Guides",
                tags: ["Scribd", "PDF"],
                status: "published",
                language: "en",
                translationGroupId: `group-post-${Date.now()}`,
              });
              setTargetLangForPost("en");
            }}
            onTrashPost={handleTrashPost}
            onRestorePost={handleRestorePost}
            onDeletePermanently={handleDeletePostPermanently}
            onDuplicatePost={handleDuplicatePost}
            onPreviewPost={handlePreviewPost}
            counts={postCounts}
          />
        )
      )}

      {/* 4. DEDICATED HOMEPAGE */}
      {activeTab === "homepage" && (
        <AdminHomepage onSave={handleSaveHomepage} />
      )}

      {/* 5. MEDIA LIBRARY */}
      {activeTab === "media" && (
        <AdminMedia />
      )}

      {/* 6. ADVERTISEMENTS */}
      {activeTab === "ads" && (
        <AdminAds />
      )}

      {/* 7. LANGUAGES (POLYLANG) */}
      {activeTab === "languages" && (
        <AdminLanguages
          onNavigate={(tab) => {
            setActiveTab(tab);
            setEditingPage(null);
            setEditingPost(null);
          }}
          pages={pages}
          posts={posts}
        />
      )}

      {/* 8. SEO & SITEMAPS */}
      {activeTab === "seo" && (
        <AdminSeo />
      )}

      {/* 9. 301 / 302 REDIRECTS */}
      {activeTab === "redirects" && (
        <AdminRedirects />
      )}

      {/* 10. SETTINGS */}
      {activeTab === "settings" && (
        <AdminSettings />
      )}
    </AdminLayout>
  );
}
