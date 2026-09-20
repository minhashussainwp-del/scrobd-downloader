import React, { useState } from "react";
import {
  Search,
  Type,
  Heading,
  Image as ImageIcon,
  Quote,
  AlertCircle,
  List,
  Table,
  HelpCircle,
  Columns,
  MousePointerClick,
  Sparkles,
  Code,
  Minus,
  MoveVertical,
  X,
  Layers,
  Sparkle,
} from "lucide-react";
import { BlockType } from "./types";
import { GUTENBERG_PATTERNS } from "./GutenbergPatterns";

interface GutenbergInserterProps {
  onInsertBlock: (type: BlockType, extra?: any) => void;
  onInsertPattern: (patternId: string) => void;
  onClose: () => void;
}

interface BlockItemDef {
  type: BlockType;
  title: string;
  description: string;
  category: "text" | "media" | "design" | "widgets";
  icon: React.ElementType;
}

const BLOCK_DEFINITIONS: BlockItemDef[] = [
  // Text
  { type: "paragraph", title: "Paragraph", description: "Start with plain text and inline links.", category: "text", icon: Type },
  { type: "heading", title: "Heading", description: "Organize content with H1 to H6 sections.", category: "text", icon: Heading },
  { type: "list", title: "List", description: "Numbered or bulleted itemized lists.", category: "text", icon: List },
  { type: "quote", title: "Quote", description: "Stylized quotation with citation text.", category: "text", icon: Quote },
  { type: "code", title: "Code", description: "Display formatted code snippets.", category: "text", icon: Code },
  // Media
  { type: "image", title: "Image", description: "Insert illustration, infographic or photo.", category: "media", icon: ImageIcon },
  // Design
  { type: "table", title: "Table", description: "Structured data table with rows & columns.", category: "design", icon: Table },
  { type: "columns", title: "Columns", description: "Multi-column responsive grid layout.", category: "design", icon: Columns },
  { type: "button", title: "Button", description: "Action button or download call-to-action.", category: "design", icon: MousePointerClick },
  { type: "divider", title: "Separator", description: "Horizontal dividing rule between sections.", category: "design", icon: Minus },
  { type: "spacer", title: "Spacer", description: "Adjustable whitespace height spacer.", category: "design", icon: MoveVertical },
  // Widgets / Custom
  { type: "callout", title: "Callout / Notice", description: "Important tip, alert or informative box.", category: "widgets", icon: AlertCircle },
  { type: "faq", title: "FAQ Accordion", description: "Expandable questions with Schema markup.", category: "widgets", icon: HelpCircle },
  { type: "ad", title: "Ad Placement", description: "Responsive ad banner placeholder unit.", category: "widgets", icon: Sparkles },
];

export function GutenbergInserter({
  onInsertBlock,
  onInsertPattern,
  onClose,
}: GutenbergInserterProps) {
  const [activeTab, setActiveTab] = useState<"blocks" | "patterns">("blocks");
  const [search, setSearch] = useState("");

  const filteredBlocks = BLOCK_DEFINITIONS.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPatterns = GUTENBERG_PATTERNS.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    { id: "text", label: "Text" },
    { id: "media", label: "Media" },
    { id: "design", label: "Design" },
    { id: "widgets", label: "Widgets & Callouts" },
  ] as const;

  return (
    <div className="w-80 h-[560px] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden text-slate-800 z-50">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-200 space-y-3 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("blocks")}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                activeTab === "blocks" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Blocks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("patterns")}
              className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                activeTab === "patterns" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkle className="w-3 h-3 text-amber-500" />
              <span>Patterns</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search blocks & patterns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            autoFocus
          />
        </div>
      </div>

      {/* Body: Blocks Tab */}
      {activeTab === "blocks" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {categories.map((cat) => {
            const catBlocks = filteredBlocks.filter((b) => b.category === cat.id);
            if (catBlocks.length === 0) return null;
            return (
              <div key={cat.id} className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  {cat.label}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {catBlocks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          onInsertBlock(item.type);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition flex flex-col items-start gap-1 group cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                          {item.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Body: Patterns Tab */}
      {activeTab === "patterns" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filteredPatterns.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onInsertPattern(p.id);
                onClose();
              }}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 text-left transition space-y-1.5 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-700">
                  {p.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
                  {p.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {p.description}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
