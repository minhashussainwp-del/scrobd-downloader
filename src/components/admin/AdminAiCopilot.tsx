import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Search,
  AlertTriangle,
  CheckCircle2,
  Code,
  FileCode,
  Copy,
  Check,
  Send,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  RefreshCw,
  Zap,
  Globe,
  Bot,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FileText,
  Sliders,
  Plus,
  Edit2,
  Terminal,
  Settings,
  Flame,
  CheckCheck,
} from "lucide-react";
import { AdminTab } from "./AdminLayout";

export interface AgentSkill {
  id: string;
  name: string;
  slashCommand: string; // e.g. "/audit", "/errors", "/html", "/schema", "/meta", "/codebase", "/faq", "/keywords"
  description: string;
  promptInstruction: string;
  category: "seo" | "code" | "content" | "technical" | "custom";
  isDefault?: boolean;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_AGENT_SKILLS: AgentSkill[] = [
  {
    id: "skill-audit",
    name: "Deep SEO Auditor",
    slashCommand: "/audit",
    description: "Performs full technical & on-page SEO audit of current page, checking titles, descriptions, headings, and keyword density.",
    promptInstruction: "Perform a comprehensive technical and on-page SEO audit of the active content. Check meta title (50-60 chars), meta description (140-160 chars), heading hierarchy (H1, H2, H3), search intent, and keyword density. List all issues with exact locations and give clear step-by-step fix recommendations.",
    category: "seo",
    isDefault: true,
    enabled: true,
  },
  {
    id: "skill-errors",
    name: "Find Errors & Problems",
    slashCommand: "/errors",
    description: "Scans for indexing obstacles, broken links, missing alt tags, duplicate headings, and technical SEO errors.",
    promptInstruction: "Scan for all SEO errors, broken links, missing alt attributes, duplicate H1 tags, or indexing hurdles. Point out exactly WHERE each error is located (file, tag, line) and provide concrete solutions.",
    category: "seo",
    isDefault: true,
    enabled: true,
  },
  {
    id: "skill-html",
    name: "Gutenberg Custom HTML Builder",
    slashCommand: "/html",
    description: "Generates production-ready, responsive Custom HTML blocks with Tailwind CSS formatted for Gutenberg <!-- wp:html -->.",
    promptInstruction: "Generate clean, responsive Custom HTML code with Tailwind CSS classes (such as comparison tables, callout boxes, CTA buttons, badges, or embed containers) ready to paste into the Gutenberg Custom HTML block (<!-- wp:html -->). Use semantic markup and modern styling.",
    category: "code",
    isDefault: true,
    enabled: true,
  },
  {
    id: "skill-schema",
    name: "Schema.org JSON-LD Generator",
    slashCommand: "/schema",
    description: "Generates Google-validated Schema.org JSON-LD structured data (SoftwareApplication, Article, FAQPage, HowTo).",
    promptInstruction: "Generate valid Schema.org JSON-LD structured data (e.g. SoftwareApplication, Article, FAQPage, HowTo, BreadcrumbList) for the active content to gain Google rich snippets and enhanced SERP appearance.",
    category: "technical",
    isDefault: true,
    enabled: true,
  },
  {
    id: "skill-meta",
    name: "High-CTR Meta & Slug Optimizer",
    slashCommand: "/meta",
    description: "Suggests high-converting SEO meta titles, meta descriptions, and clean permalink slugs based on search intent.",
    promptInstruction: "Analyze the active content and suggest 3 high-CTR SEO Meta Titles (50-60 chars), 2 compelling Meta Descriptions (140-160 chars) with strong CTAs, and an optimized permalink slug. Explain why each will rank higher.",
    category: "seo",
    isDefault: true,
    enabled: true,
  },
  {
    id: "skill-codebase",
    name: "Codebase & SSR Technical Audit",
    slashCommand: "/codebase",
    description: "Audits server routes, SSR pre-rendering, sitemaps, robots.txt, OpenGraph cards, and technical infrastructure.",
    promptInstruction: "Analyze the server-side rendering architecture, OpenGraph cards, hreflang multi-lingual tags, robots.txt directives, and XML sitemaps (/sitemap_index.xml, /page-sitemap.xml, /post-sitemap.xml). Verify crawler accessibility.",
    category: "technical",
    isDefault: true,
    enabled: true,
  },
  {
    id: "skill-faq",
    name: "FAQ Section with Schema",
    slashCommand: "/faq",
    description: "Generates 3-5 high-converting frequently asked questions with expandable HTML accordions and FAQPage schema.",
    promptInstruction: "Generate 3 to 5 frequently asked questions and clear, concise answers directly relevant to the current page. Provide both the interactive HTML accordion markup and the corresponding FAQPage JSON-LD schema.",
    category: "content",
    isDefault: true,
    enabled: true,
  },
  {
    id: "skill-keywords",
    name: "Keyword Clustering & Intent",
    slashCommand: "/keywords",
    description: "Identifies primary keywords, secondary search queries, search intent (informational/transactional), and LSI terms.",
    promptInstruction: "Extract and analyze the primary target keyword, secondary long-tail keywords, LSI synonyms, and search intent. Provide optimal placement suggestions across title, H1, H2, first 100 words, and image alt text.",
    category: "seo",
    isDefault: true,
    enabled: true,
  },
];

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  appliedSkill?: {
    id: string;
    name: string;
    slashCommand: string;
  } | null;
}

