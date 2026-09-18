import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { handleImageError } from "../utils/imageFallback";

interface ModernArticleRendererProps {
  content: string;
}

function hasNestedBlockOrImage(node: any): boolean {
  if (!node) return false;
  if (
    node.type === "element" &&
    ["img", "figure", "div", "table", "blockquote", "pre", "hr"].includes(node.tagName)
  ) {
    return true;
  }
  if (Array.isArray(node.children)) {
    return node.children.some(hasNestedBlockOrImage);
  }
  return false;
}

export function ModernArticleRenderer({ content }: ModernArticleRendererProps) {
  return (
    <div className="modern-article prose-custom max-w-none text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              {...props}
              className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight mt-10 mb-5 leading-tight"
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              {...props}
              className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-10 mb-4 leading-snug"
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              {...props}
              className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-8 mb-3 leading-snug"
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              {...props}
              className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-6 mb-2"
            />
          ),
          p: ({ node, children, ...props }: any) => {
            if (hasNestedBlockOrImage(node)) {
              return <div className="my-5">{children}</div>;
            }
            return (
              <p
                {...props}
                className="text-slate-700 text-base sm:text-lg leading-relaxed my-5 font-normal"
              >
                {children}
              </p>
            );
          },
          ul: ({ node, ...props }) => (
            <ul
              {...props}
              className="list-disc pl-6 my-5 space-y-2.5 text-slate-700 text-base sm:text-lg"
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              {...props}
              className="list-decimal pl-6 my-5 space-y-2.5 text-slate-700 text-base sm:text-lg"
            />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="leading-relaxed pl-1 text-slate-700 text-base sm:text-lg" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-bold text-slate-900" />
          ),
          em: ({ node, ...props }) => (
            <em {...props} className="italic text-slate-600" />
          ),
          hr: () => (
            <hr className="my-8 border-slate-200" />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-indigo-500 bg-indigo-50/40 py-4 px-6 rounded-r-2xl my-6 text-slate-700 italic text-base sm:text-lg"
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
              <table
                {...props}
                className="w-full text-left text-base text-slate-700 divide-y divide-slate-200 border-collapse"
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead
              {...props}
              className="bg-slate-50 text-slate-900 text-sm font-bold uppercase tracking-wider"
            />
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="px-4 py-3.5 border-b border-slate-200 font-bold whitespace-nowrap text-sm sm:text-base"
            />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} className="divide-y divide-slate-100 bg-white" />
          ),
          td: ({ node, ...props }) => (
            <td
              {...props}
              className="px-4 py-3.5 text-base text-slate-700 align-top"
            />
          ),
          tr: ({ node, ...props }) => (
            <tr {...props} className="hover:bg-slate-50/60 transition" />
          ),
          img: ({ node, ...props }) => (
            <figure className="my-6">
              <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-2xs">
                <img
                  {...props}
                  className="w-full h-auto object-cover max-h-[500px]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
              </div>
              {props.alt && (
                <figcaption className="text-center text-xs text-slate-500 mt-2.5 font-medium">
                  {props.alt}
                </figcaption>
              )}
            </figure>
          ),
          pre: ({ node, ...props }) => (
            <pre
              className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto my-4"
              {...props}
            />
          ),
          code: ({ node, className, children, ...props }: any) => {
            const isBlock = Boolean(className) || (node?.position && node.position.start.line !== node.position.end.line);
            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono text-xs font-semibold"
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-indigo-300 hover:decoration-indigo-600 transition"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
