const fs = require('fs');

const code = `import React, { useState, useEffect, useMemo } from "react";
import { loadPageContent } from "../data/siteConfig";

interface PageContentBlockProps {
  pageId: string;
}

export function PageContentBlock({ pageId }: PageContentBlockProps) {
  const [content, setContent] = useState({ title: "", content: "" });

  useEffect(() => {
    const contents = loadPageContent();
    const found = contents.find((c) => c.id === pageId);
    if (found) {
      setContent(found);
    }
  }, [pageId]);

  const toc = useMemo(() => {
    return content.content
      .split("\\n\\n")
      .filter(p => p.startsWith('## '))
      .map(p => p.replace('## ', ''));
  }, [content.content]);

  if (!content.title && !content.content) return null;

  let h2Counter = 0;

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {content.title && (
          <div className="text-center mb-12 sm:mb-20 max-w-3xl mx-auto">
             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.15]">
               {content.title}
             </h1>
             <div className="w-20 h-1.5 bg-indigo-600 rounded-full mx-auto shadow-sm"></div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8">
            <article className="max-w-none">
              <div className="space-y-6 sm:space-y-8 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                {content.content.split("\\n\\n").map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    const id = \`section-\${h2Counter}\`;
                    h2Counter++;
                    return (
                      <h2 key={index} id={id} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-16 mb-6 tracking-tight border-b border-slate-100 pb-5 scroll-mt-24">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={index} className="list-none space-y-4 my-8 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-100/80">
                        {paragraph.split('\\n').map((li, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 shrink-0 shadow-sm"></span>
                            <span dangerouslySetInnerHTML={{__html: li.replace('- ', '').replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="font-bold text-slate-900">$1</strong>')}} />
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  
                  return (
                    <div key={index} className="leading-loose">
                      <span dangerouslySetInnerHTML={{__html: paragraph.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="font-bold text-slate-900">$1</strong>')}} />
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-7 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Table of Contents
                </h4>
                <ul className="space-y-4">
                  {toc.map((item, i) => (
                     <li key={i}>
                        <a href={\`#section-\${i}\`} className="text-[15px] text-slate-600 hover:text-indigo-600 transition-colors font-semibold flex items-start gap-3 leading-snug">
                           <span className="text-indigo-300 shrink-0">•</span>
                           <span>{item}</span>
                        </a>
                     </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-8 border-t border-slate-200/60">
                  <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                     <h5 className="text-lg font-bold mb-2 text-white">Extract Documents Fast</h5>
                     <p className="text-sm text-indigo-200 mb-5 leading-relaxed">Join thousands of students and researchers saving presentations safely offline.</p>
                     <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-full py-3 bg-white text-indigo-900 rounded-xl text-sm font-extrabold shadow hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                       </svg>
                       Go to Downloader
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('src/components/PageContentBlock.tsx', code);