interface AdminAiCopilotProps {
  activeTab: AdminTab;
  pageContext?: {
    type?: string;
    id?: string;
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    metaTitle?: string;
    metaDescription?: string;
    language?: string;
    category?: string;
    tags?: any;
    [key: string]: any;
  };
  isOpen?: boolean;
  onToggle?: () => void;
  initialCommand?: string;
}

export function AdminAiCopilot({
  activeTab,
  pageContext = {},
  isOpen: propIsOpen,
  onToggle,
  initialCommand,
}: AdminAiCopilotProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalOpen;
  const setIsOpen = onToggle || (() => setInternalOpen((prev) => !prev));

  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom Skills State
  const [skills, setSkills] = useState<AgentSkill[]>(DEFAULT_AGENT_SKILLS);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<AgentSkill | null>(null);
  const [isCreatingNewSkill, setIsCreatingNewSkill] = useState(false);
  const [skillFeedback, setSkillFeedback] = useState<string | null>(null);

  // Form state for creating / editing skill
  const [skillName, setSkillName] = useState("");
  const [skillCommand, setSkillCommand] = useState("");
  const [skillDescription, setSkillDescription] = useState("");
  const [skillPromptInstruction, setSkillPromptInstruction] = useState("");
  const [skillCategory, setSkillCategory] = useState<AgentSkill["category"]>("custom");

  // Slash Command Popover State
  const [slashPopoverOpen, setSlashPopoverOpen] = useState(false);
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "model",
      text: `👋 **Hello! I am your Gemini SEO & Code Agent Copilot.**\n\nI am enabled across the entire Admin Panel with **Custom Skills & Slash Commands** support!\n\n💡 **How to run Skills:**\n* Type \`/\` in the input below to trigger the **Slash Command Menu** (e.g. \`/audit\`, \`/html\`, \`/schema\`, \`/meta\`, \`/faq\`, \`/errors\`).\n* Or click **Manage Skills (⚡)** to add your own custom skills with specialized prompt rules and instructions!\n\nI always act directly on behalf of whichever skill you run.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch Skills from server
  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/ai/skills");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.skills) && data.skills.length > 0) {
          setSkills(data.skills);
        }
      }
    } catch (err) {
      console.warn("Could not load skills from server, using defaults:", err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Initial command hook
  useEffect(() => {
    if (initialCommand && isOpen) {
      handleSendMessage(initialCommand);
    }
  }, [initialCommand, isOpen]);

  // Slash commands filtering
  const slashQuery = inputMessage.startsWith("/") ? inputMessage.slice(1).toLowerCase().split(/\s+/)[0] : "";
  const filteredSkills = skills.filter((s) => {
    if (!s.enabled) return false;
    if (!slashQuery) return true;
    const cmdWithoutSlash = s.slashCommand.replace("/", "").toLowerCase();
    return (
      cmdWithoutSlash.includes(slashQuery) ||
      s.name.toLowerCase().includes(slashQuery) ||
      s.description.toLowerCase().includes(slashQuery)
    );
  });

  const handleInputChange = (val: string) => {
    setInputMessage(val);
    if (val.startsWith("/")) {
      setSlashPopoverOpen(true);
      setSelectedSlashIndex(0);
    } else {
      setSlashPopoverOpen(false);
    }
  };

  const handleSelectSkillFromSlash = (skill: AgentSkill) => {
    setSlashPopoverOpen(false);
    // Fill command in input, with trailing space so user can type extra instructions
    setInputMessage(`${skill.slashCommand} `);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleExecuteSkillDirectly = (skill: AgentSkill) => {
    setSlashPopoverOpen(false);
    handleSendMessage(skill.slashCommand, skill.id);
  };

  const handleSendMessage = async (customPrompt?: string, skillId?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || loading) return;

    // Detect if this prompt is a slash command
    let matchedSkill: AgentSkill | null = null;
    if (skillId) {
      matchedSkill = skills.find((s) => s.id === skillId) || null;
    } else if (textToSend.startsWith("/")) {
      const parts = textToSend.split(/\s+/);
      const trigger = parts[0].toLowerCase();
      matchedSkill = skills.find((s) => s.slashCommand.toLowerCase() === trigger && s.enabled) || null;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      appliedSkill: matchedSkill
        ? {
            id: matchedSkill.id,
            name: matchedSkill.name,
            slashCommand: matchedSkill.slashCommand,
          }
        : null,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setSlashPopoverOpen(false);
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome-1")
        .slice(-6)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const contextPayload = {
        currentTab: activeTab,
        ...pageContext,
      };

      const res = await fetch("/api/ai/seo-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: textToSend,
          history,
          pageContext: contextPayload,
          includeTechnicalAudit: true,
          skillId: matchedSkill?.id,
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        const aiMsg: Message = {
          id: `m-${Date.now()}`,
          role: "model",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          appliedSkill: data.appliedSkill || (matchedSkill ? {
            id: matchedSkill.id,
            name: matchedSkill.name,
            slashCommand: matchedSkill.slashCommand,
          } : null),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || data.fallback || "Failed to get AI response");
      }
    } catch (err: any) {
      console.error("AI SEO Agent fetch error:", err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "model",
        text: `⚠️ **Skill Execution Notice:** ${err.message || "Failed to process request."}\n\n*Suggestion:* Check your network connection or verify that GEMINI_API_KEY is configured.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If slash popover is open, handle navigation
    if (slashPopoverOpen && filteredSkills.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSlashIndex((prev) => (prev + 1) % filteredSkills.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSlashIndex((prev) => (prev - 1 + filteredSkills.length) % filteredSkills.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const selected = filteredSkills[selectedSlashIndex];
        if (selected) {
          handleSelectSkillFromSlash(selected);
        }
        return;
      }
      if (e.key === "Escape") {
        setSlashPopoverOpen(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm("Reset conversation history with Gemini SEO Agent?")) {
      setMessages([
        {
          id: "welcome-reset",
          role: "model",
          text: "🔄 Chat reset. Ready for your next slash command or custom skill instruction!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  // Skills CRUD Handlers
  const handleOpenAddSkill = () => {
    setEditingSkill(null);
    setSkillName("");
    setSkillCommand("/");
    setSkillDescription("");
    setSkillPromptInstruction("");
    setSkillCategory("custom");
    setIsCreatingNewSkill(true);
  };

  const handleEditSkill = (skill: AgentSkill) => {
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillCommand(skill.slashCommand);
    setSkillDescription(skill.description);
    setSkillPromptInstruction(skill.promptInstruction);
    setSkillCategory(skill.category);
    setIsCreatingNewSkill(true);
  };

  const handleSaveSkill = async () => {
    if (!skillName.trim() || !skillCommand.trim() || !skillPromptInstruction.trim()) {
      alert("Please fill in the Skill Name, Slash Command, and Prompt Instructions.");
      return;
    }

    const cleanCommand = skillCommand.trim().startsWith("/") ? skillCommand.trim() : `/${skillCommand.trim()}`;

    try {
      const res = await fetch("/api/ai/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSkill?.id,
          name: skillName.trim(),
          slashCommand: cleanCommand,
          description: skillDescription.trim(),
          promptInstruction: skillPromptInstruction.trim(),
          category: skillCategory,
          enabled: editingSkill ? editingSkill.enabled : true,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.skills)) {
        setSkills(data.skills);
        setIsCreatingNewSkill(false);
        setEditingSkill(null);
        setSkillFeedback(`Skill "${skillName}" saved successfully!`);
        setTimeout(() => setSkillFeedback(null), 3000);
      } else {
        alert(data.error || "Failed to save custom skill.");
      }
    } catch (e: any) {
      alert(`Error saving skill: ${e.message}`);
    }
  };

  const handleDeleteSkill = async (id: string, skillName: string) => {
    if (!confirm(`Are you sure you want to delete the custom skill "${skillName}"?`)) return;

    try {
      const res = await fetch(`/api/ai/skills/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success && Array.isArray(data.skills)) {
        setSkills(data.skills);
        setSkillFeedback(`Skill "${skillName}" removed.`);
        setTimeout(() => setSkillFeedback(null), 3000);
      } else {
        alert(data.error || "Failed to delete skill.");
      }
    } catch (e: any) {
      alert(`Error deleting skill: ${e.message}`);
    }
  };

  const handleToggleSkill = async (skill: AgentSkill) => {
    try {
      const res = await fetch("/api/ai/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...skill,
          enabled: !skill.enabled,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.skills)) {
        setSkills(data.skills);
      }
    } catch (e) {
      console.error("Toggle skill failed:", e);
    }
  };

  const handleResetSkillsToDefault = async () => {
    if (!confirm("Reset all skills to system default settings? Any custom skills will be removed.")) return;
    try {
      const res = await fetch("/api/ai/skills/reset", { method: "POST" });
      const data = await res.json();
      if (data.success && Array.isArray(data.skills)) {
        setSkills(data.skills);
        setSkillFeedback("Skills reset to factory defaults.");
        setTimeout(() => setSkillFeedback(null), 3000);
      }
    } catch (e: any) {
      alert(`Error resetting skills: ${e.message}`);
    }
  };

  // Helper to render markdown text with formatted code blocks
  const renderMessageContent = (text: string, msgId: string) => {
    if (text.includes("```")) {
      const parts = text.split(/(```(?:[a-z]*)\n[\s\S]*?```)/gi);
      return parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/^```([a-z]*)\n([\s\S]*?)```$/i);
          const lang = match ? match[1] || "html" : "code";
          const codeBody = match ? match[2].trim() : part.replace(/^```|```$/g, "").trim();
          const blockId = `${msgId}-code-${index}`;

          return (
            <div key={index} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 text-slate-300 text-[11px] font-mono border-b border-slate-800">
                <span className="uppercase font-bold text-indigo-400">{lang}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeBody, blockId)}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition px-2 py-0.5 rounded bg-slate-800 cursor-pointer"
                >
                  {copiedId === blockId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === blockId ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
              <pre className="p-3.5 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed select-text">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={index} className="space-y-1.5 leading-relaxed">
            {part.split("\n\n").map((para, pIdx) => {
              if (para.startsWith("### ")) {
                return (
                  <h4 key={pIdx} className="text-sm font-bold text-slate-900 mt-2.5 mb-1">
                    {para.replace("### ", "")}
                  </h4>
                );
              }
              if (para.startsWith("#### ")) {
                return (
                  <h5 key={pIdx} className="text-xs font-bold text-slate-800 mt-2 mb-0.5">
                    {para.replace("#### ", "")}
                  </h5>
                );
              }
              if (para.startsWith("* ") || para.startsWith("- ")) {
                return (
                  <ul key={pIdx} className="list-disc list-inside space-y-1 pl-1">
                    {para.split("\n").map((li, lIdx) => (
                      <li key={lIdx} className="text-slate-700">
                        {renderInlineFormatting(li.replace(/^[*-]\s+/, ""))}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={pIdx} className="text-slate-700">
                  {renderInlineFormatting(para)}
                </p>
              );
            })}
          </div>
        );
      });
    }

    return (
      <div className="space-y-1.5 leading-relaxed">
        {text.split("\n\n").map((para, pIdx) => {
          if (para.startsWith("### ")) {
            return (
              <h4 key={pIdx} className="text-sm font-bold text-slate-900 mt-2.5 mb-1">
                {para.replace("### ", "")}
              </h4>
            );
          }
          if (para.startsWith("#### ")) {
            return (
              <h5 key={pIdx} className="text-xs font-bold text-slate-800 mt-2 mb-0.5">
                {para.replace("#### ", "")}
              </h5>
            );
          }
          if (para.startsWith("* ") || para.startsWith("- ")) {
            return (
              <ul key={pIdx} className="list-disc list-inside space-y-1 pl-1">
                {para.split("\n").map((li, lIdx) => (
                  <li key={lIdx} className="text-slate-700">
                    {renderInlineFormatting(li.replace(/^[*-]\s+/, ""))}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={pIdx} className="text-slate-700">
              {renderInlineFormatting(para)}
            </p>
          );
        })}
      </div>
    );
  };

  const renderInlineFormatting = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.includes("`")) {
        const subParts = part.split(/(`.*?`)/g);
        return subParts.map((sub, sIdx) => {
          if (sub.startsWith("`") && sub.endsWith("`")) {
            return (
              <code key={sIdx} className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-[11px] border border-slate-200">
                {sub.slice(1, -1)}
              </code>
            );
          }
          return sub;
        });
      }
      return part;
    });
  };

  return (
    <>
      {/* 1. Floating Launcher Bubble (visible when drawer closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={setIsOpen}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer border border-slate-700 group hover:scale-105"
          title="Open Gemini SEO & Custom Skills Agent"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          </div>
          <span className="text-xs font-bold tracking-tight">Gemini SEO Agent</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            /skills ({skills.filter((s) => s.enabled).length})
          </span>
        </button>
      )}

      {/* 2. Main Slide-Over Copilot Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-300 transition-all duration-300 overflow-hidden ${
            isExpanded
              ? "w-[94vw] sm:w-[760px] h-[88vh]"
              : "w-[94vw] sm:w-[480px] h-[650px]"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-inner">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-white tracking-tight">Gemini SEO Agent</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    gemini-3.8-flash
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Tab: <strong className="text-slate-200 capitalize">{activeTab}</strong></span>
                  {pageContext.title && (
                    <span className="truncate max-w-[130px] text-slate-300">
                      • {pageContext.title}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Header controls: Skills Manager Button + Clear + Expand + Close */}
            <div className="flex items-center gap-1.5">
              {/* Manage Custom Skills Button */}
              <button
                type="button"
                onClick={() => setShowSkillsModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold transition shadow-xs cursor-pointer border border-indigo-500/30"
                title="Manage Custom Skills & Slash Commands"
              >
                <Sliders className="w-3 h-3 text-amber-300" />
                <span>Skills</span>
                <span className="ml-0.5 px-1 py-0.2 rounded-full bg-white/20 text-[9px]">
                  {skills.filter((s) => s.enabled).length}
                </span>
              </button>

              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={setIsOpen}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Slash Commands Carousel */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0">Slash:</span>
            {skills
              .filter((s) => s.enabled)
              .map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleExecuteSkillDirectly(skill)}
                  disabled={loading}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 font-semibold text-[11px] whitespace-nowrap shadow-2xs transition disabled:opacity-50 cursor-pointer"
                  title={skill.description}
                >
                  <span className="font-mono text-indigo-600 font-bold">{skill.slashCommand}</span>
                  <span className="text-slate-600">{skill.name}</span>
                </button>
              ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-100/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "model" && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs space-y-2"
                  }`}
                >
                  <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between font-mono">
                    <span className="font-semibold text-slate-500 uppercase">
                      {msg.role === "user" ? "You (Admin)" : "Gemini SEO Agent"}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Active Skill Execution Indicator Badge */}
                  {msg.appliedSkill && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200/80 text-indigo-800 font-mono text-[10px] font-bold">
                      <Zap className="w-3 h-3 text-indigo-600 fill-indigo-600" />
                      <span>On behalf of Skill:</span>
                      <span className="text-indigo-950 underline">{msg.appliedSkill.slashCommand}</span>
                      <span>({msg.appliedSkill.name})</span>
                    </div>
                  )}

                  {renderMessageContent(msg.text, msg.id)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-slate-600 text-xs w-fit shadow-2xs animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span className="font-medium">Executing skill instructions and analyzing context...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Slash-Command Autocomplete Popover (Shows when user types /) */}
          {slashPopoverOpen && (
            <div className="border-t border-indigo-200 bg-white shadow-xl z-20 max-h-56 overflow-y-auto">
              <div className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Select Skill to Run (or press Tab / Enter)</span>
                <span className="font-mono text-indigo-300">Type /command</span>
              </div>
              {filteredSkills.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center italic">
                  No matching skill found for &quot;/{slashQuery}&quot;. Open Skills Manager to create one!
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredSkills.map((skill, index) => (
                    <div
                      key={skill.id}
                      onClick={() => handleSelectSkillFromSlash(skill)}
                      onMouseEnter={() => setSelectedSlashIndex(index)}
                      className={`px-3 py-2 flex items-start justify-between gap-3 cursor-pointer transition ${
                        selectedSlashIndex === index ? "bg-indigo-50 text-indigo-950 font-medium" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-indigo-600 bg-indigo-100/70 px-1.5 py-0.2 rounded">
                            {skill.slashCommand}
                          </span>
                          <span className="font-bold text-xs text-slate-800 truncate">{skill.name}</span>
                          {skill.isDefault ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold">
                              System
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                              Custom
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{skill.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecuteSkillDirectly(skill);
                        }}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold shrink-0 transition"
                      >
                        Run Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chatbase Command Input */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-end gap-2"
            >
              <textarea
                ref={inputRef}
                rows={2}
                value={inputMessage}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type / to pick a skill (e.g. /audit, /html, /schema) or ask anything..."
                disabled={loading}
                className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none leading-relaxed bg-slate-50 focus:bg-white"
              />

              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Type <strong>/</strong> for Slash Commands &bull; Press <strong>Enter</strong> to send</span>
              <button
                type="button"
                onClick={() => setShowSkillsModal(true)}
                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                + Add Custom Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Custom Skills Management Modal */}
      {showSkillsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Sliders className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Agent Custom Skills &amp; Slash Commands</h3>
                  <p className="text-[11px] text-slate-400">
                    Define custom skills with specialized prompt rules and trigger them anytime via /command
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSkillsModal(false);
                  setIsCreatingNewSkill(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Banner */}
            {skillFeedback && (
              <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{skillFeedback}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {!isCreatingNewSkill ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Available Agent Skills ({skills.length})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Type any slash command in the chat to execute the agent on behalf of that skill.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddSkill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom Skill</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {skills.map((skill) => (
                      <div key={skill.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50/60 transition">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {skill.slashCommand}
                            </span>
                            <span className="font-bold text-xs text-slate-900">{skill.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase bg-slate-100 text-slate-600">
                              {skill.category}
                            </span>
                            {!skill.enabled && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-rose-100 text-rose-800">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{skill.description}</p>
                          <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-mono line-clamp-2">
                            {skill.promptInstruction}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 pt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleSkill(skill)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                              skill.enabled
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            {skill.enabled ? "Active" : "Disabled"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditSkill(skill)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Skill Instructions"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {!skill.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSkill(skill.id, skill.name)}
                              className="p-1 rounded text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Custom Skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Add / Edit Skill Form */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {editingSkill ? `Edit Skill: ${editingSkill.name}` : "Create New Custom Agent Skill"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewSkill(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                    >
                      &larr; Back to list
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Skill Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        placeholder="e.g. Urdu SEO Specialist"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Slash Command <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={skillCommand}
                        onChange={(e) => setSkillCommand(e.target.value)}
                        placeholder="e.g. /urdu or /backlinks"
                        className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Description
                    </label>
                    <input
                      type="text"
                      value={skillDescription}
                      onChange={(e) => setSkillDescription(e.target.value)}
                      placeholder="What this skill does (e.g. Translates and optimizes keywords for Urdu search queries)"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none bg-white"
                    >
                      <option value="seo">SEO &amp; Optimization</option>
                      <option value="code">HTML &amp; Code Generation</option>
                      <option value="content">Content &amp; Copywriting</option>
                      <option value="technical">Technical Architecture &amp; Schema</option>
                      <option value="custom">Custom Specialized</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Prompt Instructions &amp; Mandatory Rules <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mb-1.5">
                      The AI Agent will execute strictly on behalf of these rules whenever this skill is triggered.
                    </p>
                    <textarea
                      rows={6}
                      value={skillPromptInstruction}
                      onChange={(e) => setSkillPromptInstruction(e.target.value)}
                      placeholder="e.g. You are an expert Urdu SEO copywriter. When this skill is invoked, analyze the document and provide Urdu keywords, translated headings, localized meta descriptions, and Roman Urdu search phrases..."
                      className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewSkill(false)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSkill}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      {editingSkill ? "Update Skill" : "Save Custom Skill"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Skills are persistently saved and available across all admin pages.</span>

              {!isCreatingNewSkill && (
                <button
                  type="button"
                  onClick={handleResetSkillsToDefault}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Reset to Defaults
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
