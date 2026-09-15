const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<FeaturesSection \/>/g, '');
code = code.replace(/<HowItWorksSection onTryNow=\{handleCtaClick\} \/>/g, '');

fs.writeFileSync('src/App.tsx', code);
