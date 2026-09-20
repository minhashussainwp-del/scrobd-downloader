import React, { useState } from "react";
import {
  ListTree,
  FileText,
  AlertTriangle,
  Heading,
  Type,
  Image as ImageIcon,
  Quote,
  AlertCircle,
  Table,
  HelpCircle,
  Columns,
  MousePointerClick,
  Minus,
  MoveVertical,
  Code,
  ChevronUp,
  ChevronDown,
  Trash2,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { GutenbergEditorBlock, DocumentStats } from "./types";

interface GutenbergListViewProps {
  blocks: GutenbergEditorBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  stats: DocumentStats;
  onClose: () => void;
}

export function GutenbergListView({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onMoveUp,
  onMoveDown,
  onDelete,
  stats,
  onClose,
}: GutenbergListViewProps) {
  const [tab, setTab] = useState<"list" | "outline">("list");

  // Analyze headings for hierarchy issues (e.g. H2 followed by H4 without H3)
  const headings = blocks
    .map((b, idx) => ({ ...b, blockIndex: idx }))
    .filter((b) => b.type === "heading");

  const hierarchyWarnings: Array<{ headingIndex: number; message: string }> = [];
  for (let i = 1; i < headings.length; i++) {
    const prevLevel = headings[i - 1].level || 2;
    const curLevel = headings[i].level || 2;
    if (curLevel > prevLevel + 1) {
      hierarchyWarnings.push({
        headingIndex: i,
        message: `Skipped heading level: H${prevLevel} directly to H${curLevel}. Best SEO practice uses H${prevLevel + 1}.`,
      });
    }
  }

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "heading":
        return Heading;
      case "paragraph":
        return Type;
      case "image":
        return ImageIcon;
      case "quote":
        return Quote;
      case "callout":
        return AlertCircle;
      case "table":
        return Table;
      case "faq":
        return HelpCircle;
      case "columns":
        return Columns;
      case "button":
        return MousePointerClick;
      case "code":
        return Code;
      case "divider":
        return Minus;
      case "spacer":
        return MoveVertical;
      default:
        return FileText;
    }
  };

  return (
    <div className="w-80 h-[560px] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden text-slate-800 z-50">
      {/* Top Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("list")}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              tab === "list" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("outline")}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              tab === "outline" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Heading className="w-3.5 h-3.5" />
            <span>Outline</span>
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

      {/* Tab: List View */}
      {tab === "list" && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {blocks.map((block, idx) => {
            const Icon = getBlockIcon(block.type);
            const isSelected = block.id === selectedBlockId;
            const snippet =
              block.content ||
              (block.type === "image" ? block.caption || "Image" : "") ||
              (block.type === "callout" ? block.calloutTitle || "Notice" : "") ||
              (block.type === "faq" ? `${block.faqItems?.length || 0} questions` : block.type);

            return (
              <div
                key={block.id}
                onClick={() => onSelectBlock(block.id)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition group cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                  <Icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">
                    {block.type === "heading" ? `H${block.level || 2}` : block.type}
                  </span>
                  <span className="truncate text-slate-700 font-normal">
                    {snippet}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveUp(idx);
                    }}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-20 cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveDown(idx);
                    }}
                    disabled={idx === blocks.length - 1}
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-20 cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(block.id);
                    }}
                    className="p-1 rounded hover:bg-red-100 text-red-600 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Document Outline */}
      {tab === "outline" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {hierarchyWarnings.length > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Heading Hierarchy Warnings ({hierarchyWarnings.length})</span>
              </span>
              <p className="text-[11px] text-amber-800 leading-tight">
                {hierarchyWarnings[0].message}
              </p>
            </div>
          )}

          {headings.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No headings found. Add H2 or H3 blocks to structure the document.
            </div>
          ) : (
            <div className="space-y-1">
              {headings.map((h, i) => {
                const level = h.level || 2;
                const indent = (level - 1) * 12;
                const isSelected = h.id === selectedBlockId;

                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => onSelectBlock(h.id)}
                    style={{ paddingLeft: `${indent + 8}px` }}
                    className={`w-full py-1.5 pr-2 rounded-lg text-left text-xs transition flex items-center gap-2 group cursor-pointer ${
                      isSelected ? "bg-indigo-50 font-bold text-indigo-900" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      H{level}
                    </span>
                    <span className="truncate">{h.content || "(Empty Heading)"}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Bottom Document Statistics Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 text-[11px] text-slate-600 grid grid-cols-3 gap-2 text-center font-medium">
        <div>
          <span className="block font-bold text-slate-900 text-xs">{stats.words}</span>
          <span>Words</span>
        </div>
        <div>
          <span className="block font-bold text-slate-900 text-xs">{stats.readingTimeMin} min</span>
          <span>Read Time</span>
        </div>
        <div>
          <span className="block font-bold text-slate-900 text-xs">{blocks.length}</span>
          <span>Blocks</span>
        </div>
      </div>
    </div>
  );
}
