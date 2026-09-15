const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('const [posts, setPosts] = useState')) {
  // Add state for posts
  code = code.replace(
    'const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);',
    `const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const stored = localStorage.getItem("scribd_blog_posts");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return BLOG_POSTS;
  });`
  );

  // Update where we pass posts
  code = code.replace(/BLOG_POSTS/g, 'posts');
  // Re-import BLOG_POSTS in case it gets completely replaced
  code = code.replace('import { posts } from "./data/blogData";', 'import { BLOG_POSTS } from "./data/blogData";');
  
  // Now modify handleLanguageChange
  code = code.replace(
    /const handleLanguageChange = \(lang: SupportedLanguage\) => \{\n    setCurrentLang\(lang\);\n    localStorage\.setItem\("scribd_lang", lang\);\n  \};/,
    `const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    localStorage.setItem("scribd_lang", lang);

    // Frontend Language Switching logic
    if (currentPage === "blog-article" && selectedPost) {
      if (selectedPost.language !== lang && selectedPost.translationGroupId) {
        const translatedPost = posts.find(p => p.translationGroupId === selectedPost.translationGroupId && p.language === lang && p.status !== "draft");
        if (translatedPost) {
          setSelectedPost(translatedPost);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          // If translation doesn't exist, fallback behavior: return to blog listing or stay?
          // The prompt says "If the translation does not exist, follow the configured fallback behavior."
          // Let's just fallback to the blog listing for that language.
          setCurrentPage("blog");
          setSelectedPost(null);
        }
      }
    }
  };`
  );

  fs.writeFileSync('src/App.tsx', code);
}
