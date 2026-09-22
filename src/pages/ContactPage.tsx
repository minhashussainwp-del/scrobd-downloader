import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Clock, Send, CheckCircle2, AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { PageRoute, ContactMessage, SupportedLanguage } from "../types";
import { loadContactMessages, saveContactMessages, loadPageContent } from "../data/siteConfig";

interface ContactPageProps {
  onNavigate: (page: PageRoute) => void;
  currentLang?: SupportedLanguage;
}

export function ContactPage({ onNavigate, currentLang = "en" }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Document Download Issue",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const contents = loadPageContent();
    const match =
      contents.find((c) => c.pageKey === "contact" && c.language === currentLang) ||
      contents.find((c) => c.id === `contact-${currentLang}`) ||
      contents.find((c) => c.id === "contact");
    if (match) setPageData(match);
  }, [currentLang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newMessage: ContactMessage = {
      id: "msg-" + Date.now(),
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      date: new Date().toLocaleDateString(),
      isRead: false
    };
    
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });
    } catch (err) {
      console.error("Server contact submission error:", err);
    }

    const existing = loadContactMessages();
    saveContactMessages([...existing, newMessage]);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "Document Download Issue",
        message: "",
      });
    }, 400);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
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
          <span className="text-slate-900 font-semibold">Contact & Support</span>
        </div>

        {/* Page Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Developer & User Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {pageData?.title || "Get in Touch with Our Document Lab"}
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            {pageData?.subtitle || pageData?.content || "Experiencing trouble parsing a specific Scribd URL, or interested in API integration? Send us a message below."}
          </p>
        </div>

        {/* Main Content Grid: Form + Support Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left / Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="p-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out. Our engineering team reviews reported links and inquiries within 24 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Send an Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 text-xs sm:text-sm outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 text-xs sm:text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Topic / Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 text-xs sm:text-sm outline-none bg-white transition"
                  >
                    <option value="Document Extraction Issue">Broken / Unparsable Scribd Link</option>
                    <option value="PDF Image Quality">PDF Resolution / Image Quality Feedback</option>
                    <option value="API Scraping Access">Bulk API Scraping & Developer Access</option>
                    <option value="DMCA or Fair Use Notice">DMCA Notice or Content Takedown</option>
                    <option value="General Question">General Question or Suggestion</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Detailed Message or Problem Link
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Include the full Scribd URL and describe what happened during conversion..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 text-xs sm:text-sm outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Sending Message..." : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right / Information & Direct Support Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Direct Email Support</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                For urgent inquiries or high-volume institution licensing, write directly to:
              </p>
              <p className="text-xs font-mono font-bold text-indigo-600">
                support@scribddownloader.io
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Support Hours & SLA</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our support team is active Monday through Friday, 9:00 AM – 6:00 PM UTC. Average response time is under 12 hours.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">DMCA & Copyright Inquiries</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We respect creator rights. To request the blacklisting of specific copyright-protected materials from this converter, select "DMCA Notice" in the contact form.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
