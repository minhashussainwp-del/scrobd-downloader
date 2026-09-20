import React, { useState } from "react";
import {
  Heading,
  Bold,
  Italic,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Plus,
  Code,
  Sparkles,
  ExternalLink,
  Check,
  X,
  ListOrdered,
  List,
  AlertTriangle,
  Info,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { GutenbergEditorBlock } from "./types";

interface GutenbergToolbarProps {
  block: GutenbergEditorBlock;
  onUpdate: (updated: Partial<GutenbergEditorBlock>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBefore: () => void;
  onAddAfter: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function GutenbergToolbar({
  block,
  onUpdate,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBefore,
  onAddAfter,
  isFirst,
  isLast,
}: GutenbergToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Helper for applying markdown or html formatting wrappers to selected text
  const applyInlineFormatting = (wrapper: string) => {
    // Basic formatting wrapper toggle on current block content
    if (block.type === "paragraph" || block.type === "heading" || block.type === "callout") {
      const cur = block.content;
      onUpdate({ content: `${cur} ${wrapper}formatted text${wrapper}` });
    }
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    const urlFormatted = linkUrl.startsWith("http") || linkUrl.startsWith("/") ? linkUrl : `https://${linkUrl}`;
    const newContent = `${block.content} [link text](${urlFormatted})`;
    onUpdate({ content: newContent });
    setLinkUrl("");
    setShowLinkInput(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 bg-white border border-slate-300 rounded-lg shadow-md px-2 py-1 text-slate-700 text-xs select-none z-20 transition-all">
      {/* Block Type Badge */}
      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] px-1.5 py-0.5 bg-slate-100 rounded mr-1">
        {block.type}
      </span>

      {/* Move buttons */}
      <button
        type="button"
        onClick={onMoveUp}
        disabled={isFirst}
        className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition cursor-pointer"
        title="Move Up"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={isLast}
        className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition cursor-pointer"
        title="Move Down"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      {/* HEADING LEVEL SELECTOR */}
      {block.type === "heading" && (
        <div className="flex items-center gap-0.5">
          {([1, 2, 3, 4, 5, 6] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onUpdate({ level: lvl })}
              className={`px-1.5 py-0.5 rounded font-mono font-bold text-xs transition cursor-pointer ${
                block.level === lvl
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              H{lvl}
            </button>
          ))}
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />
        </div>
      )}

      {/* CALLOUT VARIANT SELECTOR */}
      {block.type === "callout" && (
        <div className="flex items-center gap-1">
          {(["info", "warning", "success", "tip", "note"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onUpdate({ styleVariant: v })}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize transition cursor-pointer ${
                block.styleVariant === v
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              {v}
            </button>
          ))}
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />
        </div>
      )}

      {/* LIST TYPE SELECTOR */}
      {block.type === "list" && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdate({ listType: "unordered" })}
            className={`p-1 rounded transition cursor-pointer ${
              block.listType === "unordered" ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Bullet list"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ listType: "ordered" })}
            className={`p-1 rounded transition cursor-pointer ${
              block.listType === "ordered" ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Numbered list"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />
        </div>
      )}

      {/* TEXT ALIGNMENT */}
      {(block.type === "heading" || block.type === "paragraph" || block.type === "button") && (
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onUpdate({ textAlign: "left", buttonAlign: "left" })}
            className={`p-1 rounded hover:bg-slate-100 transition cursor-pointer ${
              (block.textAlign || block.buttonAlign) === "left" ? "bg-slate-200 text-slate-900" : "text-slate-600"
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ textAlign: "center", buttonAlign: "center" })}
            className={`p-1 rounded hover:bg-slate-100 transition cursor-pointer ${
              (block.textAlign || block.buttonAlign) === "center" ? "bg-slate-200 text-slate-900" : "text-slate-600"
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ textAlign: "right", buttonAlign: "right" })}
            className={`p-1 rounded hover:bg-slate-100 transition cursor-pointer ${
              (block.textAlign || block.buttonAlign) === "right" ? "bg-slate-200 text-slate-900" : "text-slate-600"
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />
        </div>
      )}

      {/* INLINE FORMATTING BUTTONS */}
      {(block.type === "paragraph" || block.type === "heading" || block.type === "callout" || block.type === "quote") && (
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => applyInlineFormatting("**")}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            title="Bold (**bold**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyInlineFormatting("*")}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            title="Italic (*italic*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => applyInlineFormatting("`")}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            title="Inline Code (`code`)"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-1 rounded hover:bg-slate-100 transition cursor-pointer ${
              showLinkInput ? "bg-indigo-100 text-indigo-700" : "text-slate-700"
            }`}
            title="Add Link"
          >
            <Link className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />
        </div>
      )}

      {/* QUICK INLINE LINK INPUT */}
      {showLinkInput && (
        <div className="flex items-center gap-1 bg-slate-100 rounded px-1.5 py-0.5 border border-slate-200">
          <input
            type="text"
            placeholder="URL or /page-slug"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsertLink()}
            className="text-xs bg-transparent border-none focus:outline-none w-36 px-1"
            autoFocus
          />
          <button
            type="button"
            onClick={handleInsertLink}
            className="p-0.5 text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* INSERT BEFORE / AFTER */}
      <button
        type="button"
        onClick={onAddBefore}
        className="p-1 rounded hover:bg-slate-100 text-slate-600 transition cursor-pointer"
        title="Insert block before"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* DUPLICATE */}
      <button
        type="button"
        onClick={onDuplicate}
        className="p-1 rounded hover:bg-slate-100 text-slate-600 transition cursor-pointer"
        title="Duplicate block"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      {/* DELETE */}
      <button
        type="button"
        onClick={onDelete}
        className="p-1 rounded hover:bg-red-50 text-red-600 transition cursor-pointer"
        title="Delete block"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
