const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  'export interface BlogPost {',
  `export interface BlogPost {
  language?: SupportedLanguage;
  translationGroupId?: string;
  status?: "published" | "draft";
  htmlContent?: string;`
);

fs.writeFileSync('src/types.ts', code);
