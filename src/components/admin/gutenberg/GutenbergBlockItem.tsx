import React, { useRef, useEffect } from "react";
import {
  Heading as HeadingIcon,
  Type,
  Image as ImageIcon,
  Quote as QuoteIcon,
  AlertCircle,
  List as ListIcon,
  Table as TableIcon,
  HelpCircle,
  Columns as ColumnsIcon,
  MousePointerClick,
  Sparkles,
  Code as CodeIcon,
  Minus,
  MoveVertical,
  Plus,
  Trash2,
  ExternalLink,
  GripVertical,
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { GutenbergEditorBlock } from "./types";
import { GutenbergToolbar } from "./GutenbergToolbar";

interface GutenbergBlockItemProps {
  block: GutenbergEditorBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: Partial<GutenbergEditorBlock>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBefore: () => void;
  onAddAfter: () => void;
  onSlashCommand?: (rect: DOMRect) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function GutenbergBlockItem({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBefore,
  onAddAfter,
  onSlashCommand,
  isFirst,
  isLast,
}: GutenbergBlockItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea helper
  const adjustHeight = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(el.scrollHeight, 28)}px`;
    }
  };

  const handleTextChange = (val: string) => {
    onUpdate({ content: val });
    if (val === "/" && onSlashCommand && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      onSlashCommand(rect);
    }
  };

  // 1. Heading Block
  const renderHeading = () => {
    const level = block.level || 2;
    const sizeClasses = {
      1: "text-3xl sm:text-4xl font-extrabold tracking-tight",
      2: "text-2xl sm:text-3xl font-extrabold tracking-tight",
      3: "text-xl sm:text-2xl font-bold tracking-tight",
      4: "text-lg sm:text-xl font-bold tracking-tight",
      5: "text-base sm:text-lg font-bold tracking-tight",
      6: "text-sm sm:text-base font-bold tracking-tight",
    }[level];

    return (
      <div className="relative">
        <textarea
          ref={adjustHeight}
          value={block.content}
          onChange={(e) => {
            handleTextChange(e.target.value);
            adjustHeight(e.target);
          }}
          placeholder={`H${level} Heading...`}
          rows={1}
          style={{ textAlign: block.textAlign || "left" }}
          className={`w-full bg-transparent border-none text-slate-900 font-extrabold focus:outline-none resize-none overflow-hidden placeholder-slate-300 leading-snug ${sizeClasses}`}
        />
      </div>
    );
  };

  // 2. Paragraph Block
  const renderParagraph = () => {
    return (
      <div className="relative">
        <textarea
          ref={adjustHeight}
          value={block.content}
          onChange={(e) => {
            handleTextChange(e.target.value);
            adjustHeight(e.target);
          }}
          placeholder="Type '/' to choose a block, or start typing..."
          rows={1}
          style={{ textAlign: block.textAlign || "left" }}
          className="w-full bg-transparent border-none text-slate-700 text-base sm:text-lg leading-relaxed focus:outline-none resize-none overflow-hidden placeholder-slate-300 font-normal"
        />
      </div>
    );
  };

  // 3. Image Block
  const renderImage = () => {
    return (
      <div className="space-y-3">
        {block.imageUrl ? (
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group">
            <img
              src={block.imageUrl}
              alt={block.altText || block.caption || "Image"}
              className={`max-h-[460px] object-cover transition ${
                block.imageAlign === "center"
                  ? "mx-auto"
                  : block.imageAlign === "right"
                  ? "ml-auto"
                  : ""
              } w-full`}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Enter image URL</p>
              <p className="text-xs text-slate-500">Provide direct image link or Unsplash URL</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <input
            type="text"
            value={block.imageUrl || ""}
            onChange={(e) => onUpdate({ imageUrl: e.target.value })}
            placeholder="Image URL (e.g. /images/... or https://...)"
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={block.caption || ""}
            onChange={(e) => onUpdate({ caption: e.target.value, altText: e.target.value })}
            placeholder="Image caption / alt text"
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    );
  };

  // 4. Quote Block
  const renderQuote = () => {
    return (
      <blockquote className="p-4 sm:p-6 rounded-2xl bg-indigo-50/50 border-l-4 border-indigo-600 space-y-2">
        <textarea
          ref={adjustHeight}
          value={block.content}
          onChange={(e) => {
            onUpdate({ content: e.target.value });
            adjustHeight(e.target);
          }}
          placeholder="Quote statement..."
          rows={1}
          className="w-full bg-transparent border-none text-slate-800 text-base sm:text-lg italic font-serif leading-relaxed focus:outline-none resize-none overflow-hidden placeholder-slate-400"
        />
        <input
          type="text"
          value={block.citation || ""}
          onChange={(e) => onUpdate({ citation: e.target.value })}
          placeholder="— Citation or Author attribution"
          className="w-full bg-transparent border-none text-xs font-semibold text-indigo-700 not-italic focus:outline-none placeholder-indigo-300"
        />
      </blockquote>
    );
  };

  // 5. Callout Block
  const renderCallout = () => {
    const variant = block.styleVariant || "tip";
    const bgStyles = {
      info: "bg-blue-50/80 border-blue-200 text-blue-950",
      warning: "bg-amber-50/80 border-amber-200 text-amber-950",
      success: "bg-emerald-50/80 border-emerald-200 text-emerald-950",
      tip: "bg-indigo-50/80 border-indigo-200 text-indigo-950",
      note: "bg-slate-100 border-slate-200 text-slate-900",
    }[variant];

    const Icon = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle2,
      tip: Lightbulb,
      note: Info,
    }[variant];

    return (
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${bgStyles}`}>
        <Icon className="w-5 h-5 shrink-0 mt-0.5 text-indigo-600" />
        <div className="flex-1 space-y-1">
          <input
            type="text"
            value={block.calloutTitle || ""}
            onChange={(e) => onUpdate({ calloutTitle: e.target.value })}
            placeholder="Callout Title (Optional)"
            className="w-full bg-transparent border-none font-bold text-slate-900 focus:outline-none placeholder-slate-400 text-sm"
          />
          <textarea
            ref={adjustHeight}
            value={block.content}
            onChange={(e) => {
              onUpdate({ content: e.target.value });
              adjustHeight(e.target);
            }}
            placeholder="Callout message or alert explanation..."
            rows={1}
            className="w-full bg-transparent border-none text-slate-700 focus:outline-none resize-none overflow-hidden placeholder-slate-400 text-sm leading-relaxed"
          />
        </div>
      </div>
    );
  };

  // 6. List Block
  const renderList = () => {
    const items = block.listItems || [""];
    const isOrdered = block.listType === "ordered";

    const updateItem = (idx: number, text: string) => {
      const next = [...items];
      next[idx] = text;
      onUpdate({ listItems: next });
    };

    const addItem = () => {
      onUpdate({ listItems: [...items, ""] });
    };

    const removeItem = (idx: number) => {
      const next = items.filter((_, i) => i !== idx);
      onUpdate({ listItems: next.length > 0 ? next : [""] });
    };

    return (
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <span className="text-slate-400 font-mono text-sm w-5 text-right select-none">
              {isOrdered ? `${idx + 1}.` : "•"}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(idx, e.target.value)}
              placeholder="List item..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem();
                } else if (e.key === "Backspace" && item === "" && items.length > 1) {
                  e.preventDefault();
                  removeItem(idx);
                }
              }}
              className="flex-1 bg-transparent border-none text-slate-700 text-base leading-relaxed focus:outline-none placeholder-slate-300"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
              title="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition pt-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add list item</span>
        </button>
      </div>
    );
  };

  // 7. Table Block
  const renderTable = () => {
    const headers = block.tableHeaders || ["Column 1", "Column 2", "Column 3"];
    const rows = block.tableRows || [
      ["Data 1", "Data 2", "Data 3"],
      ["Data 4", "Data 5", "Data 6"],
    ];

    const addRow = () => {
      const emptyRow = new Array(headers.length).fill("");
      onUpdate({ tableRows: [...rows, emptyRow] });
    };

    const addCol = () => {
      onUpdate({
        tableHeaders: [...headers, `Column ${headers.length + 1}`],
        tableRows: rows.map((r) => [...r, ""]),
      });
    };

    const removeRow = (rowIdx: number) => {
      onUpdate({ tableRows: rows.filter((_, i) => i !== rowIdx) });
    };

    const removeCol = (colIdx: number) => {
      if (headers.length <= 1) return;
      onUpdate({
        tableHeaders: headers.filter((_, i) => i !== colIdx),
        tableRows: rows.map((r) => r.filter((_, i) => i !== colIdx)),
      });
    };

    return (
      <div className="space-y-3">
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs bg-white">
          <table className="w-full text-left text-sm text-slate-700 divide-y divide-slate-200">
            {block.hasHeader !== false && (
              <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-xs">
                <tr>
                  {headers.map((h, colIdx) => (
                    <th key={colIdx} className="px-3 py-2 border-r border-slate-200 group">
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => {
                            const next = [...headers];
                            next[colIdx] = e.target.value;
                            onUpdate({ tableHeaders: next });
                          }}
                          className="w-full bg-transparent font-bold border-none focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeCol(colIdx)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-0.5"
                          title="Remove column"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/50 group">
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="px-3 py-2 border-r border-slate-100">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => {
                          const nextRows = [...rows];
                          nextRows[rowIdx] = [...nextRows[rowIdx]];
                          nextRows[rowIdx][colIdx] = e.target.value;
                          onUpdate({ tableRows: nextRows });
                        }}
                        className="w-full bg-transparent border-none text-slate-700 focus:outline-none text-sm"
                        placeholder="..."
                      />
                    </td>
                  ))}
                  <td className="w-6 px-1">
                    <button
                      type="button"
                      onClick={() => removeRow(rowIdx)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1"
                      title="Remove row"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
          <button
            type="button"
            onClick={addCol}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
        </div>
      </div>
    );
  };

  // 8. FAQ Block
  const renderFaq = () => {
    const items = block.faqItems || [
      { question: "Frequently Asked Question?", answer: "Comprehensive answer description..." },
    ];

    const updateFaq = (idx: number, field: "question" | "answer", val: string) => {
      const next = [...items];
      next[idx] = { ...next[idx], [field]: val };
      onUpdate({ faqItems: next });
    };

    const addFaq = () => {
      onUpdate({
        faqItems: [...items, { question: "New Question?", answer: "Answer details..." }],
      });
    };

    const removeFaq = (idx: number) => {
      onUpdate({ faqItems: items.filter((_, i) => i !== idx) });
    };

    return (
      <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>FAQ Accordion ({items.length} items)</span>
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ Schema.org JSON-LD Ready
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 relative group">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => updateFaq(idx, "question", e.target.value)}
                  placeholder="Question..."
                  className="w-full font-bold text-sm text-slate-900 bg-transparent border-none focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="p-1 text-slate-400 hover:text-red-600 transition"
                  title="Remove FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                ref={adjustHeight}
                value={item.answer}
                onChange={(e) => {
                  updateFaq(idx, "answer", e.target.value);
                  adjustHeight(e.target);
                }}
                placeholder="Answer..."
                rows={2}
                className="w-full text-xs text-slate-600 bg-transparent border-none focus:outline-none resize-none leading-relaxed"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addFaq}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add FAQ Item</span>
        </button>
      </div>
    );
  };

  // 9. Columns Block
  const renderColumns = () => {
    const cols = block.columns || ["Column 1 text...", "Column 2 text..."];
    const layout = block.columnLayout || "50-50";

    const updateCol = (idx: number, val: string) => {
      const next = [...cols];
      next[idx] = val;
      onUpdate({ columns: next });
    };

    const gridClass =
      layout === "30-70"
        ? "grid-cols-1 md:grid-cols-3"
        : layout === "70-30"
        ? "grid-cols-1 md:grid-cols-3"
        : layout === "33-33-33"
        ? "grid-cols-1 md:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2";

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
          <span className="font-semibold">Columns Layout ({layout})</span>
          <div className="flex items-center gap-1">
            {(["50-50", "30-70", "70-30", "33-33-33"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onUpdate({ columnLayout: l })}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  layout === l ? "bg-indigo-600 text-white" : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid ${gridClass} gap-4`}>
          {cols.map((col, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <textarea
                ref={adjustHeight}
                value={col}
                onChange={(e) => {
                  updateCol(idx, e.target.value);
                  adjustHeight(e.target);
                }}
                placeholder={`Column ${idx + 1} content (Markdown supported)...`}
                rows={2}
                className="w-full bg-transparent border-none text-xs text-slate-700 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 10. Button Block
  const renderButton = () => {
    return (
      <div className={`space-y-2 text-${block.buttonAlign || "left"}`}>
        <div className="inline-flex items-center gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200">
          <input
            type="text"
            value={block.buttonText || "Click Here"}
            onChange={(e) => onUpdate({ buttonText: e.target.value })}
            placeholder="Button label..."
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-xs border-none focus:outline-none"
          />
          <input
            type="text"
            value={block.buttonUrl || "#"}
            onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
            placeholder="Target URL..."
            className="px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none w-48"
          />
        </div>
      </div>
    );
  };

  // 11. Ad Block
  const renderAd = () => {
    return (
      <div className="p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Advertisement Slot [{block.adSlot || "in-feed"}]</span>
          </span>
          <select
            value={block.adSlot || "in-feed"}
            onChange={(e) => onUpdate({ adSlot: e.target.value as any })}
            className="px-2 py-0.5 rounded bg-white border border-amber-200 text-xs text-amber-900"
          >
            <option value="in-feed">In-Feed Mid-Article</option>
            <option value="below-hero">Below Header / Hero</option>
            <option value="sidebar">Sidebar Slot</option>
            <option value="article-mid">Article Midpoint Break</option>
          </select>
        </div>
        <input
          type="text"
          value={block.adLabel || ""}
          onChange={(e) => onUpdate({ adLabel: e.target.value })}
          placeholder="Slot Label / Sponsor Title (Optional)"
          className="w-full px-2.5 py-1 text-xs rounded border border-amber-200 bg-white focus:outline-none"
        />
      </div>
    );
  };

  // 12. Code Block
  const renderCode = () => {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between px-3 py-1 bg-slate-900 text-slate-400 text-xs rounded-t-xl">
          <span className="font-mono text-[11px]">Code Block</span>
          <input
            type="text"
            value={block.codeLanguage || "javascript"}
            onChange={(e) => onUpdate({ codeLanguage: e.target.value })}
            placeholder="language (e.g. bash, js, html)"
            className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[10px] font-mono border-none focus:outline-none"
          />
        </div>
        <textarea
          ref={adjustHeight}
          value={block.content}
          onChange={(e) => {
            onUpdate({ content: e.target.value });
            adjustHeight(e.target);
          }}
          placeholder="// Code snippet..."
          rows={2}
          className="w-full p-3 rounded-b-xl bg-slate-950 text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed border-t-0 border border-slate-900"
        />
      </div>
    );
  };

  // 13. Divider Block
  const renderDivider = () => {
    return (
      <div className="py-4">
        <hr className="border-t-2 border-slate-200 border-dashed" />
      </div>
    );
  };

  // 14. Spacer Block
  const renderSpacer = () => {
    const height = block.spacerHeight || 32;
    return (
      <div
        style={{ height: `${height}px` }}
        className="bg-indigo-50/50 border border-dashed border-indigo-200 rounded-lg flex items-center justify-center text-[11px] text-indigo-600 font-mono select-none"
      >
        Spacer: {height}px
      </div>
    );
  };

  // 15. Hero & Downloader Box Block
  const renderHero = () => {
    const checklist = block.checklistItems || [
      "No account or login required",
      "Full document pages preserved",
      "100% Free & Private — zero logs",
    ];

    const updateChecklist = (idx: number, val: string) => {
      const next = [...checklist];
      next[idx] = val;
      onUpdate({ checklistItems: next });
    };

    const addChecklistItem = () => {
      onUpdate({ checklistItems: [...checklist, "New security guarantee..."] });
    };

    const removeChecklistItem = (idx: number) => {
      const next = [...checklist];
      next.splice(idx, 1);
      onUpdate({ checklistItems: next });
    };

    return (
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/30 border border-indigo-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-indigo-100/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Hero & Downloader Section
            </span>
          </div>
          <input
            type="text"
            value={block.heroBadge || "100% Free & Secure Scribd PDF Converter"}
            onChange={(e) => onUpdate({ heroBadge: e.target.value })}
            placeholder="Pill Badge (e.g. 100% Free...)"
            className="px-3 py-1 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 rounded-full focus:outline-none"
          />
        </div>

        {/* H1 Title & Subtitle */}
        <div className="space-y-2">
          <textarea
            ref={adjustHeight}
            value={block.heroTitle || block.content || ""}
            onChange={(e) => {
              onUpdate({ heroTitle: e.target.value, content: e.target.value });
              adjustHeight(e.target);
            }}
            placeholder="Hero Title / Main H1..."
            rows={1}
            className="w-full bg-transparent border-none text-2xl sm:text-3xl font-extrabold text-slate-900 focus:outline-none resize-none leading-tight"
          />
          <textarea
            ref={adjustHeight}
            value={block.heroSubtitle || ""}
            onChange={(e) => {
              onUpdate({ heroSubtitle: e.target.value });
              adjustHeight(e.target);
            }}
            placeholder="Hero subtitle / description..."
            rows={2}
            className="w-full bg-transparent border-none text-sm text-slate-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Downloader Input Box Mockup */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="text"
            value={block.placeholderText || ""}
            onChange={(e) => onUpdate({ placeholderText: e.target.value })}
            placeholder="Input placeholder (e.g. Paste Scribd document link here...)"
            className="w-full px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            value={block.ctaText || "Download PDF"}
            onChange={(e) => onUpdate({ ctaText: e.target.value })}
            placeholder="CTA Button text"
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg whitespace-nowrap focus:outline-none text-center shadow-xs"
          />
        </div>

        {/* Quality Badges & Checklist */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Quality Badge Text
              </label>
              <input
                type="text"
                value={block.qualityBadgeText || "High Resolution 300 DPI"}
                onChange={(e) => onUpdate({ qualityBadgeText: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Auto-Save Badge Text
              </label>
              <input
                type="text"
                value={block.autoDownloadBadgeText || "Direct Browser Save"}
                onChange={(e) => onUpdate({ autoDownloadBadgeText: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Checklist Badges
            </label>
            <div className="space-y-1.5">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateChecklist(idx, e.target.value)}
                    className="w-full px-2 py-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-md focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addChecklistItem}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 pt-1"
              >
                <Plus className="w-3 h-3" /> Add Guarantee Bullet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 16. How It Works (Steps) Block
  const renderSteps = () => {
    const stepsList = block.steps || [
      { stepNumber: 1, title: "Copy the Document Link", description: "Open Scribd and copy the clean document URL." },
      { stepNumber: 2, title: "Paste into the Downloader", description: "Paste URL into the box above." },
      { stepNumber: 3, title: "Save Your File", description: "Download high-res PDF instantly." },
    ];

    const updateStep = (idx: number, field: string, val: any) => {
      const next = [...stepsList];
      next[idx] = { ...next[idx], [field]: val };
      onUpdate({ steps: next });
    };

    const addStep = () => {
      onUpdate({
        steps: [
          ...stepsList,
          {
            stepNumber: stepsList.length + 1,
            title: `Step ${stepsList.length + 1} Action`,
            description: "Describe this download or conversion step...",
          },
        ],
      });
    };

    const removeStep = (idx: number) => {
      const next = [...stepsList];
      next.splice(idx, 1);
      onUpdate({ steps: next });
    };

    return (
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              How It Works (Steps) Section
            </span>
          </div>
          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" /> Add Step
          </button>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <input
            type="text"
            value={block.sectionTitle || block.content || "How to Download Scribd Documents"}
            onChange={(e) => onUpdate({ sectionTitle: e.target.value, content: e.target.value })}
            placeholder="Section Title (e.g. How to Download Scribd Documents)..."
            className="w-full text-xl sm:text-2xl font-extrabold text-slate-900 bg-transparent border-none focus:outline-none"
          />
          <input
            type="text"
            value={block.sectionSubtitle || "Three simple steps to save any document..."}
            onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
            placeholder="Section subtitle..."
            className="w-full text-xs sm:text-sm text-slate-600 bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stepsList.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative group/step"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {step.stepNumber || idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="p-1 text-slate-400 hover:text-red-600 transition"
                  title="Remove step"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={step.title}
                onChange={(e) => updateStep(idx, "title", e.target.value)}
                placeholder="Step title..."
                className="w-full font-bold text-sm text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 focus:outline-none"
              />

              <textarea
                value={step.description}
                onChange={(e) => updateStep(idx, "description", e.target.value)}
                placeholder="Step description..."
                rows={2}
                className="w-full text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 17. Features & Benefits Block
  const renderFeatures = () => {
    const featList = block.features || [
      { title: "Instant Page Processing", description: "High-speed rendering delivers PDF in seconds.", badge: "Fast" },
      { title: "Complete Privacy Guaranteed", description: "We never store files or personal data.", badge: "Safe" },
      { title: "All Devices Supported", description: "Works on Android, iOS, Windows, Mac, Linux.", badge: "Universal" },
      { title: "Zero Hidden Costs", description: "Unlimited free document downloads.", badge: "100% Free" },
    ];

    const updateFeat = (idx: number, field: string, val: any) => {
      const next = [...featList];
      next[idx] = { ...next[idx], [field]: val };
      onUpdate({ features: next });
    };

    const addFeat = () => {
      onUpdate({
        features: [
          ...featList,
          {
            title: "New Feature",
            description: "Explain why users benefit from this feature...",
            badge: "Pro",
          },
        ],
      });
    };

    const removeFeat = (idx: number) => {
      const next = [...featList];
      next.splice(idx, 1);
      onUpdate({ features: next });
    };

    return (
      <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Features & Benefits Grid
            </span>
          </div>
          <button
            type="button"
            onClick={addFeat}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" /> Add Feature Card
          </button>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <input
            type="text"
            value={block.sectionTitle || block.content || "Why Use Our Scribd Downloader?"}
            onChange={(e) => onUpdate({ sectionTitle: e.target.value, content: e.target.value })}
            placeholder="Section Title..."
            className="w-full text-xl sm:text-2xl font-extrabold text-slate-900 bg-transparent border-none focus:outline-none"
          />
          <input
            type="text"
            value={block.sectionSubtitle || "Engineered for speed, privacy, and flawless formatting."}
            onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
            placeholder="Section subtitle..."
            className="w-full text-xs sm:text-sm text-slate-600 bg-transparent border-none focus:outline-none"
          />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {featList.map((feat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 relative shadow-2xs"
            >
              <div className="flex items-center justify-between gap-1">
                <input
                  type="text"
                  value={feat.badge || "Feature"}
                  onChange={(e) => updateFeat(idx, "badge", e.target.value)}
                  placeholder="Badge (e.g. Fast)"
                  className="px-2 py-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded focus:outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={() => removeFeat(idx)}
                  className="p-1 text-slate-400 hover:text-red-600 transition"
                  title="Remove feature"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={feat.title}
                onChange={(e) => updateFeat(idx, "title", e.target.value)}
                placeholder="Feature title..."
                className="w-full font-bold text-xs text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-200 focus:outline-none"
              />

              <textarea
                value={feat.description}
                onChange={(e) => updateFeat(idx, "description", e.target.value)}
                placeholder="Feature description..."
                rows={3}
                className="w-full text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (block.type) {
      case "hero":
        return renderHero();
      case "steps":
        return renderSteps();
      case "features":
        return renderFeatures();
      case "heading":
        return renderHeading();
      case "paragraph":
        return renderParagraph();
      case "image":
        return renderImage();
      case "quote":
        return renderQuote();
      case "callout":
        return renderCallout();
      case "list":
        return renderList();
      case "table":
        return renderTable();
      case "faq":
        return renderFaq();
      case "columns":
        return renderColumns();
      case "button":
        return renderButton();
      case "ad":
        return renderAd();
      case "code":
        return renderCode();
      case "divider":
        return renderDivider();
      case "spacer":
        return renderSpacer();
      default:
        return renderParagraph();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      className={`relative group rounded-xl p-2 transition-all ${
        isSelected
          ? "ring-2 ring-indigo-500 bg-indigo-50/10 shadow-xs"
          : "hover:bg-slate-50/60 border border-transparent hover:border-slate-200"
      }`}
    >
      {/* Floating Toolbar docked above block when selected */}
      {isSelected && (
        <div className="absolute -top-10 left-2 z-30">
          <GutenbergToolbar
            block={block}
            onUpdate={onUpdate}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onAddBefore={onAddBefore}
            onAddAfter={onAddAfter}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>
      )}

      {/* Block Content Canvas */}
      {renderContent()}

      {/* Hover Inserter Button between blocks */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddAfter();
          }}
          className="w-6 h-6 rounded-full bg-white border border-slate-300 shadow-sm hover:bg-indigo-50 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition cursor-pointer"
          title="Add block here"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
