const fs = require('fs');
let code = fs.readFileSync('src/components/PageContentBlock.tsx', 'utf8');

code = code.replace(
  /<p key=\{index\} className="mb-4 leading-relaxed">([^]*?)<\/p>/g,
  '<div key={index} className="mb-4 leading-relaxed">$1</div>'
);

fs.writeFileSync('src/components/PageContentBlock.tsx', code);
