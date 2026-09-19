import React, { useState } from "react";
import {
  AdminUser,
  AdminRole,
  BlogPost,
  AdSettings,
  DownloadSettings,
  SiteSettings,
  MediaItem,
  PageRoute,
  SupportedLanguage
} from "../../types";
import { BLOG_POSTS } from "../../data/blogData";
import { SUPPORTED_LANGUAGES } from "../../data/translations";
import {
  loadAdSettings,
  saveAdSettings,
  loadSiteSettings,
  saveSiteSettings,
  loadDownloadSettings,
  saveDownloadSettings,
  syncPostsAndRebuildSitemap,
  INITIAL_MEDIA_ITEMS,
} from "../../data/siteConfig";
import { AdminDashboard } from "./AdminDashboard";
import { AdminPosts } from "./AdminPosts";
import { AdminPages } from "./AdminPages";
import { AdminSeoCrawler } from "./AdminSeoCrawler";
import { AdminAds } from "./AdminAds";
import { AdminSettings } from "./AdminSettings";
import { AdminTranslations } from "./AdminTranslations";
import { AdminMedia } from "./AdminMedia";
import { DEFAULT_POST_TRANSLATION_GROUPS } from "./AdminPosts";
import { AdminPagesContent } from "./AdminPagesContent";
import { AdminMessages } from "./AdminMessages";
import { AdminMcp } from "./AdminMcp";
import {
  LayoutDashboard,
  FileEdit,
  MessageSquare,
  FileText,
  Files,
  Globe,
  Sparkles,
  Settings,
  Languages,
  Image,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Lock,
  User,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Cpu
} from "lucide-react";

