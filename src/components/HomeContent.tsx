import React, { useState } from "react";
import {
  Link,
  ClipboardPaste,
  Download,
  Zap,
  ShieldCheck,
  Monitor,
  CreditCard,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { BlogPost, PageRoute, SupportedLanguage, PageContent } from "../types";
import { t } from "../data/translations";
import { ModernArticleSidebar } from "./ModernArticleSidebar";

const ModernArticleRenderer = React.lazy(() =>
  import("./ModernArticleRenderer").then((m) => ({ default: m.ModernArticleRenderer }))
);

interface HomeContentProps {
  onNavigate: (page: PageRoute) => void;
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  currentLang?: SupportedLanguage;
  pageContent?: PageContent;
}

export function HomeContent({
  onNavigate,
  posts,
  onSelectPost,
  currentLang = "en",
  pageContent,
}: HomeContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Dynamic FAQs based on current language
  const faqs = [
    { q: t("faq.q1", currentLang), a: t("faq.a1", currentLang) },
    { q: t("faq.q2", currentLang), a: t("faq.a2", currentLang) },
    { q: t("faq.q3", currentLang), a: t("faq.a3", currentLang) },
    { q: t("faq.q4", currentLang), a: t("faq.a4", currentLang) },
    { q: t("faq.q5", currentLang), a: t("faq.a5", currentLang) },
    { q: t("faq.q6", currentLang), a: t("faq.a6", currentLang) },
    { q: t("faq.q7", currentLang), a: t("faq.a7", currentLang) },
    { q: t("faq.q8", currentLang), a: t("faq.a8", currentLang) },
  ];

  // Filter posts matching current language, with fallback
  const langPosts = posts.filter(
    (p) => (p.language || "en") === currentLang && p.status !== "draft"
  );
  const displayPosts = langPosts.length > 0 ? langPosts : posts.filter((p) => p.status !== "draft");

  return (
    <div className="w-full">
      {/* How It Works Section */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">
            {t("how.title", currentLang)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px bg-slate-200 z-0" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-[#eff4ff] text-[#3b5998] rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-xs border border-[#d0ddff]">
                1
              </div>
              <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-xs">
                <Link className="w-7 h-7 text-slate-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {t("how.step1", currentLang)}
              </h3>
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
                {t("how.step1Desc", currentLang)}
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-[#eff4ff] text-[#3b5998] rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-xs border border-[#d0ddff]">
                2
              </div>
              <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-xs">
                <ClipboardPaste className="w-7 h-7 text-slate-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {t("how.step2", currentLang)}
              </h3>
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
                {t("how.step2Desc", currentLang)}
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-[#eff4ff] text-[#3b5998] rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-xs border border-[#d0ddff]">
                3
              </div>
              <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-xs">
                <Download className="w-7 h-7 text-slate-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {t("how.step3", currentLang)}
              </h3>
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
                {t("how.step3Desc", currentLang)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-[#f8fafc] py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-900 mb-12">
            {t("benefits.title", currentLang)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t("benefits.fastTitle", currentLang)}
              </h3>
              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {t("benefits.fastDesc", currentLang)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t("benefits.safeTitle", currentLang)}
              </h3>
              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {t("benefits.safeDesc", currentLang)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t("benefits.devicesTitle", currentLang)}
              </h3>
              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {t("benefits.devicesDesc", currentLang)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t("benefits.freeTitle", currentLang)}
              </h3>
              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {t("benefits.freeDesc", currentLang)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area (Two Columns) */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
            {/* Left Content Column (Main Guide / Editable Page Content) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-3">
                <div>
                  <span className="inline-flex px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-md">
                    {t("guide.badge", currentLang) || "KNOWLEDGE BASE"}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
                  {pageContent?.title || t("guide.title", currentLang)}
                </h1>
              </div>

              {/* Guide Content Display */}
              <div className="article-body">
                {pageContent?.content ? (
                  <React.Suspense fallback={<div className="animate-pulse h-32 bg-slate-50 rounded-xl" />}>
                    <ModernArticleRenderer content={pageContent.content} />
                  </React.Suspense>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed m-0">
                      {t("guide.p1", currentLang)}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 m-0 mt-8">
                      {t("guide.subheading", currentLang)}
                    </h3>
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h4 className="font-bold text-slate-900 text-base">
                          {t("guide.step1Title", currentLang)}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {t("guide.step1Desc", currentLang)}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h4 className="font-bold text-slate-900 text-base">
                          {t("guide.step2Title", currentLang)}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {t("guide.step2Desc", currentLang)}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h4 className="font-bold text-slate-900 text-base">
                          {t("guide.step3Title", currentLang)}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {t("guide.step3Desc", currentLang)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ Accordion */}
              <div className="mt-14">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                  {t("faq.title", currentLang)}
                </h2>
                <div className="border-t border-slate-200">
                  {faqs.map((faq, i) => (
                    <div key={i} className="border-b border-slate-200">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                      >
                        <span className="font-bold text-base sm:text-lg text-slate-900 pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                            openFaq === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="pb-4 text-slate-600 font-normal text-base sm:text-lg leading-relaxed pr-8">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Exactly matching screenshot */}
            <div className="lg:col-span-4">
              <ModernArticleSidebar
                currentLang={currentLang}
                onOpenDownloader={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  const input = document.getElementById("hero-url-input") as HTMLInputElement;
                  input?.focus();
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
