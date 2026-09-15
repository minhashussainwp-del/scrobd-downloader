const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

// Replace the modal part
code = code.replace(
  /\{\/\* Pre-Download Interstitial Modal[\s\S]*?\}\)/g,
  ''
);

fs.writeFileSync('src/components/HeroSection.tsx', code);
