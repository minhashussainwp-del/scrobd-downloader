import React from "react";
import { ArrowRight, Clock, Calendar, BookOpen } from "lucide-react";
import { BlogPost, PageRoute } from "../types";
import { handleImageError, DEFAULT_AUTHOR_AVATAR } from "../utils/imageFallback";

interface BlogPreviewSectionProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onViewAllBlog: () => void;
}

export function BlogPreviewSection({
  posts,
  onSelectPost,
  onViewAllBlog,
}: BlogPreviewSectionProps) {
  // Take first 3 posts for the homepage preview
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/60" id="blog-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14 gap-4">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Guides & Tutorials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Insights from the Document Lab
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              In-depth tutorials, tips on offline study systems, and best practices for converting digital slide decks.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllBlog}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition group self-start sm:self-auto cursor-pointer"
          >
            <span>View All Guides</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition duration-200 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    width={640}
                    height={400}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-indigo-700 shadow-xs">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
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

              {/* Card Footer */}
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
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
