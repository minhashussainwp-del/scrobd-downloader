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
import { getUniquePublishedPosts } from "../data/blogData";

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

  // Dynamic FAQs based on current language or admin-configured FAQs
  const faqs = (pageContent?.faqs && pageContent.faqs.length > 0)
    ? pageContent.faqs.map((f: any) => ({ q: f.question || f.q, a: f.answer || f.a }))
    : [
        { q: t("faq.q1", currentLang), a: t("faq.a1", currentLang) },
        { q: t("faq.q2", currentLang), a: t("faq.a2", currentLang) },
        { q: t("faq.q3", currentLang), a: t("faq.a3", currentLang) },
        { q: t("faq.q4", currentLang), a: t("faq.a4", currentLang) },
        { q: t("faq.q5", currentLang), a: t("faq.a5", currentLang) },
        { q: t("faq.q6", currentLang), a: t("faq.a6", currentLang) },
        { q: t("faq.q7", currentLang), a: t("faq.a7", currentLang) },
        { q: t("faq.q8", currentLang), a: t("faq.a8", currentLang) },
      ];

  // Dynamic article content published via Homepage Admin CMS
  const rawArticle = (pageContent?.htmlContent || pageContent?.content || "").trim();
  const hasArticle = rawArticle.length > 0;

  // Get all unique published posts matching current language per translation group where available
  const displayPosts = getUniquePublishedPosts(posts, currentLang);

  const howTitle = pageContent?.howTitle || t("how.title", currentLang);
  const howStep1 = pageContent?.howStep1 || t("how.step1", currentLang);
  const howStep1Desc = pageContent?.howStep1Desc || t("how.step1Desc", currentLang);
  const howStep2 = pageContent?.howStep2 || t("how.step2", currentLang);
  const howStep2Desc = pageContent?.howStep2Desc || t("how.step2Desc", currentLang);
  const howStep3 = pageContent?.howStep3 || t("how.step3", currentLang);
  const howStep3Desc = pageContent?.howStep3Desc || t("how.step3Desc", currentLang);

  const benefitsTitle = pageContent?.benefitsTitle || t("benefits.title", currentLang);
  const benefitsFastTitle = pageContent?.benefitsFastTitle || t("benefits.fastTitle", currentLang);
  const benefitsFastDesc = pageContent?.benefitsFastDesc || t("benefits.fastDesc", currentLang);
  const benefitsSafeTitle = pageContent?.benefitsSafeTitle || t("benefits.safeTitle", currentLang);
  const benefitsSafeDesc = pageContent?.benefitsSafeDesc || t("benefits.safeDesc", currentLang);
  const benefitsDevicesTitle = pageContent?.benefitsDevicesTitle || t("benefits.devicesTitle", currentLang);
  const benefitsDevicesDesc = pageContent?.benefitsDevicesDesc || t("benefits.devicesDesc", currentLang);
  const benefitsFreeTitle = pageContent?.benefitsFreeTitle || t("benefits.freeTitle", currentLang);
  const benefitsFreeDesc = pageContent?.benefitsFreeDesc || t("benefits.freeDesc", currentLang);

  return (
    <div className="w-full">
      {/* How It Works Section */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">
            {howTitle}
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
                {howStep1}
              </h3>
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
                {howStep1Desc}
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
                {howStep2}
              </h3>
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
                {howStep2Desc}
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
                {howStep3}
              </h3>
              <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
                {howStep3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-[#f8fafc] py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-900 mb-12">
            {benefitsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {benefitsFastTitle}
              </h3>
              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {benefitsFastDesc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {benefitsSafeTitle}
              </h3>
              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {benefitsSafeDesc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {benefitsDevicesTitle}
              </h3>
              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {benefitsDevicesDesc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {benefitsFreeTitle}
              </h3>
              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {benefitsFreeDesc}
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
              {/* Only show article section when an article has actually been published from Admin Panel */}
              {hasArticle && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    {pageContent?.guideBadge && (
                      <div>
                        <span className="inline-flex px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-md">
                          {pageContent.guideBadge}
                        </span>
                      </div>
                    )}
                    {(pageContent?.guideTitle || pageContent?.title) && (
                      <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
                        {pageContent.guideTitle || pageContent.title}
                      </h1>
                    )}
                  </div>

                  {/* Guide Content Display */}
                  <div className="article-body">
                    <React.Suspense fallback={<div className="animate-pulse h-32 bg-slate-50 rounded-xl" />}>
                      <ModernArticleRenderer content={rawArticle} />
                    </React.Suspense>
                  </div>
                </div>
              )}

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
