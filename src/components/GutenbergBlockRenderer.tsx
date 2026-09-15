import React from "react";
import { GutenbergBlock } from "../types";
import { Info, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

interface GutenbergBlockRendererProps {
  blocks: GutenbergBlock[];
}

export function GutenbergBlockRenderer({ blocks }: GutenbergBlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "heading": {
            const sizeClass =
              block.level === 1
                ? "text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4"
                : block.level === 3
                ? "text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-6 mb-3"
                : "text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4";

            if (block.level === 1) {
              return (
                <h1 key={block.id} className={sizeClass}>
                  {block.content}
                </h1>
              );
            }
            if (block.level === 3) {
              return (
                <h3 key={block.id} className={sizeClass}>
                  {block.content}
                </h3>
              );
            }
            return (
              <h2 key={block.id} className={sizeClass}>
                {block.content}
              </h2>
            );
          }

          case "paragraph":
            return (
              <p
                key={block.id}
                className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal"
              >
                {block.content}
              </p>
            );

          case "quote":
            return (
              <blockquote
                key={block.id}
                className="p-4 sm:p-6 rounded-2xl bg-indigo-50/50 border-l-4 border-indigo-600 my-6 italic text-slate-800 space-y-2"
              >
                <p className="text-base sm:text-lg font-serif leading-relaxed">
                  “{block.content}”
                </p>
                {block.caption && (
                  <cite className="block text-xs font-semibold text-indigo-700 not-italic">
                    — {block.caption}
                  </cite>
                )}
              </blockquote>
            );

          case "callout": {
            const variant = block.styleVariant || "tip";
            const bgClass =
              variant === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-950"
                : variant === "note" || variant === "info"
                ? "bg-slate-100 border-slate-200 text-slate-900"
                : "bg-indigo-50/80 border-indigo-200 text-indigo-950";

            const Icon =
              variant === "warning"
                ? AlertTriangle
                : variant === "note" || variant === "info"
                ? Info
                : Lightbulb;

            return (
              <div
                key={block.id}
                className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm my-5 ${bgClass}`}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5 text-indigo-600" />
                <div className="leading-relaxed">{block.content}</div>
              </div>
            );
          }

          case "image":
            return (
              <figure key={block.id} className="my-8 space-y-2">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src={block.imageUrl}
                    alt={block.caption || "Article illustration"}
                    className="w-full h-auto object-cover max-h-[460px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-xs text-slate-500 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "list":
            return (
              <ul
                key={block.id}
                className="space-y-2 list-disc list-inside text-sm sm:text-base text-slate-700 my-4 pl-2"
              >
                {(block.listItems || []).map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "code":
            return (
              <pre
                key={block.id}
                className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 my-4"
              >
                <code>{block.content}</code>
              </pre>
            );

          case "divider":
            return <hr key={block.id} className="border-slate-200 my-8" />;

          default:
            return (
              <p key={block.id} className="text-base text-slate-700">
                {block.content}
              </p>
            );
        }
      })}
    </div>
  );
}
