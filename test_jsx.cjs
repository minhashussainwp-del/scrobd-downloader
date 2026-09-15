const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
try {
  require('@babel/parser').parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
} catch (e) {
  console.log(e);
}