interface AdminPanelProps {
  onNavigate: (page: PageRoute) => void;
  posts?: BlogPost[];
  onSavePost?: (post: BlogPost) => void;
  onDeletePost?: (id: string, permanent?: boolean) => void;
  adSettings?: AdSettings;
  onSaveAdSettings?: (settings: AdSettings) => void;
  siteSettings?: SiteSettings;
  onSaveSiteSettings?: (settings: SiteSettings) => void;
  downloadSettings?: DownloadSettings;
  onSaveDownloadSettings?: (settings: DownloadSettings) => void;
  mediaItems?: MediaItem[];
  onAddMedia?: (item: MediaItem) => void;
  onDeleteMedia?: (id: string) => void;
  categories?: string[];
  tags?: string[];
  currentLang?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export function AdminPanel({
  onNavigate,
  posts: propPosts,
  onSavePost: propOnSavePost,
  onDeletePost: propOnDeletePost,
  adSettings: propAdSettings,
  onSaveAdSettings: propOnSaveAdSettings,
  siteSettings: propSiteSettings,
  onSaveSiteSettings: propOnSaveSiteSettings,
  downloadSettings: propDownloadSettings,
  onSaveDownloadSettings: propOnSaveDownloadSettings,
  mediaItems: propMediaItems,
  onAddMedia: propOnAddMedia,
  onDeleteMedia: propOnDeleteMedia,
  categories: propCategories = ["Guides", "Tutorials", "Tech", "Tips"],
  tags: propTags = ["Scribd", "PDF", "Downloader", "Conversion", "Free", "Offline", "Mobile", "system"],
  currentLang: propCurrentLang = "en",
  onLanguageChange: propOnLanguageChange,
}: AdminPanelProps) {
  // Active Admin Language State
  const [adminLang, setAdminLang] = useState<SupportedLanguage>(() => {
    return propCurrentLang || "en";
  });

  const handleAdminLanguageChange = (newLang: SupportedLanguage) => {
    setAdminLang(newLang);
    if (propOnLanguageChange) {
      propOnLanguageChange(newLang);
    }
  };

  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  React.useEffect(() => {
    let unsubscribe: any;
    
    Promise.all([
      import("../../lib/firebase"),
      import("firebase/auth")
    ]).then(([{ auth }, { onAuthStateChanged }]) => {
      unsubscribe = onAuthStateChanged(auth, (user: any) => {
        if (user && user.email === "minhashussainbaltistani@gmail.com") {
          setCurrentUser({
            username: user.email,
            role: "superadmin",
            name: "Administrator",
          });
        } else {
          setCurrentUser(null);
        }
        setAuthLoading(false);
      });
    }).catch(err => {
      console.error("Error loading auth:", err);
      setAuthLoading(false);
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Internal persistent states
  const [internalPosts, setInternalPosts] = useState<BlogPost[]>(() => {
    if (propPosts) return propPosts;
    try {
      const stored = localStorage.getItem("scribd_blog_posts");
      if (stored) {
        const parsed: BlogPost[] = JSON.parse(stored);
        return parsed.map((p) => ({
          ...p,
          translationGroupId: p.translationGroupId || DEFAULT_POST_TRANSLATION_GROUPS[p.id] || `tg-${p.id}`,
        }));
      }
    } catch (e) {
      console.error(e);
    }
    return BLOG_POSTS;
  });

  const [internalAdSettings, setInternalAdSettings] = useState<AdSettings>(() => {
    return propAdSettings || loadAdSettings();
  });

  const [internalSiteSettings, setInternalSiteSettings] = useState<SiteSettings>(() => {
    return propSiteSettings || loadSiteSettings();
  });

  const [internalDownloadSettings, setInternalDownloadSettings] = useState<DownloadSettings>(() => {
    return propDownloadSettings || loadDownloadSettings();
  });

  const [internalMedia, setInternalMedia] = useState<MediaItem[]>(() => {
    if (propMediaItems) return propMediaItems;
    try {
      const stored = localStorage.getItem("scribd_media_items");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MEDIA_ITEMS;
  });

  const handleSavePost = (post: BlogPost) => {
    if (propOnSavePost) {
      propOnSavePost(post);
    }
    setInternalPosts((prev) => {
      const exists = prev.some((p) => p.id === post.id);
      const updated = exists ? prev.map((p) => (p.id === post.id ? post : p)) : [post, ...prev];
      localStorage.setItem("scribd_blog_posts", JSON.stringify(updated));
      syncPostsAndRebuildSitemap(updated);
      return updated;
    });
  };

  const handleDeletePost = (id: string, permanent?: boolean) => {
    if (propOnDeletePost) {
      propOnDeletePost(id, permanent);
    }
    setInternalPosts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("scribd_blog_posts", JSON.stringify(updated));
      syncPostsAndRebuildSitemap(updated);
      return updated;
    });
  };

  const handleSaveAdSettings = (settings: AdSettings) => {
    if (propOnSaveAdSettings) {
      propOnSaveAdSettings(settings);
    }
    setInternalAdSettings(settings);
    saveAdSettings(settings);
  };

  const handleSaveSiteSettings = (settings: SiteSettings) => {
    if (propOnSaveSiteSettings) {
      propOnSaveSiteSettings(settings);
    }
    setInternalSiteSettings(settings);
    saveSiteSettings(settings);
  };

  const handleSaveDownloadSettings = (settings: DownloadSettings) => {
    if (propOnSaveDownloadSettings) {
      propOnSaveDownloadSettings(settings);
    }
    setInternalDownloadSettings(settings);
    saveDownloadSettings(settings);
  };

  const handleAddMedia = (item: MediaItem) => {
    if (propOnAddMedia) {
      propOnAddMedia(item);
    }
    setInternalMedia((prev) => {
      const updated = [item, ...prev];
      localStorage.setItem("scribd_media_items", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteMedia = (id: string) => {
    if (propOnDeleteMedia) {
      propOnDeleteMedia(id);
    }
    setInternalMedia((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem("scribd_media_items", JSON.stringify(updated));
      return updated;
    });
  };

  const currentPosts = propPosts || internalPosts;
  const currentAdSettings = propAdSettings || internalAdSettings;
  const currentSiteSettings = propSiteSettings || internalSiteSettings;
  const currentDownloadSettings = propDownloadSettings || internalDownloadSettings;
  const currentMedia = propMediaItems || internalMedia;

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "mcp"
    | "posts"
    | "pages"
    | "seo"
    | "page_content"
    | "messages"
    | "ads"
    | "settings"
    | "translations"
    | "media"
  >("dashboard");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername !== "minhashussainbaltistani@gmail.com") {
      setLoginError("Only admin is allowed to sign in.");
      return;
    }
    setLoginInProgress(true);
    setLoginError("");

    try {
      const { auth } = await import("../../lib/firebase");
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("firebase/auth");
      
      try {
        await signInWithEmailAndPassword(auth, loginUsername, loginPassword);
      } catch (err: any) {
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
           // Attempt to create the user if they don't exist yet (this handles the first-time setup as requested)
           try {
              await createUserWithEmailAndPassword(auth, loginUsername, loginPassword);
           } catch (createErr: any) {
              setLoginError("Login failed: " + createErr.message);
           }
        } else if (err.code === "auth/network-request-failed") {
          setLoginError("Network error. If you are in the AI Studio preview, your browser may be blocking third-party requests. Please open the app in a new tab to log in, or disable your adblocker.");
        } else {
          setLoginError("Login failed: " + err.message);
        }
      }
    } catch (err: any) {
      setLoginError("Error connecting to Auth: " + err.message);
    } finally {
      setLoginInProgress(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { auth } = await import("../../lib/firebase");
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } catch(e) {}
  };

  // Switch role for demo & testing (Super Admin vs Editor vs Viewer)
  const handleChangeRole = (role: AdminRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-white">Loading Admin...</div>
      </div>
    );
  }

  // If not logged in, show login form
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl border border-slate-200">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/25">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Admin Control Center
            </h2>
            <p className="text-xs text-slate-500">
              Sign in to manage blog posts, pages, monetization, and system analytics.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address (Admin Only)</label>
              <input
                type="email"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={loginInProgress}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loginInProgress ? "Signing in..." : "Sign In to Admin Panel"}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end text-xs text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-indigo-600 font-semibold"
            >
              Return to Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                S
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-tight">Scribd Admin</h1>
                <p className="text-[10px] text-slate-400 font-mono">v3.2 Control Center</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* User & Role Badge (Item 32) */}
          <div className="p-4 bg-slate-800/60 mx-3 my-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-white truncate">{currentUser.name}</span>
              </div>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentUser.role}
              </span>
            </div>

            {/* Role Switcher */}
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span>Role:</span>
              <select
                value={currentUser.role}
                onChange={(e) => handleChangeRole(e.target.value as AdminRole)}
                className="bg-slate-900 text-slate-200 rounded px-1.5 py-0.5 border border-slate-700 text-[10px]"
              >
                <option value="superadmin">Super Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          {/* Global Language Switcher in Sidebar */}
          <div className="mx-3 mb-4 p-3 bg-slate-800/70 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Language Switcher
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {adminLang.toUpperCase()}
              </span>
            </div>

            <div className="relative">
              <select
                id="admin-sidebar-language-select"
                value={adminLang}
                onChange={(e) => handleAdminLanguageChange(e.target.value as SupportedLanguage)}
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-semibold text-xs rounded-lg px-2.5 py-2 border border-slate-700 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer appearance-none pr-8 transition"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "mcp", label: "MCP & AI Agents", icon: Cpu },
              { id: "posts", label: "Blog & Articles", icon: FileText },
              { id: "pages", label: "Website Pages", icon: Files },
              { id: "seo", label: "Robots & Sitemap", icon: Globe },
              { id: "page_content", label: "Pages Content", icon: FileEdit },
              { id: "messages", label: "Messages", icon: MessageSquare },
              { id: "ads", label: "Advertisements", icon: Sparkles },
              { id: "settings", label: "Site & Engine", icon: Settings },
              { id: "translations", label: "Translations", icon: Languages },
              { id: "media", label: "Media Assets", icon: Image },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`admin-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Visit Live Website</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl hover:bg-rose-500/10 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "mcp" && <AdminMcp />}
        {activeTab === "posts" && (
          <AdminPosts
            posts={currentPosts}
            onSavePost={handleSavePost}
            onDeletePost={handleDeletePost}
            categories={propCategories}
            tags={propTags}
          />
        )}
        {activeTab === "pages" && (
          <AdminPages />
        )}
        {activeTab === "seo" && <AdminSeoCrawler posts={currentPosts} />}
        {activeTab === "page_content" && <AdminPagesContent />}
        {activeTab === "messages" && <AdminMessages />}
        {activeTab === "ads" && (
          <AdminAds settings={currentAdSettings} onSaveSettings={handleSaveAdSettings} />
        )}
        {activeTab === "settings" && (
          <AdminSettings
            siteSettings={currentSiteSettings}
            downloadSettings={currentDownloadSettings}
            onSaveSiteSettings={handleSaveSiteSettings}
            onSaveDownloadSettings={handleSaveDownloadSettings}
          />
        )}
        {activeTab === "translations" && <AdminTranslations />}
        {activeTab === "media" && (
          <AdminMedia
            mediaItems={currentMedia}
            onAddMedia={handleAddMedia}
            onDeleteMedia={handleDeleteMedia}
          />
        )}
      </main>
    </div>
  );
}
