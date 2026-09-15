const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'import { HeroSection } from "./components/HeroSection";',
  'import { HeroSection } from "./components/HeroSection";\nimport { PageContentBlock } from "./components/PageContentBlock";'
);

code = code.replace(
  '<HeroSection\n                url={url}',
  '<HeroSection\n                url={url}'
); // Just checking match

code = code.replace(
  'currentLang={currentLang}\n              />\n              <FeaturesSection />',
  'currentLang={currentLang}\n              />\n              <PageContentBlock pageId="home" />\n              <FeaturesSection />'
);

fs.writeFileSync('src/App.tsx', code);
