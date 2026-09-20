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

          case "list": {
            const isOrdered = (block as any).listType === "ordered";
            const ListTag = isOrdered ? "ol" : "ul";
            const listClass = isOrdered
              ? "space-y-2 list-decimal list-inside text-sm sm:text-base text-slate-700 my-4 pl-2"
              : "space-y-2 list-disc list-inside text-sm sm:text-base text-slate-700 my-4 pl-2";
            return (
              <ListTag key={block.id} className={listClass}>
                {(block.listItems || []).map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ListTag>
            );
          }

          case "table": {
            const b = block as any;
            const headers: string[] = b.tableHeaders || [];
            const rows: string[][] = b.tableRows || [];
            return (
              <div key={block.id} className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-sm text-slate-700 divide-y divide-slate-200">
                  {b.hasHeader !== false && headers.length > 0 && (
                    <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-xs">
                      <tr>
                        {headers.map((h, i) => (
                          <th key={i} className="px-4 py-3 border-r border-slate-200 last:border-r-0">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 border-r border-slate-100 last:border-r-0">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "faq": {
            const b = block as any;
            const items: Array<{ question: string; answer: string }> = b.faqItems || [];
            return (
              <div key={block.id} className="my-8 space-y-3">
                {items.map((item, i) => (
                  <details
                    key={i}
                    className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition"
                  >
                    <summary className="p-4 font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none flex items-center justify-between hover:bg-slate-100/70 transition select-none">
                      <span>{item.question}</span>
                      <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs font-mono">
                        ▼
                      </span>
                    </summary>
                    <div className="px-4 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            );
          }

          case "columns": {
            const b = block as any;
            const cols: string[] = b.columns || [];
            const layout = b.columnLayout || "50-50";
            const gridClass =
              layout === "30-70"
                ? "grid-cols-1 md:grid-cols-3"
                : layout === "70-30"
                ? "grid-cols-1 md:grid-cols-3"
                : layout === "33-33-33"
                ? "grid-cols-1 md:grid-cols-3"
                : "grid-cols-1 md:grid-cols-2";

            return (
              <div key={block.id} className={`grid ${gridClass} gap-6 my-6`}>
                {cols.map((col, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                    {col}
                  </div>
                ))}
              </div>
            );
          }

          case "button": {
            const b = block as any;
            const align = b.buttonAlign || "left";
            return (
              <div key={block.id} className={`my-6 text-${align}`}>
                <a
                  href={b.buttonUrl || "#"}
                  target={b.buttonNewTab ? "_blank" : undefined}
                  rel={b.buttonNewTab ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition"
                >
                  {b.buttonText || "Click Here"}
                </a>
              </div>
            );
          }

          case "ad": {
            const b = block as any;
            return (
              <div
                key={block.id}
                className="my-8 p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-500 space-y-1"
              >
                <span className="font-semibold uppercase tracking-wider block text-slate-400 text-[10px]">
                  Advertisement — {b.adLabel || b.adSlot || "Sponsor"}
                </span>
                {b.adCode ? (
                  <div dangerouslySetInnerHTML={{ __html: b.adCode }} />
                ) : (
                  <div className="py-4 text-slate-400">Sponsored editorial unit placeholder</div>
                )}
              </div>
            );
          }

          case "spacer": {
            const b = block as any;
            return <div key={block.id} style={{ height: `${b.spacerHeight || 32}px` }} aria-hidden="true" />;
          }

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
