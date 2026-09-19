import React, { useState, useMemo } from "react";
import { Search, Calendar, Clock, ArrowRight, BookOpen, Sparkles, Filter, CheckCircle2 } from "lucide-react";
import { BlogPost, PageRoute, SupportedLanguage } from "../types";
import { handleImageError, DEFAULT_AUTHOR_AVATAR } from "../utils/imageFallback";

interface BlogListingPageProps {
  posts: BlogPost[];
  currentLang?: SupportedLanguage;
  onSelectPost: (post: BlogPost) => void;
  onNavigate: (page: PageRoute) => void;
}

export function BlogListingPage({
  posts,
  onSelectPost,
  onNavigate,
  currentLang = "en",
}: BlogListingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const langMatchingPosts = useMemo(() => {
    const published = posts.filter((p) => p.status !== "draft");
    const matching = published.filter((p) => (p.language || "en") === currentLang);
    return matching.length > 0 ? matching : published;
  }, [posts, currentLang]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    langMatchingPosts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [langMatchingPosts]);

  const filteredPosts = useMemo(() => {
    return langMatchingPosts.filter((post) => {
      const matchSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [langMatchingPosts, searchQuery, selectedCategory]);

  const POSTS_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = useMemo(() => {
    const start = (currentPageNum - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPageNum]);

  const featuredPost = langMatchingPosts.find((p) => p.featured) || langMatchingPosts[0] || posts[0];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Tutorials":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Tech":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Tips":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Guides":
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  const getReadActionLabel = (category: string) => {
    switch (category) {
      case "Tutorials":
        return "Read Tutorial";
      case "Tech":
        return "Read Tech Analysis";
      case "Tips":
        return "Read Tip";
      case "Guides":
      default:
        return "Read Guide";
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribedSuccess(true);
      setTimeout(() => setSubscribedSuccess(false), 4000);
      setSubscribedEmail("");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Page Header & Breadcrumbs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:text-indigo-600 transition"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Blog & Guides</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Knowledge Base & Research
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Scribd Downloader Blog
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                Practical guides, step-by-step document conversion tutorials, and research productivity methods.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="blog-search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPageNum(1);
                }}
                placeholder="Search tutorials, keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 text-xs sm:text-sm bg-white outline-none transition"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                id={`blog-cat-${cat}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPageNum(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Large Featured Article Hero (if not searching) */}
        {!searchQuery && selectedCategory === "All" && featuredPost && (
          <div
            onClick={() => onSelectPost(featuredPost)}
            className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100 relative">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                width={800}
                height={500}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
                onError={handleImageError}
              />
              <span className="absolute top-4 left-4 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-md bg-white/95 text-indigo-700 shadow-sm">
                Featured Guide
              </span>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span className="flex items-center gap-1 font-medium text-indigo-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    {featuredPost.category}
                  </span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                  {featuredPost.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    width={32}
                    height={32}
                    loading="lazy"
                    className="w-8 h-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, DEFAULT_AUTHOR_AVATAR)}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{featuredPost.author.name}</p>
                    <p className="text-[10px] text-slate-500">{featuredPost.author.role}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-indigo-600 group-hover:underline inline-flex items-center gap-1">
                  <span>Read Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {selectedCategory === "All" ? "All Articles & Tutorials" : `${selectedCategory} Articles`}
            </h2>
            <span className="text-xs text-slate-500">
              Showing {filteredPosts.length} {selectedCategory === "All" ? "articles" : selectedCategory.toLowerCase()}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No matching articles found</p>
              <p className="text-xs text-slate-500">Try adjusting your search terms or category filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setCurrentPageNum(1);
                }}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition duration-200 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        width={600}
                        height={375}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                      />
                      <span className={`absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border backdrop-blur-md shadow-xs ${getCategoryBadgeClass(post.category)}`}>
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center gap-3 text-slate-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={24}
                        height={24}
                        loading="lazy"
                        className="w-6 h-6 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, DEFAULT_AUTHOR_AVATAR)}
                      />
                      <span className="text-xs text-slate-700 font-medium">
                        {post.author.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-indigo-600 group-hover:underline inline-flex items-center gap-1">
                      <span>{getReadActionLabel(post.category)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
                disabled={currentPageNum === 1}
                className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPageNum(num)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition ${
                    currentPageNum === num
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPageNum(Math.min(totalPages, currentPageNum + 1))}
                disabled={currentPageNum === totalPages}
                className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Newsletter Box */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-lg text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              Bi-Weekly Newsletter
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Get Document Productivity Tips Straight to Your Inbox
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              No spam. Just updates on PDF compression, offline reading setups, and system engine improvements.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              value={subscribedEmail}
              onChange={(e) => setSubscribedEmail(e.target.value)}
              placeholder="Enter your work or school email..."
              className="px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 w-full sm:w-72"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer shrink-0"
            >
              Subscribe Free
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
