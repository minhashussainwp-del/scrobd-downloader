import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { SupportedLanguage } from "../types";
import { SUPPORTED_LANGUAGES, t, detectBrowserLanguage } from "../data/translations";

export function CountryFlag({
  code,
  className = "w-4.5 h-3",
}: {
  code: string;
  className?: string;
}) {
  const norm = code.toLowerCase();

  if (norm === "en" || norm === "us") {
    return (
      <svg
        className={`${className} rounded-xs shrink-0 shadow-2xs border border-slate-200/60 object-cover inline-block`}
        viewBox="0 0 640 480"
        aria-hidden="true"
      >
        <g fillRule="evenodd">
          <path fill="#bd3d44" d="M0 0h640v480H0z" />
          <path
            stroke="#fff"
            strokeWidth="37"
            d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"
          />
          <path fill="#192f5d" d="M0 0h288v258.5H0z" />
          <g fill="#fff">
            <circle cx="36" cy="30" r="10" />
            <circle cx="96" cy="30" r="10" />
            <circle cx="156" cy="30" r="10" />
            <circle cx="216" cy="30" r="10" />
            <circle cx="66" cy="65" r="10" />
            <circle cx="126" cy="65" r="10" />
            <circle cx="186" cy="65" r="10" />
            <circle cx="246" cy="65" r="10" />
            <circle cx="36" cy="100" r="10" />
            <circle cx="96" cy="100" r="10" />
            <circle cx="156" cy="100" r="10" />
            <circle cx="216" cy="100" r="10" />
            <circle cx="66" cy="135" r="10" />
            <circle cx="126" cy="135" r="10" />
            <circle cx="186" cy="135" r="10" />
            <circle cx="246" cy="135" r="10" />
            <circle cx="36" cy="170" r="10" />
            <circle cx="96" cy="170" r="10" />
            <circle cx="156" cy="170" r="10" />
            <circle cx="216" cy="170" r="10" />
            <circle cx="66" cy="205" r="10" />
            <circle cx="126" cy="205" r="10" />
            <circle cx="186" cy="205" r="10" />
            <circle cx="246" cy="205" r="10" />
          </g>
        </g>
      </svg>
    );
  }

  if (norm === "es") {
    return (
      <svg
        className={`${className} rounded-xs shrink-0 shadow-2xs border border-slate-200/60 object-cover inline-block`}
        viewBox="0 0 640 480"
        aria-hidden="true"
      >
        <path fill="#c60b1e" d="M0 0h640v480H0z" />
        <path fill="#ffc400" d="M0 120h640v240H0z" />
        <circle cx="180" cy="240" r="36" fill="#c60b1e" opacity="0.85" />
      </svg>
    );
  }

  if (norm === "br" || norm === "pt") {
    return (
      <svg
        className={`${className} rounded-xs shrink-0 shadow-2xs border border-slate-200/60 object-cover inline-block`}
        viewBox="0 0 640 480"
        aria-hidden="true"
      >
        <path fill="#009c3b" d="M0 0h640v480H0z" />
        <path fill="#ffdf00" d="M320 60l260 180-260 180L60 240z" />
        <circle cx="320" cy="240" r="85" fill="#002776" />
        <path fill="#fff" d="M236 240a85 85 0 0 1 168 0h-168z" opacity="0.9" />
      </svg>
    );
  }

  if (norm === "fr") {
    return (
      <svg
        className={`${className} rounded-xs shrink-0 shadow-2xs border border-slate-200/60 object-cover inline-block`}
        viewBox="0 0 640 480"
        aria-hidden="true"
      >
        <path fill="#002654" d="M0 0h213.3v480H0z" />
        <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
        <path fill="#ce1126" d="M426.7 0H640v480H426.7z" />
      </svg>
    );
  }

  if (norm === "de") {
    return (
      <svg
        className={`${className} rounded-xs shrink-0 shadow-2xs border border-slate-200/60 object-cover inline-block`}
        viewBox="0 0 640 480"
        aria-hidden="true"
      >
        <path fill="#000" d="M0 0h640v160H0z" />
        <path fill="#dd0000" d="M0 160h640v160H0z" />
        <path fill="#ffce00" d="M0 320h640v160H0z" />
      </svg>
    );
  }

  if (norm === "id") {
    return (
      <svg
        className={`${className} rounded-xs shrink-0 shadow-2xs border border-slate-200/60 object-cover inline-block`}
        viewBox="0 0 640 480"
        aria-hidden="true"
      >
        <path fill="#e70011" d="M0 0h640v240H0z" />
        <path fill="#fff" d="M0 240h640v240H0z" />
      </svg>
    );
  }

  return <span className="text-xs">🌐</span>;
}

