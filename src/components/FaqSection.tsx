import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the Scribd Downloader work?",
      a: "Our system connects to the public Scribd document manifest using ultra-fast extraction technology. It systematically extracts each vector page tile or high-resolution slide render, normalizes the dimensions, and compiles them into a clean, unified standard PDF document with direct high-speed streaming.",
    },
    {
      q: "Can I preview the document before downloading it?",
      a: "Yes! Once you enter a link and click 'Fetch PDF', our live previewer displays interactive page thumbnails and resolution details. You can inspect individual slides, check completeness, and verify formatting before initiating your full file download.",
    },
    {
      q: "Does it work seamlessly on mobile phones and tablets?",
      a: "Absolutely. The interface is engineered with a mobile-first responsive architecture. On iOS (Safari) and Android (Chrome), you can easily paste links, preview pages, and save PDFs directly to your device's Files app or Google Drive.",
    },
    {
      q: "Is account registration or a payment card required?",
      a: "No registration, email signup, or credit card is ever required. Scribd Downloader is 100% free and open for public educational research, academic document backup, and offline study purposes.",
    },
    {
      q: "What file format is supported?",
      a: "We strictly support Merged PDF (.pdf) format. Documents are processed at their maximum native resolution and compiled directly into high-fidelity PDFs without placeholder samples or artificial delays.",
    },
    {
      q: "Is downloading documents legal for personal study?",
      a: "Downloading public domain, creative commons, or open educational resources for personal non-commercial study and archiving falls within standard fair-use guidelines. Users remain responsible for respecting copyright terms and creator licensing.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-200/60" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Common Questions & Answers
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to know about document extraction, file formats, and privacy guarantees.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden transition"
              >
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-indigo-600 transition"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className={`w-4 h-4 shrink-0 ${isOpen ? "text-indigo-600" : "text-slate-400"}`} />
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security reassurance banner */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs border border-indigo-100 shrink-0">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Zero Retention & Absolute Privacy</p>
              <p className="text-[11px] text-slate-600">Your documents are never stored permanently or cataloged in public indices.</p>
            </div>
          </div>
          <a
            href="#downloader-section"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs shrink-0"
          >
            Start Downloading
          </a>
        </div>
      </div>
    </section>
  );
}
