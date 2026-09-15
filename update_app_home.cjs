const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<BlogPreviewSection[\s\S]*?\/>/g, '');
code = code.replace(/<FaqSection \/>/g, '');

fs.writeFileSync('src/App.tsx', code);
