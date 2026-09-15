const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Import HomeContent
if (!app.includes('import { HomeContent }')) {
  app = app.replace(
    'import { Footer } from "./components/Footer";',
    'import { Footer } from "./components/Footer";\nimport { HomeContent } from "./components/HomeContent";'
  );
}

// Replace <PageContentBlock pageId="home" /> with <HomeContent />
app = app.replace(
  /<PageContentBlock\s+pageId="home"[\s\S]*?\/>/g,
  '<HomeContent onNavigate={handleNavigate} posts={posts} onSelectPost={handleSelectPost} />'
);

// We need to also remove `HowItWorksSection` and `FeaturesSection` rendering if they were in `currentPage === "home"`
app = app.replace(/<HowItWorksSection[\s\S]*?\/>/g, '');
app = app.replace(/<FeaturesSection[\s\S]*?\/>/g, '');
app = app.replace(/<BlogPreviewSection[\s\S]*?\/>/g, '');
app = app.replace(/<FaqSection[\s\S]*?\/>/g, '');

fs.writeFileSync('src/App.tsx', app);
