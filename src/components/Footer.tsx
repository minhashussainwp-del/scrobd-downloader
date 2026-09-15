import React from "react";
import { FileDown } from "lucide-react";
import { PageRoute, SiteSettings, SupportedLanguage, CustomPage } from "../types";

interface FooterProps {
  onNavigate: (page: PageRoute, customPage?: CustomPage | null) => void;
  onCtaClick?: () => void;
  siteSettings?: SiteSettings;
  currentLang?: SupportedLanguage;
  customPages?: CustomPage[];
}

export function Footer({ onNavigate, siteSettings }: FooterProps) {
  return (
    <footer className="bg-[#1e293b] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onNavigate("home")}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileDown className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight leading-tight drop-shadow-sm">
                  {siteSettings?.siteName || "Scribd Downloader"}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">
                  Download Documents Easily
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed pr-4 pt-2">
              A free high-speed online utility for reading, converting, and downloading educational
              Scribd documents and slide decks offline with zero data retention.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", route: "home" as PageRoute },
                { label: "How It Works", route: "how-it-works" as PageRoute },
                { label: "Blog & Tutorials", route: "blog" as PageRoute },
                { label: "About Our Mission", route: "about" as PageRoute },
                { label: "Contact Support", route: "contact" as PageRoute },
              ].map((link) => (
                <li key={link.route}>
                  <button
                    onClick={() => onNavigate(link.route)}
                    className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Admin Access */}
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter &amp; Updates</h4>
            <p className="text-sm text-slate-400 font-medium mb-4">
              Get notified of new document converters and offline features.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} {siteSettings?.siteName || "Scribd Downloader"}. Free Educational Utility.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate("privacy")} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate("terms")} className="hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
