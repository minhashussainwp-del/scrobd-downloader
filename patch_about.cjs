const fs = require('fs');
let code = fs.readFileSync('src/pages/AboutPage.tsx', 'utf8');

code = code.replace(
  'Scribd PDF Downloader was built to bridge the gap between web-only document platforms and offline reading tools like e-ink tablets, laptops, and academic binders.',
  '{aboutContent || "Scribd PDF Downloader was built to bridge the gap between web-only document platforms and offline reading tools like e-ink tablets, laptops, and academic binders."}'
);

fs.writeFileSync('src/pages/AboutPage.tsx', code);
