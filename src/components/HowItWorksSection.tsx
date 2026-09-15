import React from "react";
import { Link2, Sparkles, Download, ArrowRight, Check } from "lucide-react";

interface HowItWorksSectionProps {
  onTryNow: () => void;
}

export function HowItWorksSection({ onTryNow }: HowItWorksSectionProps) {
  const steps = [
    {
      number: "01",
      title: "Paste Scribd Document Link",
      description:
        "Copy the web address of any public Scribd document, report, or slide deck and paste it into the downloader input field.",
      icon: Link2,
      accent: "from-blue-600 to-indigo-600",
      pill: "Auto-detects format",
    },
    {
      number: "02",
      title: "Fetch & Preview Pages",
      description:
        "Our engine processes the document data, loads high-resolution vector pages, and compiles an interactive page thumbnail preview.",
      icon: Sparkles,
      accent: "from-indigo-600 to-purple-600",
      pill: "High DPI rendering",
    },
    {
      number: "03",
      title: "Instant Lossless PDF Download",
      description:
        "Receive your compiled standard high-resolution PDF document with instant direct streaming and no waiting delay.",
      icon: Download,
      accent: "from-purple-600 to-pink-600",
      pill: "Strictly PDF only",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/60" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            No technical skills or complicated software installations needed. Turn any web presentation into a portable PDF in under 10 seconds.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200 font-mono tracking-tighter">
                      {step.number}
                    </span>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.accent} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-2 inline-block">
                    {step.pill}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Step {idx + 1} of 3</span>
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onTryNow}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition shadow-md active:scale-95 cursor-pointer"
          >
            <span>Try It Now on Hero Downloader</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
