import React from "react";
import {
  Zap,
  ClipboardCheck,
  Eye,
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50 text-blue-600 border-blue-100",
      title: "Fast PDF Processing",
      description: "Our high-speed conversion engine processes complex multi-page slide decks and whitepapers in seconds without artificial wait times.",
    },
    {
      icon: ClipboardCheck,
      color: "from-indigo-500 to-purple-600",
      bgLight: "bg-indigo-50 text-indigo-600 border-indigo-100",
      title: "Easy Clipboard Paste",
      description: "One-click clipboard detection pastes your Scribd document link instantly, auto-sanitizing tracking parameters and redirects.",
    },
    {
      icon: Eye,
      color: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50 text-purple-600 border-purple-100",
      title: "Full PDF & Page Preview",
      description: "Inspect high-resolution page thumbnails and table of contents before committing to a full download, saving time and cellular data.",
    },
    {
      icon: Download,
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50 text-emerald-600 border-emerald-100",
      title: "Direct One-Click Download",
      description: "Download pure vector PDF files with universal compatibility across Kindle, iPad, and PC without waiting lag.",
    },
    {
      icon: Smartphone,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 text-amber-600 border-amber-100",
      title: "100% Mobile Friendly",
      description: "Optimized touch targets, clean fluid layouts, and lightweight memory footprint designed specifically for phones and tablets.",
    },
    {
      icon: ShieldCheck,
      color: "from-slate-700 to-slate-900",
      bgLight: "bg-slate-100 text-slate-700 border-slate-200",
      title: "Private & Secure Processing",
      description: "No account registration or personal details required. All compiled temporary files are permanently purged within 2 hours.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/60" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Engine Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Crisp, Effortless Document Extraction
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Everything you need to convert research papers, book chapters, and slide decks into permanent offline reading formats.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition duration-200 group relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs transition group-hover:scale-110 ${item.bgLight}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-slate-500 group-hover:text-indigo-600 transition">
                  <span>Included Free</span>
                  <CheckCircle className="w-3.5 h-3.5 ml-1.5 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
