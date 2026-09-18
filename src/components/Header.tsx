import React from "react";
import { FileDown, Coffee, Menu, X } from "lucide-react";
import { PageRoute, SupportedLanguage } from "../types";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { t } from "../data/translations";

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  currentLang?: SupportedLanguage;
  onSelectLang?: (lang: SupportedLanguage) => void;
}

export function Header({ currentPage, onNavigate, currentLang = "en", onSelectLang }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { label: string; route: PageRoute }[] = [
    { label: "Home", route: "home" },
    { label: "Blog", route: "blog" },
    { label: "About", route: "about" },
    { label: "Contact", route: "contact" },
  ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a 
          id="brand-logo"
          href="/"
          className="flex items-center gap-2.5 cursor-pointer group no-underline select-none"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden bg-slate-900 group-hover:shadow-[0_8px_16px_-6px_rgba(99,102,241,0.4)] transition-all duration-300">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
             <FileDown className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Scribd <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">Downloader</span>
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.route}
              href={link.route === "home" ? "/" : `/${link.route}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.route);
              }}
              className={`text-sm font-semibold transition-colors ${
                currentPage === link.route ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {onSelectLang && (
            <LanguageSwitcher currentLang={currentLang} onSelectLang={onSelectLang} />
          )}
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4361ee] hover:bg-[#3250d4] text-white text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <Coffee className="w-4 h-4" />
            Buy Me a Coffee
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {onSelectLang && (
             <LanguageSwitcher currentLang={currentLang} onSelectLang={onSelectLang} />
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-4 shadow-lg absolute w-full left-0">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.route}
                href={link.route === "home" ? "/" : `/${link.route}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-xl text-sm font-bold ${
                  currentPage === link.route ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2">
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#4361ee] text-white text-sm font-bold shadow-sm"
            >
              <Coffee className="w-4 h-4" />
              Buy Me a Coffee
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
