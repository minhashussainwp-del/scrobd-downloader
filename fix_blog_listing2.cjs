const fs = require('fs');

// 1. Update BlogListingPage.tsx
let listingCode = fs.readFileSync('src/pages/BlogListingPage.tsx', 'utf8');
listingCode = listingCode.replace('import { BlogPost, PageRoute } from "../types";', 'import { BlogPost, PageRoute, SupportedLanguage } from "../types";');
listingCode = listingCode.replace(
  'interface BlogListingPageProps {\n  posts: BlogPost[];', 
  'interface BlogListingPageProps {\n  posts: BlogPost[];\n  currentLang?: SupportedLanguage;'
);
listingCode = listingCode.replace(
  '}: BlogListingPageProps) {',
  '  currentLang = "en",\n}: BlogListingPageProps) {'
);
listingCode = listingCode.replace(
  'const featuredPost = posts.find((p) => p.featured);',
  'const publishedPosts = posts.filter(p => p.status !== "draft" && (p.language === currentLang || !p.language));\n  const featuredPost = publishedPosts.find((p) => p.featured) || publishedPosts[0];'
);
listingCode = listingCode.replace(
  'const regularPosts = posts.filter((p) => !p.featured);',
  'const regularPosts = publishedPosts.filter((p) => p.id !== featuredPost?.id);'
);
fs.writeFileSync('src/pages/BlogListingPage.tsx', listingCode);

// 2. Update App.tsx to pass currentLang
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  '<BlogListingPage\n              posts={posts}\n              onSelectPost={handleSelectPost}\n              onNavigate={handleNavigate}\n            />',
  '<BlogListingPage\n              posts={posts}\n              currentLang={currentLang}\n              onSelectPost={handleSelectPost}\n              onNavigate={handleNavigate}\n            />'
);
fs.writeFileSync('src/App.tsx', appCode);

