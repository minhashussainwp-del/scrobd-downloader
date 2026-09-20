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
            <a
              href="/"
              className="flex items-center gap-2.5 cursor-pointer group no-underline select-none"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("home");
              }}
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden bg-slate-800 group-hover:shadow-[0_8px_16px_-6px_rgba(99,102,241,0.4)] transition-all duration-300">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                 <FileDown className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-black tracking-tight text-white">
                  Scribd <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Downloader</span>
                </span>
              </div>
            </a>
            <p className="text-sm text-slate-300 font-medium leading-relaxed pr-4 pt-2">
              A free high-speed online utility for reading, converting, and downloading educational
              Scribd documents and slide decks offline with zero data retention.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-base">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", route: "home" as PageRoute, href: "/" },
                { label: "How It Works", route: "how-it-works" as PageRoute, href: "/how-it-works" },
                { label: "Blog & Tutorials", route: "blog" as PageRoute, href: "/blog" },
                { label: "About Our Mission", route: "about" as PageRoute, href: "/about" },
                { label: "Contact Support", route: "contact" as PageRoute, href: "/contact" },
                { label: "XML Sitemap", route: "sitemap" as PageRoute, href: "/sitemap.xml" },
                { label: "Robots.txt", route: "robots" as PageRoute, href: "/robots.txt" },
              ].map((link) => (
                <li key={link.route}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.route);
                    }}
                    className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Admin Access */}
          <div>
            <h3 className="text-white font-bold mb-4 text-base">Newsletter &amp; Updates</h3>
            <p className="text-sm text-slate-300 font-medium mb-4">
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
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} {siteSettings?.siteName || "Scribd Downloader"}. Free Educational Utility.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("privacy");
              }}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("terms");
              }}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </a>
            <span>•</span>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("admin");
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              CMS Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
