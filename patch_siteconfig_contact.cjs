const fs = require('fs');
let code = fs.readFileSync('src/data/siteConfig.ts', 'utf8');

code = code.replace(
  '{\n    id: "legal",',
  '{\n    id: "contact",\n    title: "Contact & Support",\n    content: "Our engineering team is here to help with any issues you encounter while using the Scribd PDF Downloader. Whether you are facing problems downloading a specific document, have a feature request, or want to report a bug, please reach out to us using the form below. We typically respond within 24-48 hours."\n  },\n  {\n    id: "legal",'
);

fs.writeFileSync('src/data/siteConfig.ts', code);
