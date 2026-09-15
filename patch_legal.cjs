const fs = require('fs');
let code = fs.readFileSync('src/pages/LegalPage.tsx', 'utf8');

code = code.replace(
  'import { PageRoute } from "../types";',
  'import { PageRoute } from "../types";\nimport { loadPageContent } from "../data/siteConfig";\nimport { useState, useEffect } from "react";'
);

code = code.replace(
  'export function LegalPage({ initialTab = "privacy", onNavigate }: LegalPageProps) {',
  'export function LegalPage({ initialTab = "privacy", onNavigate }: LegalPageProps) {\n  const [legalContent, setLegalContent] = useState("");\n  useEffect(() => {\n    const contents = loadPageContent();\n    const legal = contents.find(c => c.id === "legal");\n    if (legal) setLegalContent(legal.content);\n  }, []);'
);

code = code.replace(
  '<p className="text-xs text-slate-500 mt-1">\n                    How Scribd PDF Downloader guarantees user privacy and data hygiene.\n                  </p>\n                </div>',
  '<p className="text-xs text-slate-500 mt-1">\n                    How Scribd PDF Downloader guarantees user privacy and data hygiene.\n                  </p>\n                </div>\n                {legalContent && (\n                  <div className="mb-6 pb-6 border-b border-slate-100 whitespace-pre-wrap">{legalContent}</div>\n                )}'
);

fs.writeFileSync('src/pages/LegalPage.tsx', code);
