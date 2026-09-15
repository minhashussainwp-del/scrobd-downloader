import React, { useState, useEffect } from "react";
import { Shield, FileText, Scale, Lock, CheckCircle2 } from "lucide-react";
import { PageRoute, SupportedLanguage } from "../types";
import { loadPageContent } from "../data/siteConfig";

interface LegalPageProps {
  initialTab?: "privacy" | "terms";
  onNavigate: (page: PageRoute) => void;
  currentLang?: SupportedLanguage;
}

export function LegalPage({ initialTab = "privacy", onNavigate, currentLang = "en" }: LegalPageProps) {
  const [pageData, setPageData] = useState<any>(null);
  useEffect(() => {
    const contents = loadPageContent();
    const match =
      contents.find((c) => c.pageKey === "legal" && c.language === currentLang) ||
      contents.find((c) => c.id === `legal-${currentLang}`) ||
      contents.find((c) => c.id === "legal");
    if (match) setPageData(match);
  }, [currentLang]);
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">(initialTab);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="hover:text-indigo-600 transition"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">
            {activeTab === "privacy" ? "Privacy Policy" : "Terms of Service & Fair Use"}
          </span>
        </div>

        {/* Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Legal, Privacy & Compliance Guidelines
          </h1>
          <p className="text-sm text-slate-600">
            Last Updated: September 14, 2026 • Designed for transparency and ethical offline study.
          </p>
        </div>

        {/* Layout: Sidebar + Document */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Legal Navigation */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-slate-200 space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition ${
                activeTab === "privacy"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Privacy Policy</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("terms")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition ${
                activeTab === "terms"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Scale className="w-4 h-4 text-purple-600" />
              <span>Terms of Service & DMCA</span>
            </button>
          </div>

          {/* Right / Document Text */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-xs prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-600 space-y-6">
            
            {activeTab === "privacy" ? (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 m-0">
                    Privacy Policy & Ephemeral Data Processing
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    How Scribd Downloader guarantees user privacy and data hygiene.
                  </p>
                </div>
                {pageData?.content && (
                  <div className="mb-6 pb-6 border-b border-slate-100 whitespace-pre-wrap">{pageData.content}</div>
                )}

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">1. Zero User Registration</h3>
                  <p>
                    We do not require users to create an account, log in, or submit any personally identifiable information (PII). We do not collect names, passwords, credit card numbers, or physical addresses.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">2. Ephemeral Document Retention</h3>
                  <p>
                    When a Scribd URL is submitted for conversion, our system fetches page tiles into temporary server memory strictly for the purpose of generating the requested PDF or ZIP file. All temporary files are permanently purged from server disks within 2 hours of generation.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">3. Analytics & Cookies</h3>
                  <p>
                    We do not use third-party behavioral tracking cookies, canvas fingerprinting, or ad-retargeting pixels. Client-side preferences (such as demo mode toggles or history lists) are stored exclusively in your local browser storage.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">4. Encryption in Transit</h3>
                  <p>
                    All communication between your browser and our scraping endpoints is protected using industry-standard TLS 1.3 encryption (HTTPS), safeguarding URL parameters from intermediary interception.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 m-0">
                    Terms of Service, Fair Use & DMCA Notice
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Acceptable use guidelines for our document conversion utility.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">1. Educational & Fair Use Purpose</h3>
                  <p>
                    Scribd Downloader is provided solely for educational study, non-commercial academic research, personal archiving, and offline access to public materials. You agree not to distribute, resell, or publicly republish copyrighted works acquired through this utility.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">2. User Responsibility</h3>
                  <p>
                    The end user assumes sole responsibility for ensuring that downloading any document complies with local laws, publisher licensing, and terms set forth by copyright holders.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">3. DMCA & Takedown Policy</h3>
                  <p>
                    We respect intellectual property rights. Copyright holders may submit a notice to request the exclusion of specific document URLs or author IDs from our system engine. To submit a notice, use our Contact page or email dmca@scribddownloader.io.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">4. Disclaimer of Warranty</h3>
                  <p>
                    This service is provided "as is" without warranty of any kind. We do not guarantee uninterrupted uptime or that every Scribd document format can be extracted.
                  </p>
                </div>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
