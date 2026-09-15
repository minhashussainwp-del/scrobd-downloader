import React, { useState } from "react";
import {
  FileDown,
  Menu,
  X,
  LayoutTemplate,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
  Lock,
  Mail
} from "lucide-react";
import { PageRoute, ViewportMode, SupportedLanguage, CustomPage } from "../types";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { t } from "../data/translations";

interface NavigationProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  viewportMode: ViewportMode;
  onSetViewportMode: (mode: ViewportMode) => void;
  onCtaClick: () => void;
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  customPages?: CustomPage[];
  onSelectCustomPage?: (page: CustomPage) => void;
}

export function Navigation({
  currentPage,
  onNavigate,
  viewportMode,
  onSetViewportMode,
  onCtaClick,
  currentLang,
  onSelectLang,
  customPages = [],
  onSelectCustomPage,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageRoute; key: string }[] = [
    { label: "Home", page: "home", key: "nav.home" },
    { label: "How It Works", page: "how-it-works", key: "nav.howItWorks" },
    { label: "Blog", page: "blog", key: "nav.blog" },
    { label: "About", page: "about", key: "nav.about" },
  ];

  // Filter custom pages configured to show in header
  const headerCustomPages = customPages.filter(
    (p) => p.status === "published" && p.showInHeader
  );

  const handleLinkClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCustomPageClick = (page: CustomPage) => {
    if (onSelectCustomPage) {
      onSelectCustomPage(page);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Main Website Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            id="brand-logo"
            onClick={(e) => { e.preventDefault(); handleLinkClick("home"); }}
            href="#"
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-purple flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M9 13h6m-6 4h4" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">Scribd PDF</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 mt-0.5">Downloader</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-slate-600">
            {navLinks.map((item) => (
              <a
                key={item.page}
                href={`#${item.page}`}
                onClick={(e) => { e.preventDefault(); handleLinkClick(item.page); }}
                className={currentPage === item.page ? "text-brand-600 font-bold transition" : "hover:text-slate-900 transition"}
              >
                {t(item.key, currentLang)}
              </a>
            ))}

            {headerCustomPages.map((cp) => (
              <a
                key={cp.id}
                href={`#${cp.slug}`}
                onClick={(e) => { e.preventDefault(); handleCustomPageClick(cp); }}
                className="hover:text-brand-600 transition"
              >
                {cp.title}
              </a>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <LanguageSwitcher currentLang={currentLang} onSelectLang={onSelectLang} />

            {/* Contact Us Action Button */}
            <button
              type="button"
              id="header-contact-us-btn"
              onClick={() => handleLinkClick("contact")}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition duration-200 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-brand-400" />
              <span>Contact Us</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((item) => {
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  id={`mobile-nav-link-${item.page}`}
                  onClick={() => handleLinkClick(item.page)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    active
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{t(item.key, currentLang)}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}

            {headerCustomPages.map((cp) => (
              <button
                key={cp.id}
                type="button"
                onClick={() => handleCustomPageClick(cp)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>{cp.title}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                id="mobile-contact-us-btn"
                onClick={() => handleLinkClick("contact")}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm flex items-center justify-center gap-2 transition hover:bg-slate-800"
              >
                <Mail className="w-4 h-4 text-brand-400" />
                <span>Contact Us</span>
              </button>
              <button
                type="button"
                id="mobile-menu-cta"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onCtaClick();
                }}
                className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                <span>{t("nav.downloadPdf", currentLang)}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
