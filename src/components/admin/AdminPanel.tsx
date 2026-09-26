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
import { AdminSitemap } from "./AdminSitemap";
import { AdminCrawlerHealth } from "./AdminCrawlerHealth";
import { AdminCategories } from "./AdminCategories";
import { AdminTags } from "./AdminTags";
import { AdminRedirects } from "./AdminRedirects";
import { AdminSettings } from "./AdminSettings";
import { Loader2, ShieldCheck, Lock, User, KeyRound, AlertCircle, LogOut } from "lucide-react";
import { getAdminToken, setAdminToken, adminFetch, DEFAULT_ADMIN_TOKEN } from "../../utils/adminApi";

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

  // Authentication state
  const [authToken, setAuthTokenState] = useState<string>(() => {
    return getAdminToken();
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  // Fetch initial data with safety timeout
  const loadInitialData = async () => {
    setLoading(true);

    // Guaranteed safety timeout: Workspace will unlock within 2.5 seconds max
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    try {
      const [pagesRes, postsRes, metricsRes] = await Promise.all([
        adminFetch("/api/admin/pages", {}, 3500).catch((e) => {
          console.warn("Pages fetch failed:", e);
          return null;
        }),
        adminFetch("/api/admin/posts", {}, 3500).catch((e) => {
          console.warn("Posts fetch failed:", e);
          return null;
        }),
        adminFetch("/api/admin/metrics", {}, 3500).catch((e) => {
          console.warn("Metrics fetch failed:", e);
          return null;
        }),
      ]);

      clearTimeout(safetyTimer);

      if (
        (pagesRes && pagesRes.status === 401) ||
        (postsRes && postsRes.status === 401)
      ) {
        // If stored token was corrupted, try resetting to default token once
        const currentToken = getAdminToken();
        if (currentToken !== DEFAULT_ADMIN_TOKEN) {
          setAdminToken(DEFAULT_ADMIN_TOKEN);
          setAuthTokenState(DEFAULT_ADMIN_TOKEN);
          return;
        }
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (pagesRes && pagesRes.ok) {
        try {
          const pagesData = await pagesRes.json();
          if (Array.isArray(pagesData.pages)) {
            setPages(pagesData.pages);
          }
        } catch {}
      }

      if (postsRes && postsRes.ok) {
        try {
          const postsData = await postsRes.json();
          if (Array.isArray(postsData.posts)) {
            setPosts(postsData.posts);
          }
        } catch {}
      }

      if (metricsRes && metricsRes.ok) {
        try {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData.metrics || metricsData);
        } catch {}
      }

      setIsAuthenticated(true);
    } catch (err) {
      clearTimeout(safetyTimer);
      console.error("Failed to load CMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [authToken]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const token = data.token || DEFAULT_ADMIN_TOKEN;
        setAdminToken(token);
        setAuthTokenState(token);
        setIsAuthenticated(true);
        loadInitialData();
      } else {
        setLoginError(data.error || "Invalid administrator credentials");
      }
    } catch (err) {
      setLoginError("Failed to connect to authentication server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

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

  const parseJsonSafely = async (res: Response): Promise<any> => {
    try {
      const text = await res.text();
      if (!text || !text.trim()) return null;
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  // Page Actions
  const handleSavePage = async (pageData: any) => {
    const res = await adminFetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    const result = await parseJsonSafely(res);
    if (!res.ok || (result && result.success === false)) {
      throw new Error(result?.error || result?.message || `Save failed (HTTP ${res.status})`);
    }
    // Reload pages list
    const refreshed = await adminFetch("/api/admin/pages");
    const data = await parseJsonSafely(refreshed);
    if (data?.pages) {
      setPages(data.pages);
      try {
        localStorage.setItem("scribd_custom_pages", JSON.stringify(data.pages));
      } catch {}
    }
    window.dispatchEvent(new CustomEvent("scribd_content_updated"));
    setEditingPage(null);
  };

  const refreshPagesFromServer = async () => {
    try {
      const refreshed = await adminFetch("/api/admin/pages");
      const data = await parseJsonSafely(refreshed);
      if (data?.pages) {
        setPages(data.pages);
        const activePages = data.pages.filter((p: any) => !p.inTrash && p.status === "published");
        try { localStorage.setItem("scribd_custom_pages", JSON.stringify(activePages)); } catch {}
      }
    } catch (e) {
      console.error("Failed to refresh pages from server:", e);
    }
  };

  const refreshPostsFromServer = async () => {
    try {
      const refreshed = await adminFetch("/api/admin/posts");
      const data = await parseJsonSafely(refreshed);
      if (data?.posts) {
        setPosts(data.posts);
        const activePosts = data.posts.filter((p: any) => !p.inTrash && p.status === "published");
        try { localStorage.setItem("scribd_blog_posts", JSON.stringify(activePosts)); } catch {}
      }
    } catch (e) {
      console.error("Failed to refresh posts from server:", e);
    }
  };

  const handleTrashPage = async (id: string) => {
    await adminFetch(`/api/admin/pages/trash/${id}`, { method: "POST" });
    await refreshPagesFromServer();
    window.dispatchEvent(new CustomEvent("scribd_content_updated"));
  };

  const handleRestorePage = async (id: string) => {
    await adminFetch(`/api/admin/pages/restore/${id}`, { method: "POST" });
    await refreshPagesFromServer();
    window.dispatchEvent(new CustomEvent("scribd_content_updated"));
  };

  const handleDeletePagePermanently = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this page?")) return;
    await adminFetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    await refreshPagesFromServer();
    window.dispatchEvent(new CustomEvent("scribd_content_updated"));
  };

  const handleDuplicatePage = async (page: any) => {
    const res = await adminFetch(`/api/admin/pages/duplicate/${page.id}`, { method: "POST" });
    const data = await parseJsonSafely(res);
    if (data?.duplicated) {
      await refreshPagesFromServer();
      window.dispatchEvent(new CustomEvent("scribd_content_updated"));
    }
  };

  // Post Actions
  const handleSavePost = async (postData: any) => {
    const res = await adminFetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    const result = await parseJsonSafely(res);
    if (!res.ok || (result && result.success === false)) {
      throw new Error(result?.error || result?.message || `Save failed (HTTP ${res.status})`);
    }
    await refreshPostsFromServer();
    window.dispatchEvent(new CustomEvent("scribd_content_updated"));
    setEditingPost(null);
  };

  const handleTrashPost = async (id: string) => {
    await adminFetch(`/api/admin/posts/trash/${id}`, { method: "POST" });
    await refreshPostsFromServer();
    window.dispatchEvent(new CustomEvent("scribd_content_updated"));
  };

  const handleRestorePost = async (id: string) => {
    await adminFetch(`/api/admin/posts/restore/${id}`, { method: "POST" });
    await refreshPostsFromServer();
    window.dispatchEvent(new CustomEvent("scribd_content_updated"));
  };

  const handleDeletePostPermanently = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this post?")) return;
    await adminFetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    await refreshPostsFromServer();
    window.dispatchEvent(new CustomEvent("scribd_content_updated"));
  };

  const handleDuplicatePost = async (post: any) => {
    const res = await adminFetch(`/api/admin/posts/duplicate/${post.id}`, { method: "POST" });
    const data = await parseJsonSafely(res);
    if (data?.duplicated) {
      await refreshPostsFromServer();
      window.dispatchEvent(new CustomEvent("scribd_content_updated"));
    }
  };

  // Homepage Actions
  const handleSaveHomepage = async (lang: string, content: any) => {
    const res = await adminFetch("/api/admin/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, language: lang, content }),
    });
    const result = await parseJsonSafely(res);
    if (!res.ok || (result && result.success === false)) {
      throw new Error(result?.error || result?.message || `Save failed (HTTP ${res.status})`);
    }
    window.dispatchEvent(new CustomEvent("scribd_content_updated"));
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white space-y-4 flex-col p-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Initializing CMS Admin Workspace...</p>
        <button
          type="button"
          onClick={() => setLoading(false)}
          className="text-xs text-emerald-400 hover:text-emerald-300 underline font-mono cursor-pointer"
        >
          Skip to Workspace →
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Scribd Downloader Admin</h2>
              <p className="text-xs text-slate-400">Protected System Control Panel</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={onExitToSite}
              className="hover:text-slate-300 transition text-xs font-medium"
            >
              ← Back to Main Website
            </button>
            <span>v2.4.0 • Server Authenticated</span>
          </div>
        </div>
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
        <AdminHomepage
          onSave={handleSaveHomepage}
          onPreviewUrl={(url) => {
            if (onPreviewUrl) onPreviewUrl(url);
            else window.open(url, "_blank");
          }}
        />
      )}

      {/* 5. MEDIA LIBRARY */}
      {activeTab === "media" && (
        <AdminMedia />
      )}

      {/* 5B. CATEGORIES */}
      {activeTab === "categories" && (
        <AdminCategories posts={posts} />
      )}

      {/* 5C. TAGS */}
      {activeTab === "tags" && (
        <AdminTags posts={posts} />
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

      {/* 8. SEO SETTINGS */}
      {activeTab === "seo" && (
        <AdminSeo />
      )}

      {/* 8B. XML SITEMAPS */}
      {activeTab === "sitemap" && (
        <AdminSitemap />
      )}

      {/* 8C. SITE / CRAWLER HEALTH */}
      {activeTab === "crawler-health" && (
        <AdminCrawlerHealth />
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
