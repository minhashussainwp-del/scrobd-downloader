const fs = require('fs');
let code = fs.readFileSync('src/data/siteConfig.ts', 'utf8');

code = code.replace(
  'const PAGE_CONTENT_KEY = "scribd_page_content_v1";',
  'const PAGE_CONTENT_KEY = "scribd_page_content_v2";'
);

fs.writeFileSync('src/data/siteConfig.ts', code);