interface LanguageSwitcherProps {
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  showSuggestionBanner?: boolean;
}

export function LanguageSwitcher({
  currentLang,
  onSelectLang,
  showSuggestionBanner = true,
}: LanguageSwitcherProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<SupportedLanguage | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect browser language and show country/language suggestion if different
  useEffect(() => {
    if (!showSuggestionBanner) return;
    const dismissed = sessionStorage.getItem("scribd_lang_suggestion_dismissed");
    if (dismissed) return;

    const detected = detectBrowserLanguage();
    if (detected !== "en" && detected !== currentLang) {
      setSuggestion(detected);
    }
  }, [currentLang, showSuggestionBanner]);

  const currentOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const handleDismissSuggestion = () => {
    setSuggestion(null);
    sessionStorage.setItem("scribd_lang_suggestion_dismissed", "true");
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      onSelectLang(suggestion);
      setSuggestion(null);
      sessionStorage.setItem("scribd_lang_suggestion_dismissed", "true");
    }
  };

  const suggestedOption = SUPPORTED_LANGUAGES.find((l) => l.code === suggestion);

  return (
    <>
      {/* Country / Language Suggestion Banner (Item 41) */}
      {suggestion && suggestedOption && (
        <div
          id="lang-suggestion-banner"
          className="bg-indigo-900 text-white text-xs py-2 px-4 sticky top-0 z-50 flex items-center justify-between border-b border-indigo-800 shadow-md animate-in slide-in-from-top duration-300"
        >
          <div className="flex items-center gap-2 max-w-2xl mx-auto flex-1">
            <CountryFlag code={suggestedOption.code} className="w-5 h-3.5" />
            <p className="text-xs">
              <span>{t("lang.detectBanner", currentLang)} </span>
              <strong>
                {suggestedOption.nativeName} ({suggestedOption.name})
              </strong>
              ?
            </p>
            <div className="flex items-center gap-1.5 ml-2">
              <button
                type="button"
                id="accept-lang-suggestion-btn"
                onClick={handleAcceptSuggestion}
                className="px-2.5 py-1 bg-white text-indigo-900 font-bold rounded text-[11px] hover:bg-indigo-50 transition cursor-pointer"
              >
                {t("lang.switchBtn", currentLang)} {suggestedOption.nativeName}
              </button>
              <button
                type="button"
                id="dismiss-lang-suggestion-btn"
                onClick={handleDismissSuggestion}
                className="p-1 hover:text-indigo-200 transition cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Selector */}
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          id="language-switcher-dropdown-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <CountryFlag code={currentOption.code} className="w-4.5 h-3" />
          <span className="hidden sm:inline font-medium">{currentOption.nativeName}</span>
          <span className="sm:hidden uppercase font-bold text-[11px]">{currentOption.code}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div
            id="language-switcher-menu"
            className="origin-top-right absolute right-0 mt-1.5 w-56 rounded-2xl shadow-xl bg-white ring-1 ring-black/5 divide-y divide-slate-100 z-50 focus:outline-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-3.5 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Select Language
            </div>
            <div className="py-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    id={`lang-option-${lang.code}`}
                    onClick={() => {
                      onSelectLang(lang.code);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CountryFlag code={lang.code} className="w-5 h-3.5" />
                      <div>
                        <span className="block font-medium">{lang.nativeName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {lang.name}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
