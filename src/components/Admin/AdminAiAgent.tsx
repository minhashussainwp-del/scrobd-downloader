import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  Send,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  ArrowRight,
  Copy,
  Check,
  Cpu,
  Layers,
  Search,
  BookOpen,
  Trash2,
  ShieldAlert,
  Edit3
} from "lucide-react";
import { BlogPost, SupportedLanguage } from "../../types";

interface AdminAiAgentProps {
  currentLang?: SupportedLanguage;
  onPostPublished?: (post: BlogPost) => void;
  onRefreshPosts?: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

interface SeoSuggestion {
  id: string;
  targetType: "post" | "custom_page" | "robots" | "meta";
  targetId?: string;
  targetField: string;
  currentValue: string;
  suggestedValue: string;
  reason: string;
  applied?: boolean;
}

interface SeoAuditResult {
  seoScore: number;
  summary: string;
  strengths: string[];
  issues: { severity: string; type: string; description: string }[];
  duplicateAnalysis: { duplicateCount: number; hasDuplicates: boolean; details?: string };
  suggestions: SeoSuggestion[];
}

export function AdminAiAgent({ currentLang = "en", onPostPublished, onRefreshPosts }: AdminAiAgentProps) {
  const [activeSubTab, setActiveSubTab] = useState<"chat" | "writer" | "audit" | "robots" | "dedup">("chat");

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "model",
      content: `### 👋 Welcome to the Scribd Downloader AI Agent & SEO Studio!

I am your intelligent Technical CTO and SEO Assistant. Here is what I can do for you:
- **🔍 SEO & Site Diagnostics**: Ask me to analyze sitemaps, robots.txt, canonicals, or page performance.
- **✍️ Multilingual Article Writer**: Generate in-depth SEO articles in any language and **publish directly with 1 click**.
- **🛠️ 1-Click Replace**: Get AI suggestions and apply them directly to your live content or meta tags.
- **🌐 Multilingual Support**: You can chat and generate content in English, Urdu (اردو), Hindi, Spanish, French, German, Portuguese, Indonesian, and more!

How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Article Writer State
  const [articlePrompt, setArticlePrompt] = useState("");
  const [articleTopic, setArticleTopic] = useState("");
  const [articleKeyword, setArticleKeyword] = useState("Scribd document downloader");
  const [articleLanguage, setArticleLanguage] = useState<string>("en");
  const [articleWordCount, setArticleWordCount] = useState(800);
  const [writerLoading, setWriterLoading] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<any>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);

  // SEO Audit State
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<SeoAuditResult | null>(null);
  const [applyingSuggestionId, setApplyingSuggestionId] = useState<string | null>(null);

  // Robots Generator State
  const [robotsPrompt, setRobotsPrompt] = useState("Allow all major search engine crawlers, block /admin/ and /api/ paths, include Yoast sitemap index.");
  const [robotsGenerated, setRobotsGenerated] = useState("");
  const [robotsLoading, setRobotsLoading] = useState(false);
  const [robotsSaveSuccess, setRobotsSaveSuccess] = useState(false);

  // Deduplication State
  const [dedupLoading, setDedupLoading] = useState(false);
  const [dedupResult, setDedupResult] = useState<any>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Chat Submission
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = chatInput.trim();
    if (!query || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const historyPayload = chatMessages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          language: currentLang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to communicate with AI");
      }

      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.reply || "Analysis complete.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "model",
          content: `⚠️ **AI Service Notification**: ${err.message || "Failed to process request"}. Please verify your Gemini API key in Settings > Secrets.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Run SEO Audit
  const handleRunAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch("/api/ai/analyze-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlPath: "/" }),
      });
      const data = await res.json();
      if (res.ok && data.audit) {
        setAuditResult(data.audit);
      } else {
        throw new Error(data.error || "Audit failed");
      }
    } catch (err: any) {
      alert("SEO Audit Error: " + err.message);
    } finally {
      setAuditLoading(false);
    }
  };

  // Apply 1-Click Suggestion
  const handleApplySuggestion = async (suggestion: SeoSuggestion) => {
    setApplyingSuggestionId(suggestion.id);
    try {
      const res = await fetch("/api/ai/apply-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: suggestion.targetType,
          targetId: suggestion.targetId,
          targetField: suggestion.targetField,
          newValue: suggestion.suggestedValue,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (auditResult) {
          setAuditResult({
            ...auditResult,
            suggestions: auditResult.suggestions.map((s) =>
              s.id === suggestion.id ? { ...s, applied: true } : s
            ),
          });
        }
        if (onRefreshPosts) onRefreshPosts();
      } else {
        alert("Failed to apply suggestion: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error applying update: " + err.message);
    } finally {
      setApplyingSuggestionId(null);
    }
  };

  // Generate Article
  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articlePrompt && !articleTopic) return;
    setWriterLoading(true);
    setPublishSuccess(null);
    try {
      const res = await fetch("/api/ai/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: articlePrompt,
          topic: articleTopic,
          keyword: articleKeyword,
          language: articleLanguage,
          wordCount: articleWordCount,
        }),
      });
      const data = await res.json();
      if (res.ok && data.article) {
        setGeneratedArticle(data.article);
      } else {
        throw new Error(data.error || "Failed to generate article");
      }
    } catch (err: any) {
      alert("Generation error: " + err.message);
    } finally {
      setWriterLoading(false);
    }
  };

  // 1-Click Publish to Live Blog
  const handlePublishArticle = async () => {
    if (!generatedArticle) return;
    setPublishLoading(true);
    setPublishSuccess(null);
    try {
      const res = await fetch("/api/ai/publish-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: generatedArticle }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPublishSuccess(`Article "${generatedArticle.title}" published live successfully!`);
        if (onPostPublished && data.post) {
          onPostPublished(data.post);
        }
        if (onRefreshPosts) onRefreshPosts();
      } else {
        throw new Error(data.error || "Publishing failed");
      }
    } catch (err: any) {
      alert("Publish error: " + err.message);
    } finally {
      setPublishLoading(false);
    }
  };

  // Generate Robots.txt
  const handleGenerateRobots = async () => {
    setRobotsLoading(true);
    setRobotsSaveSuccess(false);
    try {
      const res = await fetch("/api/ai/generate-robots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: robotsPrompt }),
      });
      const data = await res.json();
      if (res.ok && data.content) {
        setRobotsGenerated(data.content);
      } else {
        throw new Error(data.error || "Failed to generate robots.txt");
      }
    } catch (err: any) {
      alert("Robots error: " + err.message);
    } finally {
      setRobotsLoading(false);
    }
  };

  // Save Robots.txt
  const handleSaveRobots = async () => {
    if (!robotsGenerated) return;
    try {
      const res = await fetch("/api/ai/apply-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "robots",
          targetField: "content",
          newValue: robotsGenerated,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRobotsSaveSuccess(true);
        setTimeout(() => setRobotsSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      alert("Failed to save robots.txt: " + err.message);
    }
  };

  // Deduplicate Content
  const handleDeduplicate = async () => {
    setDedupLoading(true);
    try {
      const res = await fetch("/api/ai/deduplicate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDedupResult(data);
        if (onRefreshPosts) onRefreshPosts();
      } else {
        throw new Error(data.error || "Deduplication failed");
      }
    } catch (err: any) {
      alert("Deduplication error: " + err.message);
    } finally {
      setDedupLoading(false);
    }
  };

  return (
    <div id="admin-ai-agent-container" className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">AI Agent & SEO Studio</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gemini 3.8 Flash Active
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-0.5">
                Chat assistant, prompt diagnostics, automated SEO audits, multilingual article writer with 1-click publishing & instant suggestion replacement.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveSubTab("audit");
                handleRunAudit();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition"
            >
              <Zap className="w-4 h-4" />
              Quick SEO Audit
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSubTab("chat")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "chat"
                ? "bg-white text-slate-900 shadow font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Bot className="w-4 h-4" />
            AI Chat & Diagnostics
          </button>
          <button
            onClick={() => setActiveSubTab("writer")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "writer"
                ? "bg-white text-slate-900 shadow font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <FileText className="w-4 h-4" />
            Multilingual Article Writer & 1-Click Publish
          </button>
          <button
            onClick={() => {
              setActiveSubTab("audit");
              if (!auditResult) handleRunAudit();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "audit"
                ? "bg-white text-slate-900 shadow font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Search className="w-4 h-4" />
            SEO Health Audit & 1-Click Replace
          </button>
          <button
            onClick={() => setActiveSubTab("robots")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "robots"
                ? "bg-white text-slate-900 shadow font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Layers className="w-4 h-4" />
            AI Robots.txt Generator
          </button>
          <button
            onClick={() => setActiveSubTab("dedup")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "dedup"
                ? "bg-white text-slate-900 shadow font-semibold"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Content Merge & Deduplication
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: AI CHAT & DIAGNOSTICS */}
      {activeSubTab === "chat" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {/* Chat Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Interactive AI Prompt Engineer & Technical Advisor</h2>
                <p className="text-xs text-slate-500">Ask questions in Urdu, Hindi, English, Spanish, French, German, etc.</p>
              </div>
            </div>
            <button
              onClick={() =>
                setChatMessages([
                  {
                    id: "welcome-reset",
                    role: "model",
                    content: "Chat reset. How can I assist your SEO or content strategy?",
                    timestamp: new Date().toLocaleTimeString(),
                  },
                ])
              }
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear History
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-emerald-600 text-white shadow-sm"
                  }`}
                >
                  {msg.role === "user" ? "You" : <Sparkles className="w-4 h-4" />}
                </div>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-none shadow-sm"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm prose prose-sm max-w-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`text-[10px] mt-2 flex items-center justify-between ${
                      msg.role === "user" ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.role === "model" && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="hover:text-slate-600 ml-3 flex items-center gap-1"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedId === msg.id ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3 mr-auto max-w-2xl">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-xs font-medium ml-2">AI is thinking and analyzing site context...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-6 py-2 bg-white border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap">Suggested prompts:</span>
            {[
              "Audit website sitemaps and 79 live URLs",
              "How to improve SEO CTR on Scribd downloader queries?",
              "Mujhe Urdu ma Scribd document download karne ki guide likh kar do",
              "Generate disallow rules for AI scrapers in robots.txt",
              "Explain how hreflang tags prevent duplicate penalties",
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setChatInput(p);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything or request SEO analysis (support for all languages: Urdu, Hindi, English, Spanish, etc.)..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm transition"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: MULTILINGUAL ARTICLE WRITER & 1-CLICK PUBLISH */}
      {activeSubTab === "writer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
              <FileText className="w-5 h-5 text-emerald-600" />
              Prompt-Based Article Creator
            </div>

            <form onSubmit={handleGenerateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Article Topic / Main Idea *
                </label>
                <input
                  type="text"
                  value={articleTopic}
                  onChange={(e) => setArticleTopic(e.target.value)}
                  placeholder="e.g. How to Save Scribd Presentations as PDF in 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Keyword
                </label>
                <input
                  type="text"
                  value={articleKeyword}
                  onChange={(e) => setArticleKeyword(e.target.value)}
                  placeholder="e.g. scribd presentation downloader"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Language
                  </label>
                  <select
                    value={articleLanguage}
                    onChange={(e) => setArticleLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  >
                    <option value="en">English (US/UK)</option>
                    <option value="ur">Urdu (اردو)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="br">Portuguese (BR)</option>
                    <option value="es">Spanish (Español)</option>
                    <option value="fr">French (Français)</option>
                    <option value="de">German (Deutsch)</option>
                    <option value="id">Indonesian (Bahasa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Word Count
                  </label>
                  <select
                    value={articleWordCount}
                    onChange={(e) => setArticleWordCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  >
                    <option value={500}>500 words (Quick Guide)</option>
                    <option value={800}>800 words (Standard Article)</option>
                    <option value={1200}>1,200 words (Ultimate Guide)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Prompt Instructions (Optional)
                </label>
                <textarea
                  value={articlePrompt}
                  onChange={(e) => setArticlePrompt(e.target.value)}
                  placeholder="e.g. Include step-by-step screenshots descriptions, an FAQ section, and comparison with other downloaders..."
                  rows={3}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={writerLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition"
              >
                {writerLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating with Gemini 3.8 Flash...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Full SEO Article
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preview & Publish Column */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Live Generated Article Preview
              </div>
              {generatedArticle && (
                <button
                  onClick={handlePublishArticle}
                  disabled={publishLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
                >
                  {publishLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  1-Click Publish to Live Blog
                </button>
              )}
            </div>

            {publishSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{publishSuccess}</span>
              </div>
            )}

            {generatedArticle ? (
              <div className="flex-1 space-y-4 overflow-y-auto max-h-[550px] pr-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-md">
                      {generatedArticle.category || "Guides"}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-200 text-slate-700 rounded-md">
                      Language: {generatedArticle.language}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-200 text-slate-700 rounded-md">
                      {generatedArticle.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{generatedArticle.title}</h2>
                  <p className="text-xs text-slate-500 font-mono">
                    Slug: /{generatedArticle.language}/blog/{generatedArticle.slug}
                  </p>
                  <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-100">
                    <strong>Meta Description:</strong> {generatedArticle.excerpt || generatedArticle.metaDescription}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 prose prose-sm max-w-none text-slate-800">
                  <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {generatedArticle.content}
                  </div>
                </div>

                {generatedArticle.faqs && generatedArticle.faqs.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-2">
                      {generatedArticle.faqs.map((faq: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                          <p className="font-semibold text-slate-900">Q: {faq.question}</p>
                          <p className="text-slate-600 mt-1">A: {faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-600">No article generated yet</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Fill in the topic and parameters on the left and click "Generate Full SEO Article" to see the output here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SEO AUDIT & 1-CLICK REPLACE */}
      {activeSubTab === "audit" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                Automated Technical SEO & Content Health Audit
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates meta descriptions, title lengths, hreflang tags, duplicate content risks, and sitemap consistency.
              </p>
            </div>
            <button
              onClick={handleRunAudit}
              disabled={auditLoading}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              {auditLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Re-Scan Entire Site
            </button>
          </div>

          {auditResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Score & Summary */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overall SEO Score</div>
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500 text-emerald-700 text-3xl font-black shadow-inner">
                    {auditResult.seoScore}/100
                  </div>
                  <p className="text-xs text-slate-600 mt-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {auditResult.summary}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Strengths
                  </div>
                  <ul className="space-y-2">
                    {auditResult.strengths.map((st, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 1-Click Actionable Suggestions */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    AI Actionable Suggestions (1-Click Direct Replace)
                  </h3>
                  <span className="text-xs text-slate-500">
                    {auditResult.suggestions.length} Improvements Available
                  </span>
                </div>

                <div className="space-y-4">
                  {auditResult.suggestions.map((sug) => (
                    <div
                      key={sug.id}
                      className={`p-4 rounded-xl border transition ${
                        sug.applied
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-200 text-slate-700 rounded">
                            {sug.targetType} • {sug.targetField}
                          </span>
                          {sug.applied && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Applied to Live Site
                            </span>
                          )}
                        </div>
                        {!sug.applied && (
                          <button
                            onClick={() => handleApplySuggestion(sug)}
                            disabled={applyingSuggestionId === sug.id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition"
                          >
                            {applyingSuggestionId === sug.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Zap className="w-3.5 h-3.5" />
                            )}
                            1-Click Replace
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mb-2">
                        <strong>Reason:</strong> {sug.reason}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-600">
                          <span className="text-[10px] font-bold text-red-600 uppercase block mb-1">
                            Current Value:
                          </span>
                          <span className="line-clamp-3">{sug.currentValue}</span>
                        </div>
                        <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 text-slate-800">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                            AI Suggested Replacement:
                          </span>
                          <span className="line-clamp-3 font-medium">{sug.suggestedValue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: AI ROBOTS.TXT GENERATOR */}
      {activeSubTab === "robots" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Prompt-Based Robots.txt Generator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Describe your desired crawler rules or security directives in natural language.
              </p>
            </div>
            {robotsGenerated && (
              <button
                onClick={handleSaveRobots}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
              >
                {robotsSaveSuccess ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                {robotsSaveSuccess ? "Saved to robots.txt!" : "1-Click Apply to robots.txt"}
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Prompt / Directives
              </label>
              <textarea
                value={robotsPrompt}
                onChange={(e) => setRobotsPrompt(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
              />
            </div>

            <button
              onClick={handleGenerateRobots}
              disabled={robotsLoading}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition"
            >
              {robotsLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
              Generate Optimized robots.txt
            </button>

            {robotsGenerated && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Generated Output
                </label>
                <textarea
                  value={robotsGenerated}
                  onChange={(e) => setRobotsGenerated(e.target.value)}
                  rows={8}
                  className="w-full font-mono text-xs p-4 bg-slate-900 text-emerald-400 rounded-xl border border-slate-800"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: DEDUPLICATION & MERGE */}
      {activeSubTab === "dedup" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Content Merge & Duplicate Removal Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Scans all blog posts and custom landing pages, removes duplicate slugs across languages, and rebuilds the Yoast sitemap index automatically.
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Automated Cleanup Safety Guarantee</p>
              <p className="mt-0.5 text-amber-800">
                This tool preserves all distinct translated post variants and canonical roots while purging redundant entries and stale pages.
              </p>
            </div>
          </div>

          <button
            onClick={handleDeduplicate}
            disabled={dedupLoading}
            className="px-5 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm transition"
          >
            {dedupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Scan & Deduplicate All Content Now
          </button>

          {dedupResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Deduplication Successful!
              </div>
              <p>{dedupResult.message}</p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block">Active Posts:</span>
                  <span className="font-bold text-slate-900 text-sm">{dedupResult.postsRemaining}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block">Active Pages:</span>
                  <span className="font-bold text-slate-900 text-sm">{dedupResult.pagesRemaining}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block">Duplicates Removed:</span>
                  <span className="font-bold text-emerald-700 text-sm">{dedupResult.removedDuplicates}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
