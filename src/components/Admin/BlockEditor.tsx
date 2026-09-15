import React, { useState } from "react";
import {
  GutenbergBlock,
  GutenbergBlockType,
} from "../../types";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Heading,
  Image,
  Quote,
  AlertCircle,
  Code,
  List,
  Eye,
  Check
} from "lucide-react";

interface BlockEditorProps {
  blocks: GutenbergBlock[];
  onChange: (blocks: GutenbergBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const addBlock = (type: GutenbergBlockType) => {
    const newBlock: GutenbergBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      content: type === "heading" ? "New Section Heading" : type === "callout" ? "Pro Tip: Enter helpful guidance here." : "",
      level: type === "heading" ? 2 : undefined,
      styleVariant: type === "callout" ? "tip" : undefined,
      listItems: type === "list" ? ["First item", "Second item"] : undefined,
      imageUrl: type === "image" ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80" : undefined,
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<GutenbergBlock>) => {
    onChange(
      blocks.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    ) {
      return;
    }
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    onChange(newBlocks);
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs" id="gutenberg-block-editor">
      {/* Editor Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2">
            Add Block:
          </span>
          <button
            type="button"
            onClick={() => addBlock("paragraph")}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <Type className="w-3.5 h-3.5 text-indigo-600" />
            <span>Paragraph</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock("heading")}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <Heading className="w-3.5 h-3.5 text-purple-600" />
            <span>Heading</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock("callout")}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Callout Box</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock("image")}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <Image className="w-3.5 h-3.5 text-emerald-600" />
            <span>Image</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock("quote")}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <Quote className="w-3.5 h-3.5 text-rose-600" />
            <span>Quote</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock("list")}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <List className="w-3.5 h-3.5 text-blue-600" />
            <span>List</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock("code")}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-slate-600" />
            <span>Code</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              activeTab === "edit"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Editor Blocks ({blocks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded-md font-semibold inline-flex items-center gap-1 transition cursor-pointer ${
              activeTab === "preview"
                ? "bg-white text-indigo-600 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 sm:p-6">
        {activeTab === "preview" ? (
          <div className="prose max-w-none space-y-4">
            {blocks.length === 0 && (
              <p className="text-slate-400 italic text-sm">No blocks added yet. Click &apos;Add Block&apos; above.</p>
            )}
            {blocks.map((block) => {
              if (block.type === "heading") {
                const Tag = block.level === 1 ? "h2" : block.level === 3 ? "h4" : "h3";
                return (
                  <Tag key={block.id} className="font-extrabold text-slate-900 mt-4 mb-2">
                    {block.content}
                  </Tag>
                );
              }
              if (block.type === "paragraph") {
                return (
                  <p key={block.id} className="text-slate-700 text-sm leading-relaxed">
                    {block.content}
                  </p>
                );
              }
              if (block.type === "callout") {
                return (
                  <div
                    key={block.id}
                    className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm"
                  >
                    <strong>Note:</strong> {block.content}
                  </div>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={block.id}
                    className="p-4 border-l-4 border-indigo-600 bg-indigo-50/50 rounded-r-xl italic text-slate-800 text-sm"
                  >
                    &ldquo;{block.content}&rdquo;
                    {block.caption && <span className="block mt-1 font-semibold not-italic text-xs text-indigo-700">— {block.caption}</span>}
                  </blockquote>
                );
              }
              if (block.type === "image") {
                return (
                  <div key={block.id} className="my-4">
                    <img
                      src={block.imageUrl}
                      alt={block.caption || "Content image"}
                      className="rounded-xl max-h-80 w-full object-cover border border-slate-200"
                    />
                    {block.caption && (
                      <p className="text-xs text-slate-500 text-center mt-1">{block.caption}</p>
                    )}
                  </div>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={block.id} className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                    {block.listItems?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "code") {
                return (
                  <pre
                    key={block.id}
                    className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto"
                  >
                    <code>{block.content}</code>
                  </pre>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                <Type className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">Gutenberg Block Canvas is Empty</p>
                <p className="text-xs text-slate-400">Click any block type above to construct structured content.</p>
              </div>
            )}

            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="group border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition shadow-2xs space-y-2.5"
              >
                {/* Block Header Controls */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-slate-200/80 px-2 py-0.5 rounded font-bold uppercase text-slate-700">
                      {block.type}
                    </span>
                    <span className="text-[11px] text-slate-400">Block #{index + 1}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveBlock(index, "up")}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 transition cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === blocks.length - 1}
                      onClick={() => moveBlock(index, "down")}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 transition cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(block.id)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Specific Block Fields */}
                {block.type === "heading" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={block.level || 2}
                        onChange={(e) => updateBlock(block.id, { level: Number(e.target.value) as 1 | 2 | 3 })}
                        className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white font-semibold"
                      >
                        <option value={1}>Heading 1 (H1)</option>
                        <option value={2}>Heading 2 (H2)</option>
                        <option value={3}>Heading 3 (H3)</option>
                      </select>
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Enter section heading..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                )}

                {block.type === "paragraph" && (
                  <textarea
                    rows={3}
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    placeholder="Enter paragraph text..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500/10"
                  />
                )}

                {block.type === "callout" && (
                  <div className="space-y-2">
                    <select
                      value={block.styleVariant || "tip"}
                      onChange={(e) => updateBlock(block.id, { styleVariant: e.target.value as any })}
                      className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="tip">Tip Box</option>
                      <option value="info">Info Box</option>
                      <option value="warning">Warning Box</option>
                    </select>
                    <textarea
                      rows={2}
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder="Enter callout note or tip..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                )}

                {block.type === "quote" && (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder="Enter quote..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm italic bg-white"
                    />
                    <input
                      type="text"
                      value={block.caption || ""}
                      onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                      placeholder="Author / Citation..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                )}

                {block.type === "image" && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={block.imageUrl || ""}
                      onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... (Image URL)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                    <input
                      type="text"
                      value={block.caption || ""}
                      onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                      placeholder="Caption / Alt text..."
                      className="w-full px-3 py-1 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                )}

                {block.type === "list" && (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={(block.listItems || []).join("\n")}
                      onChange={(e) => updateBlock(block.id, { listItems: e.target.value.split("\n").filter(Boolean) })}
                      placeholder="One item per line..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                    />
                    <span className="text-[10px] text-slate-400">Enter each list bullet item on a separate line.</span>
                  </div>
                )}

                {block.type === "code" && (
                  <textarea
                    rows={3}
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    placeholder="Enter code snippet..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs text-slate-900 bg-white"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
