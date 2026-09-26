import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from "react";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { Footer } from "./components/Footer";
import { HomeContent } from "./components/HomeContent";
import { SeoHead } from "./components/SeoHead";
import { HeaderAdBanner, BelowHeroAdBanner, FooterAdBanner, AdBlockDetector } from "./components/AdBanners";
import {
  TopAdPlacement,
  LeftAdPlacement,
  RightAdPlacement,
  CenterAdPlacement,
  BottomAdPlacement,
} from "./components/AdPlacement";
import { BLOG_POSTS, loadAllBlogPosts, getPostTranslationGroupId } from "./data/blogData";
import { ModernArticleRenderer } from "./components/ModernArticleRenderer";

// Lazy-loaded pages and administrative components to reduce initial JavaScript bundle
const PresentationBoard = lazy(() => import("./components/PresentationBoard").then((m) => ({ default: m.PresentationBoard })));
const BlogListingPage = lazy(() => import("./pages/BlogListingPage").then((m) => ({ default: m.BlogListingPage })));
const BlogArticlePage = lazy(() => import("./pages/BlogArticlePage").then((m) => ({ default: m.BlogArticlePage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const LegalPage = lazy(() => import("./pages/LegalPage").then((m) => ({ default: m.LegalPage })));
const SitemapPage = lazy(() => import("./pages/SitemapPage").then((m) => ({ default: m.SitemapPage })));
const RobotsPage = lazy(() => import("./pages/RobotsPage").then((m) => ({ default: m.RobotsPage })));
const CustomPageView = lazy(() => import("./pages/CustomPageView").then((m) => ({ default: m.CustomPageView })));
const AdminPanel = lazy(() => import("./components/admin/AdminPanel").then((m) => ({ default: m.AdminPanel })));
import {
  DownloadFormat,
  DownloadJob,
  PageRoute,
  ViewportMode,
  BlogPost,
  SiteSettings,
  AdSettings,
  CmsAd,
  SupportedLanguage,
  PageContent,
  CustomPage,
} from "./types";
import {
  loadSiteSettings,
  saveSiteSettings,
  loadAdSettings,
  saveAdSettings,
  loadPageContent,
} from "./data/siteConfig";
import { safeParseJson } from "./utils/apiSafe";

const VALID_LANGS: SupportedLanguage[] = ["en", "id", "es", "br", "fr", "de", "hi"];

function parseUrlRoute(
  pathname: string,
  hash: string,
  allPosts: BlogPost[],
  allCustomPages: CustomPage[] = []
): {
  page: PageRoute;
  lang: SupportedLanguage;
  post: BlogPost | null;
  customPage: CustomPage | null;
} {
  const lowerHash = hash.toLowerCase();
  const lowerPath = pathname.toLowerCase();

  if (lowerHash === "#admin" || lowerHash.startsWith("#admin/") || lowerPath === "/admin" || lowerPath.startsWith("/admin/")) {
    return { page: "admin", lang: "en", post: null, customPage: null };
  }

  const segments = pathname.split("/").filter(Boolean);
  let lang: SupportedLanguage = (localStorage.getItem("scribd_lang") as SupportedLanguage) || "en";
  let rest = segments;

  if (segments.length > 0) {
    const first = segments[0].toLowerCase();
    if (VALID_LANGS.includes(first as SupportedLanguage)) {
      lang = first as SupportedLanguage;
      rest = segments.slice(1);
    } else if (first === "pt") {
      lang = "br";
      rest = segments.slice(1);
    }
  }

  if (rest.length === 0) {
    return { page: "home", lang, post: null, customPage: null };
  }

  const routeKey = rest[0].toLowerCase();
  if (routeKey === "about") return { page: "about", lang, post: null, customPage: null };
  if (routeKey === "how-it-works") return { page: "how-it-works", lang, post: null, customPage: null };
  if (routeKey === "contact") return { page: "contact", lang, post: null, customPage: null };
  if (routeKey === "privacy" || routeKey === "legal") return { page: "privacy", lang, post: null, customPage: null };
  if (routeKey === "terms") return { page: "terms", lang, post: null, customPage: null };
  if (
    routeKey === "sitemap" ||
    routeKey === "sitemap.xml" ||
    routeKey === "sitemap_index.xml" ||
    routeKey === "post-sitemap.xml" ||
    routeKey === "page-sitemap.xml"
  ) {
    return { page: "sitemap", lang, post: null, customPage: null };
  }
  if (routeKey === "robots" || routeKey === "robots.txt") {
    return { page: "robots", lang, post: null, customPage: null };
  }
  if (routeKey === "blog") {
    if (rest.length > 1) {
      const slug = rest[1];
      const match = allPosts.find((p) => p.slug === slug || p.id === slug);
      if (match) {
        const groupId = getPostTranslationGroupId(match);
        const translatedInLang = allPosts.find(
          (p) => getPostTranslationGroupId(p) === groupId && (p.language || "en") === lang && p.status !== "draft"
        );
        const activePost = translatedInLang || match;
        return { page: "blog-article", lang: (activePost.language as SupportedLanguage) || lang, post: activePost, customPage: null };
      }
      return { page: "blog", lang, post: null, customPage: null };
    }
    return { page: "blog", lang, post: null, customPage: null };
  }

  // Check if matches a Custom Created Page by hash (e.g. #faq, #dmca)
  if (lowerHash) {
    const hashSlug = lowerHash.replace(/^#\/?/, "").split("?")[0];
    const matchCustomHash = allCustomPages.find(
      (p) => p.slug.toLowerCase() === hashSlug || p.id.toLowerCase() === hashSlug
    );
    if (matchCustomHash) {
      return { page: "custom-page", lang, post: null, customPage: matchCustomHash };
    }
  }

  // Check if matches a Custom Created Page by path
  const matchCustom = allCustomPages.find(
    (p) => p.slug.toLowerCase() === routeKey || p.id.toLowerCase() === routeKey
  );
  if (matchCustom) {
    return { page: "custom-page", lang, post: null, customPage: matchCustom };
  }

  return { page: "home", lang, post: null, customPage: null };
}

function buildUrl(
  page: PageRoute,
  lang: SupportedLanguage,
  post?: BlogPost | null,
  customPage?: CustomPage | null
): string {
  if (page === "admin") return "/admin";
  if (page === "home") return lang === "en" ? "/" : `/${lang}`;
  if (page === "sitemap") return lang === "en" ? "/sitemap.xml" : `/${lang}/sitemap.xml`;
  if (page === "robots") return lang === "en" ? "/robots.txt" : `/${lang}/robots.txt`;
  if (page === "blog-article" && post) return lang === "en" ? `/blog/${post.slug}` : `/${lang}/blog/${post.slug}`;
  if (page === "custom-page" && customPage) return `/${customPage.slug}`;
  return lang === "en" ? `/${page}` : `/${lang}/${page}`;
}

export default function App() {
  // Force clear cache for content updates
  React.useEffect(() => {
    const CACHE_VERSION = 'v3-markdown-update';
    if (localStorage.getItem('scribd_cache_version') !== CACHE_VERSION) {
      localStorage.removeItem('scribd_blog_posts');
      localStorage.removeItem('scribd_page_content_v6');
      localStorage.removeItem('scribd_page_content');
      localStorage.removeItem('scribd_custom_pages');
      localStorage.setItem('scribd_cache_version', CACHE_VERSION);
      window.location.reload();
    }
  }, []);

  const [viewportMode, setViewportMode] = useState<ViewportMode>("responsive");

  const [posts, setPosts] = useState<BlogPost[]>(loadAllBlogPosts);

  const [pageContents, setPageContents] = useState<PageContent[]>(loadPageContent);
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    try {
      const raw = localStorage.getItem("scribd_custom_pages");
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Initialize route from current window.location
  const initialRoute = parseUrlRoute(window.location.pathname, window.location.hash, posts, customPages);
  const [currentPage, setCurrentPage] = useState<PageRoute>(initialRoute.page);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(initialRoute.lang);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(initialRoute.post);
  const [selectedCustomPage, setSelectedCustomPage] = useState<CustomPage | null>(initialRoute.customPage);

  // Unified data sync for homepage, posts, and custom pages
  const syncAllData = React.useCallback((lang = currentLang) => {
    // 1. Fetch dynamic homepage content
    fetch(`/api/public/homepage?lang=${lang}&_t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : fetch(`/api/admin/homepage?lang=${lang}`).then((r) => (r.ok ? r.json() : null))))
      .then((resData) => {
        if (!resData) return;
        const hp = resData.content || resData;
        if (!hp) return;

        setPageContents((prev) => {
          const copy = [...prev];
          const idx = copy.findIndex(
            (c) => (c.pageKey === "home" && c.language === lang) || c.id === `home-${lang}`
          );
          const dynamicEntry: PageContent = {
            id: `home-${lang}`,
            pageKey: "home",
            language: lang,
            title: hp.guideTitle || hp.h1Title || hp.heroTitle || hp.metaTitle || "",
            metaDescription: hp.metaDescription || "",
            h1Heading: hp.h1Title || hp.heroTitle || "",
            heroHeading: hp.heroTitle || hp.h1Title || "",
            heroDescription: hp.heroSubtitle || "",
            ctaButtonText: hp.ctaText || "Download PDF",
            content: hp.htmlContent || hp.guideContent || "",
            htmlContent: hp.htmlContent || hp.guideContent || "",
            guideBadge: hp.guideBadge || "",
            guideTitle: hp.guideTitle || "",
            heroBadge: hp.heroBadge || "",
            faqs: hp.faqs || [],
            updatedAt: hp.lastUpdated || new Date().toISOString(),
            howTitle: hp.howTitle || "",
            howStep1: hp.howStep1 || "",
            howStep1Desc: hp.howStep1Desc || "",
            howStep2: hp.howStep2 || "",
            howStep2Desc: hp.howStep2Desc || "",
            howStep3: hp.howStep3 || "",
            howStep3Desc: hp.howStep3Desc || "",
            benefitsTitle: hp.benefitsTitle || "",
            benefitsFastTitle: hp.benefitsFastTitle || "",
            benefitsFastDesc: hp.benefitsFastDesc || "",
            benefitsSafeTitle: hp.benefitsSafeTitle || "",
            benefitsSafeDesc: hp.benefitsSafeDesc || "",
            benefitsDevicesTitle: hp.benefitsDevicesTitle || "",
            benefitsDevicesDesc: hp.benefitsDevicesDesc || "",
            benefitsFreeTitle: hp.benefitsFreeTitle || "",
            benefitsFreeDesc: hp.benefitsFreeDesc || "",
          };
          if (idx >= 0) {
            copy[idx] = { ...copy[idx], ...dynamicEntry };
          } else {
            copy.push(dynamicEntry);
          }
          return copy;
        });
      })
      .catch(() => {});

    // 2. Sync posts
    fetch(`/api/public/posts?_t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : fetch("/api/admin/posts").then((r) => (r.ok ? r.json() : null))))
      .then((data) => {
        if (data && Array.isArray(data.posts)) {
          const allServerPosts: BlogPost[] = [];
          data.posts.forEach((bp: any) => {
            if (Array.isArray(bp.allTranslations) && bp.allTranslations.length > 0) {
              bp.allTranslations.forEach((t: any) => {
                if (!t.inTrash && t.status !== "draft" && !allServerPosts.some((p) => p.id === t.id)) {
                  allServerPosts.push(t);
                }
              });
            } else if (!bp.inTrash && bp.status !== "draft" && !allServerPosts.some((p) => p.id === bp.id)) {
              allServerPosts.push(bp);
            }
          });
          setPosts(allServerPosts);
          try {
            localStorage.setItem("scribd_blog_posts", JSON.stringify(allServerPosts));
          } catch {}
        }
      })
      .catch(() => {});

    // 3. Sync custom pages
    fetch(`/api/public/pages?_t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : fetch("/api/admin/pages").then((r) => (r.ok ? r.json() : null))))
      .then((data) => {
        if (data && Array.isArray(data.pages)) {
          const allServerPages: CustomPage[] = [];
          data.pages.forEach((p: any) => {
            if (Array.isArray(p.allTranslations) && p.allTranslations.length > 0) {
              p.allTranslations.forEach((t: any) => {
                if (!t.inTrash && t.status === "published" && !allServerPages.some((x) => x.id === t.id)) {
                  allServerPages.push(t);
                }
              });
            } else if (!p.inTrash && p.status === "published" && !allServerPages.some((x) => x.id === p.id)) {
              allServerPages.push(p);
            }
          });
          setCustomPages(allServerPages);
          try {
            localStorage.setItem("scribd_custom_pages", JSON.stringify(allServerPages));
          } catch {}
        }
      })
      .catch(() => {});
  }, [currentLang]);

  useEffect(() => {
    syncAllData(currentLang);

    const handleContentUpdated = () => {
      syncAllData(currentLang);
    };

    window.addEventListener("scribd_content_updated", handleContentUpdated);
    window.addEventListener("storage", handleContentUpdated);

    return () => {
      window.removeEventListener("scribd_content_updated", handleContentUpdated);
      window.removeEventListener("storage", handleContentUpdated);
    };
  }, [currentLang, syncAllData]);

  // Keep current route in sync with dynamically loaded posts/pages
  useEffect(() => {
    const route = parseUrlRoute(window.location.pathname, window.location.hash, posts, customPages);
    if (route.page !== "home") {
      setCurrentPage(route.page);
      if (route.post) setSelectedPost(route.post);
      if (route.customPage) setSelectedCustomPage(route.customPage);
    }
  }, [posts, customPages]);

  // Settings & Localization state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(loadSiteSettings);
  const [adSettings, setAdSettings] = useState<AdSettings>(loadAdSettings);
  const [activeAds, setActiveAds] = useState<CmsAd[]>([]);

  // Sync ad settings and active ads from server
  useEffect(() => {
    fetch("/api/ad-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.adSettings) {
          setAdSettings(data.adSettings);
          saveAdSettings(data.adSettings);
        }
      })
      .catch(() => {});

    fetch("/api/ads/active")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ads) {
          setActiveAds(data.ads);
        }
      })
      .catch(() => {});
  }, []);

  // URL synchronization helper
  const navigateWithUrl = useCallback(
    (
      page: PageRoute,
      lang: SupportedLanguage,
      post?: BlogPost | null,
      customPage?: CustomPage | null,
      replace: boolean = false
    ) => {
      const newUrl = buildUrl(page, lang, post, customPage);
      if (replace) {
        window.history.replaceState(null, "", newUrl);
      } else {
        window.history.pushState(null, "", newUrl);
      }
    },
    []
  );

  // On mount: ensure URL reflects the language prefix if user arrived at root / with a non-English language
  useEffect(() => {
    if ((window.location.pathname === "/" || window.location.pathname === "") && currentLang !== "en") {
      navigateWithUrl("home", currentLang, null, null, true);
    }
  }, [currentLang, navigateWithUrl]);

  // Dynamically inject ad network script (e.g. AdSense) if configured and enabled
  useEffect(() => {
    if (!adSettings?.enabled || !adSettings?.adSenseScript) return;
    const scriptId = "scribd-ad-network-script";
    if (document.getElementById(scriptId)) return;

    const match = adSettings.adSenseScript.match(/src=["']([^"']+)["']/i);
    const src = match ? match[1] : (adSettings.adSenseScript.startsWith("http") ? adSettings.adSenseScript.trim() : null);

    if (src) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = src;
      document.head.appendChild(script);
    }
  }, [adSettings?.enabled, adSettings?.adSenseScript]);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const resolved = parseUrlRoute(window.location.pathname, window.location.hash, posts, customPages);
      setCurrentPage(resolved.page);
      setCurrentLang(resolved.lang);
      setSelectedPost(resolved.post);
      setSelectedCustomPage(resolved.customPage);
      localStorage.setItem("scribd_lang", resolved.lang);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, [posts, customPages]);

  // Language Change Handler: Updates URL and entire page content
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    localStorage.setItem("scribd_lang", lang);

    if (currentPage === "blog-article" && selectedPost) {
      const groupId = getPostTranslationGroupId(selectedPost);
      // Search for translated post in same group
      const translatedPost = posts.find(
        (p) =>
          getPostTranslationGroupId(p) === groupId &&
          (p.language || "en") === lang &&
          p.status !== "draft"
      );

      if (translatedPost) {
        setSelectedPost(translatedPost);
        navigateWithUrl("blog-article", lang, translatedPost);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      } else {
        // Find any post in that language so the user isn't stuck on untranslated content
        const anyInLang = posts.find((p) => (p.language || "en") === lang && p.status !== "draft");
        if (anyInLang) {
          setSelectedPost(anyInLang);
          navigateWithUrl("blog-article", lang, anyInLang);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        } else {
          setCurrentPage("blog");
          setSelectedPost(null);
          navigateWithUrl("blog", lang);
          return;
        }
      }
    }

    // For all other pages, update URL with new language prefix
    navigateWithUrl(currentPage, lang, selectedPost);
  };

  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    saveSiteSettings(newSettings);
  };

  const handleUpdateAdSettings = (newSettings: AdSettings) => {
    setAdSettings(newSettings);
    saveAdSettings(newSettings);
  };

  // Downloader state
  const [url, setUrl] = useState<string>("");
  const [format, setFormat] = useState<DownloadFormat>("pdf");
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [currentJob, setCurrentJob] = useState<DownloadJob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoDownload, setAutoDownload] = useState<boolean>(true);
  const autoDownloadedJobId = useRef<string | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef<number>(0);

  // Poll job status while active with safe intervals, backoff, and 404/network error resilience
  useEffect(() => {
    if (!currentJob) {
      errorCountRef.current = 0;
      return;
    }

    const isProcessing =
      currentJob.status === "queued" ||
      currentJob.status === "fetching" ||
      currentJob.status === "extracting" ||
      currentJob.status === "converting";

    if (!isProcessing) {
      setIsLoading(false);
      errorCountRef.current = 0;
      return;
    }

    // Handle client-side simulated demo jobs without unnecessary network polling
    if (currentJob.id.startsWith("demo_") || (currentJob as any).isMock) {
      pollingRef.current = setTimeout(() => {
        setCurrentJob((prev) => {
          if (!prev) return null;
          const nextProgress = Math.min(100, prev.progress + 25);
          const isDone = nextProgress >= 100;
          return {
            ...prev,
            progress: nextProgress,
            status: isDone ? "completed" : nextProgress > 60 ? "converting" : "extracting",
            stepMessage: isDone
              ? "⚡ Demo document extracted and ready for download!"
              : nextProgress > 60
              ? "Compiling vector pages into high-resolution PDF..."
              : "Extracting document slide assets...",
            pdfFile: isDone
              ? {
                  filename: "scribd-sample-document.pdf",
                  sizeBytes: 2450000,
                  path: "/api/download/359613425",
                }
              : prev.pdfFile,
          };
        });
      }, 300);

      return () => {
        if (pollingRef.current) clearTimeout(pollingRef.current);
      };
    }

    // Server-side job polling with ultra-responsive 250ms interval and instant auto-download trigger
    pollingRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/jobs/${encodeURIComponent(currentJob.id)}`);
        const updatedJob = await safeParseJson<DownloadJob>(res);
        if (updatedJob) {
          errorCountRef.current = 0;
          setCurrentJob(updatedJob);
          if (updatedJob.status === "completed" || updatedJob.status === "failed") {
            setIsLoading(false);
            // Trigger instant auto-download if enabled and not yet triggered for this job
            if (
              updatedJob.status === "completed" &&
              autoDownload &&
              updatedJob.pdfFile &&
              autoDownloadedJobId.current !== updatedJob.id
            ) {
              autoDownloadedJobId.current = updatedJob.id;
              try {
                const link = document.createElement("a");
                link.href = `/api/jobs/${updatedJob.id}/download`;
                link.download = updatedJob.pdfFile.filename || "scribd-document.pdf";
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                  if (document.body.contains(link)) document.body.removeChild(link);
                }, 500);
              } catch (e) {
                console.warn("Auto-download link trigger note:", e);
              }
            }
          }
        } else if (res.status === 404) {
          errorCountRef.current = 0;
          setCurrentJob((prev) =>
            prev
              ? {
                  ...prev,
                  status: "failed",
                  progress: 100,
                  stepMessage: "Job session expired",
                  error: "This download task has expired or was removed from server cache.",
                  troubleshooting: [
                    "Please re-enter your document URL to start a fresh extraction.",
                    "Or click on one of the instant sample documents above.",
                  ],
                }
              : null
          );
          setIsLoading(false);
        } else {
          errorCountRef.current += 1;
          if (errorCountRef.current > 5) {
            setCurrentJob((prev) =>
              prev
                ? {
                    ...prev,
                    status: "failed",
                    progress: 100,
                    stepMessage: "Processing paused",
                    error: "Unable to obtain updated job progress from server.",
                  }
                : null
            );
            setIsLoading(false);
          }
        }
      } catch {
        // Network glitch or dev server restart - retry quietly up to 5 times before failing
        errorCountRef.current += 1;
        if (errorCountRef.current > 5) {
          setCurrentJob((prev) =>
            prev
              ? {
                  ...prev,
                  status: "failed",
                  progress: 100,
                  stepMessage: "Connection interrupted",
                  error: "Network connection was interrupted. Please retry your download.",
                }
              : null
          );
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [currentJob, autoDownload]);

  // Navigate to page
  const handleNavigate = (page: PageRoute, customPageObj?: CustomPage | null) => {
    setCurrentPage(page);
    if (page !== "blog-article") {
      setSelectedPost(null);
    }
    if (page === "custom-page" && customPageObj) {
      setSelectedCustomPage(customPageObj);
      navigateWithUrl("custom-page", currentLang, null, customPageObj);
    } else {
      setSelectedCustomPage(null);
      navigateWithUrl(page, currentLang, page === "blog-article" ? selectedPost : null, null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open blog article
  const handleSelectPost = (post: BlogPost) => {
    const postLang = (post.language as SupportedLanguage) || currentLang;
    setSelectedPost(post);
    setCurrentLang(postLang);
    setCurrentPage("blog-article");
    localStorage.setItem("scribd_lang", postLang);
    navigateWithUrl("blog-article", postLang, post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Trigger CTA from header or sections
  const handleCtaClick = () => {
    if (currentPage !== "home") {
      setCurrentPage("home");
      navigateWithUrl("home", currentLang);
      setTimeout(() => {
        const el = document.getElementById("downloader-section");
        el?.scrollIntoView({ behavior: "smooth" });
        const input = document.getElementById("hero-url-input") as HTMLInputElement;
        input?.focus();
      }, 100);
    } else {
      const el = document.getElementById("downloader-section");
      el?.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("hero-url-input") as HTMLInputElement;
      input?.focus();
    }
  };

  // Get current home content based on selected language
  const currentHomeContent =
    pageContents.find(
      (c) =>
        (c.pageKey === "home" && c.language === currentLang) ||
        c.id === `home-${currentLang}`
    ) || pageContents.find((c) => c.id === "home");

  // If presentation board mode is active, render design showcase canvas
  if (viewportMode === "presentation") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          viewportMode={viewportMode}
          onSetViewportMode={setViewportMode}
          onCtaClick={handleCtaClick}
          currentLang={currentLang}
          onSelectLang={handleLanguageChange}
        />
        <main className="flex-1">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-slate-400">Loading...</div>}>
            <PresentationBoard onOpenLiveSite={() => setViewportMode("responsive")} />
          </Suspense>
        </main>
      </div>
    );
  }

  // If admin CMS mode is active, render the comprehensive CMS administration console
  if (currentPage === "admin") {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-mono text-xs">
            Loading CMS Admin Console...
          </div>
        }
      >
        <AdminPanel
          onExitToSite={() => handleNavigate("home")}
          onPreviewUrl={(previewUrl) => {
            window.history.pushState(null, "", previewUrl);
            const resolved = parseUrlRoute(window.location.pathname, window.location.hash, posts, customPages);
            setCurrentPage(resolved.page);
            setCurrentLang(resolved.lang);
            setSelectedPost(resolved.post);
            setSelectedCustomPage(resolved.customPage);
          }}
        />
      </Suspense>
    );
  }

  // Determine viewport width wrapper for interactive simulated previews
  const getViewportWrapperClass = () => {
    switch (viewportMode) {
      case "desktop":
        return "max-w-[1440px] mx-auto border-x border-slate-300 shadow-2xl bg-white";
      case "tablet":
        return "max-w-[768px] mx-auto border-x border-slate-300 shadow-2xl bg-white";
      case "mobile":
        return "max-w-[390px] mx-auto border-x border-slate-300 shadow-2xl bg-white";
      case "responsive":
      default:
        return "w-full";
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-800 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Dynamic SEO Tags, Meta Description & JSON-LD */}
      <SeoHead
        page={currentPage}
        post={selectedPost}
        customTitle={selectedCustomPage?.metaTitle}
        customDescription={selectedCustomPage?.metaDescription}
      />

      {/* Anti-AdBlock Detection Modal */}
      {adSettings?.enabled && adSettings?.antiAdblock && <AdBlockDetector />}

      {/* Top Universal Navigation Header with Viewport Toolbar & Language Selector */}
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        viewportMode={viewportMode}
        onSetViewportMode={setViewportMode}
        onCtaClick={handleCtaClick}
        currentLang={currentLang}
        onSelectLang={handleLanguageChange}
        customPages={customPages}
        onSelectCustomPage={(cp) => handleNavigate("custom-page", cp)}
      />

      {/* Top Placement Ad (Header / Below Navigation) */}
      <TopAdPlacement settings={adSettings} ads={activeAds} />

      {/* Legacy Header Ad Banner Unit if explicitly enabled */}
      {adSettings?.enabled && adSettings?.headerAd && (
        <div className="bg-slate-50 border-b border-slate-200/80 py-2.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <HeaderAdBanner settings={adSettings} />
          </div>
        </div>
      )}

      {/* Left and Right Desktop Flank Ad Placements (Hides on mobile/tablet to protect UI/UX) */}
      <LeftAdPlacement settings={adSettings} ads={activeAds} />
      <RightAdPlacement settings={adSettings} ads={activeAds} />

      {/* Main Viewport Container */}
      <div className={`flex-1 flex flex-col ${getViewportWrapperClass()}`}>
        {/* Device Viewport Indicator Pill if not responsive */}
        {viewportMode !== "responsive" && (
          <aside
            aria-label="Active Viewport Simulation"
            className="bg-indigo-600 text-white text-[11px] font-semibold py-1.5 px-4 flex items-center justify-between shadow-xs"
          >
            <span>Simulating {viewportMode.toUpperCase()} Viewport</span>
            <button
              type="button"
              onClick={() => setViewportMode("responsive")}
              className="underline hover:text-indigo-200 cursor-pointer"
            >
              Reset to Full Screen
            </button>
          </aside>
        )}

        <main className="flex-1">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-slate-400 font-medium">Loading page...</div>}>
            {/* 1. HOMEPAGE */}
            {currentPage === "home" && (
              <>
                <HeroSection
                  url={url}
                  setUrl={setUrl}
                  format={format}
                  setFormat={setFormat}
                  demoMode={demoMode}
                  setDemoMode={setDemoMode}
                  currentJob={currentJob}
                  setCurrentJob={setCurrentJob}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  adSettings={adSettings}
                  currentLang={currentLang}
                  autoDownload={autoDownload}
                  setAutoDownload={setAutoDownload}
                  pageContent={currentHomeContent}
                />
                {/* Center Placement Ad (In-Content between Hero and Features) */}
                <CenterAdPlacement settings={adSettings} ads={activeAds} />

                {/* Legacy Below Hero / Downloader Ad Slot */}
                {adSettings?.enabled && adSettings?.belowHeroAd && (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <BelowHeroAdBanner settings={adSettings} />
                  </div>
                )}
                <HomeContent
                  onNavigate={handleNavigate}
                  posts={posts}
                  onSelectPost={handleSelectPost}
                  currentLang={currentLang}
                  pageContent={currentHomeContent}
                />
              </>
            )}

            {/* 2. HOW IT WORKS */}
            {currentPage === "how-it-works" && (
              <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                      Step-by-Step Guide
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      How Scribd Downloader Operates
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                      Learn how our smart system safely retrieves pages and compiles them into a beautiful, easy-to-read PDF document in seconds.
                    </p>
                  </div>
                </div>
                <HomeContent
                  onNavigate={handleNavigate}
                  posts={posts}
                  onSelectPost={handleSelectPost}
                  currentLang={currentLang}
                />
              </div>
            )}

            {/* 3. BLOG LISTING PAGE */}
            {currentPage === "blog" && (
              <BlogListingPage
                posts={posts}
                currentLang={currentLang}
                onSelectPost={handleSelectPost}
                onNavigate={handleNavigate}
              />
            )}

            {/* 4. BLOG ARTICLE READER PAGE */}
            {currentPage === "blog-article" && selectedPost && (
              <BlogArticlePage
                post={selectedPost}
                allPosts={posts}
                onBackToBlog={() => handleNavigate("blog")}
                onSelectPost={handleSelectPost}
                onNavigate={handleNavigate}
                onQuickDownloadClick={handleCtaClick}
                onLanguageChange={handleLanguageChange}
                currentLang={currentLang}
                adSettings={adSettings}
              />
            )}

            {/* 5. ABOUT PAGE */}
            {currentPage === "about" && (
              <AboutPage
                onNavigate={handleNavigate}
                onCtaClick={handleCtaClick}
                currentLang={currentLang}
              />
            )}

            {/* 6. CONTACT PAGE */}
            {currentPage === "contact" && (
              <ContactPage onNavigate={handleNavigate} currentLang={currentLang} />
            )}

            {/* 7. PRIVACY POLICY */}
            {currentPage === "privacy" && (
              <LegalPage initialTab="privacy" onNavigate={handleNavigate} currentLang={currentLang} />
            )}

            {/* 8. TERMS OF SERVICE & FAIR USE */}
            {currentPage === "terms" && (
              <LegalPage initialTab="terms" onNavigate={handleNavigate} currentLang={currentLang} />
            )}

            {/* 9. XML SITEMAP & DIRECTORY */}
            {currentPage === "sitemap" && (
              <SitemapPage
                onNavigate={handleNavigate}
                onSelectPost={handleSelectPost}
                allCustomPages={customPages}
                currentLang={currentLang}
              />
            )}

            {/* 9b. ROBOTS.TXT CRAWLER DIRECTIVES */}
            {currentPage === "robots" && (
              <RobotsPage
                onNavigate={handleNavigate}
                currentLang={currentLang}
              />
            )}

            {/* 10. CUSTOM CREATED CMS PAGES */}
            {currentPage === "custom-page" && (
              <CustomPageView
                page={selectedCustomPage || customPages[0]}
                onNavigate={handleNavigate}
                allCustomPages={customPages}
                currentLang={currentLang}
              />
            )}
          </Suspense>
        </main>

        {/* Global Bottom / Sticky Ad Placement */}
        <BottomAdPlacement settings={adSettings} ads={activeAds} />

        {/* Global Footer Ad Banner Slot (Above Footer) */}
        {adSettings?.enabled && adSettings?.footerAd && (
          <FooterAdBanner settings={adSettings} />
        )}

        {/* Global Multi-Column Footer */}
        <Footer
          onNavigate={handleNavigate}
          onCtaClick={handleCtaClick}
          siteSettings={siteSettings}
          currentLang={currentLang}
          customPages={customPages}
        />
      </div>
    </div>
  );
}
