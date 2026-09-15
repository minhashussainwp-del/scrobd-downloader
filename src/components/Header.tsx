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
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate("home")}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileDown className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
              Scribd Downloader
            </h1>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              Download Scribd Documents Easily
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => onNavigate(link.route)}
              className={`text-sm font-semibold transition-colors ${
                currentPage === link.route ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {link.label}
            </button>
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
              <button
                key={link.route}
                onClick={() => {
                  onNavigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-xl text-sm font-bold ${
                  currentPage === link.route ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </button>
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
