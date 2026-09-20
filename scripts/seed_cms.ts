import fs from "fs";
import path from "path";
import { BLOG_POSTS } from "../src/data/blogData";
import { INITIAL_PAGE_CONTENT } from "../src/data/siteConfig";
import { parseContentToBlocks } from "../src/components/admin/gutenberg/gutenbergConverter";

const STORAGE_ROOT = path.join(process.cwd(), "server_storage");
if (!fs.existsSync(STORAGE_ROOT)) {
  fs.mkdirSync(STORAGE_ROOT, { recursive: true });
}

const POSTS_FILE = path.join(STORAGE_ROOT, "blog_posts.json");
const PAGES_FILE = path.join(STORAGE_ROOT, "pages.json");

console.log("Seeding Blog Posts...");
const seededPosts = BLOG_POSTS.map((post) => {
  const blocks = parseContentToBlocks(post.htmlContent || post.content);
  return {
    ...post,
    blocks,
    content: post.htmlContent || (typeof post.content === "string" ? post.content : ""),
    htmlContent: post.htmlContent || "",
    status: post.status || "published",
    published: true,
    isPublished: true,
    inTrash: false,
    updatedAt: new Date().toISOString(),
  };
});

fs.writeFileSync(POSTS_FILE, JSON.stringify(seededPosts, null, 2), "utf-8");
console.log(`Saved ${seededPosts.length} rich blog posts to ${POSTS_FILE}`);

console.log("Seeding Pages...");

// Privacy content with all 4 detailed legal sections
const privacyContent = `# Privacy Policy & Ephemeral Data Processing

How Scribd Downloader guarantees user privacy, zero user tracking, and data hygiene.

### 1. Zero User Registration
We do not require users to create an account, log in, or submit any personally identifiable information (PII). We do not collect names, passwords, credit card numbers, or physical addresses.

### 2. Ephemeral Document Retention
When a Scribd URL is submitted for conversion, our system fetches page tiles into temporary server memory strictly for the purpose of generating the requested PDF or ZIP file. All temporary files are permanently purged from server disks within 2 hours of generation.

### 3. Analytics & Cookies
We do not use third-party behavioral tracking cookies, canvas fingerprinting, or ad-retargeting pixels. Client-side preferences (such as demo mode toggles or history lists) are stored exclusively in your local browser storage.

### 4. Encryption in Transit
All communication between your browser and our scraping endpoints is protected using industry-standard TLS 1.3 encryption (HTTPS), safeguarding URL parameters from intermediary interception.`;

// Terms content with all 4 detailed legal sections
const termsContent = `# Terms of Service, Fair Use & DMCA Notice

Acceptable use guidelines for our educational document conversion utility.

### 1. Educational & Fair Use Purpose
Scribd Downloader is provided solely for educational study, non-commercial academic research, personal archiving, and offline access to public materials. You agree not to distribute, resell, or publicly republish copyrighted works acquired through this utility.

### 2. User Responsibility
The end user assumes sole responsibility for ensuring that downloading any document complies with local laws, publisher licensing, and terms set forth by copyright holders.

### 3. DMCA & Takedown Policy
We respect intellectual property rights. Copyright holders may submit a notice to request the exclusion of specific document URLs or author IDs from our system engine. To submit a notice, use our Contact page or email dmca@scribddownloader.io.

### 4. Disclaimer of Warranty
This service is provided "as is" without warranty of any kind. We do not guarantee uninterrupted uptime or that every Scribd document format can be extracted.`;

const legalContent = `# Legal, Privacy & Compliance Guidelines

Overview of ethical offline study, copyright compliance, and ephemeral processing standards for Scribd Downloader.

## Transparency & Privacy
Our conversion proxy operates strictly without user accounts or tracking cookies. All rendered document caches are automatically purged within 2 hours.

## DMCA Compliance
If you are a copyright holder wishing to request the exclusion of specific document URLs, please contact dmca@scribddownloader.io with the target URL.`;

const basePages = [
  {
    id: "page-about",
    slug: "about",
    title: "About Scribd Downloader",
    pageKey: "about",
    translationGroupId: "group-page-about",
    language: "en",
    excerpt: "A free tool that saves public Scribd documents as PDFs. No login, no install, no cost.",
    metaTitle: "About Us - Scribd Downloader",
    metaDescription: "Learn more about our mission to make public educational research papers and slide decks easily accessible offline.",
    author: "Minhas Hussain",
    authorName: "Minhas Hussain",
    status: "published",
    inTrash: false,
    content: INITIAL_PAGE_CONTENT.find((p) => p.id === "about-en")?.content || "",
  },
  {
    id: "page-how-it-works",
    slug: "how-it-works",
    title: "How to Download Scribd Documents as PDF",
    pageKey: "how-it-works",
    translationGroupId: "group-page-how-it-works",
    language: "en",
    excerpt: "Three simple steps between you and an offline copy. No account, no software to install.",
    metaTitle: "How It Works - Scribd Downloader",
    metaDescription: "Understand the three-step workflow to download Scribd documents directly to your device without installing software.",
    author: "Minhas Hussain",
    authorName: "Minhas Hussain",
    status: "published",
    inTrash: false,
    content: INITIAL_PAGE_CONTENT.find((p) => p.id === "how-it-works-en")?.content || "",
  },
  {
    id: "page-contact",
    slug: "contact",
    title: "Contact Us & Developer Support",
    pageKey: "contact",
    translationGroupId: "group-page-contact",
    language: "en",
    excerpt: "Questions, broken links, or copyright requests — send us a message.",
    metaTitle: "Contact Us - Scribd Downloader",
    metaDescription: "Get in touch with our team for technical support, feature suggestions, or general inquiries.",
    author: "Admin Team",
    authorName: "Admin Team",
    status: "published",
    inTrash: false,
    content: INITIAL_PAGE_CONTENT.find((p) => p.id === "contact-en")?.content || "",
  },
  {
    id: "page-privacy",
    slug: "privacy",
    title: "Privacy Policy & Ephemeral Data Processing",
    pageKey: "privacy",
    translationGroupId: "group-page-privacy",
    language: "en",
    excerpt: "Review our strict zero-log privacy policy and ephemeral file processing guidelines.",
    metaTitle: "Privacy Policy - Scribd Downloader",
    metaDescription: "Review our strict privacy guidelines: zero user logging, no account requirement, and instant file purge.",
    author: "Legal Dept",
    authorName: "Legal Dept",
    status: "published",
    inTrash: false,
    content: privacyContent,
  },
  {
    id: "page-terms",
    slug: "terms",
    title: "Terms of Service, Fair Use & DMCA Notice",
    pageKey: "terms",
    translationGroupId: "group-page-terms",
    language: "en",
    excerpt: "Review our terms of use, fair usage guidelines, and intellectual property terms.",
    metaTitle: "Terms of Service - Scribd Downloader",
    metaDescription: "Terms of service and fair use guidelines for educational document conversion.",
    author: "Legal Dept",
    authorName: "Legal Dept",
    status: "published",
    inTrash: false,
    content: termsContent,
  },
  {
    id: "page-legal",
    slug: "legal",
    title: "Legal, Privacy & Compliance Guidelines",
    pageKey: "legal",
    translationGroupId: "group-page-legal",
    language: "en",
    excerpt: "DMCA copyright notice, content removal procedure, and legal disclaimer.",
    metaTitle: "Legal & DMCA - Scribd Downloader",
    metaDescription: "DMCA copyright compliance guidelines, content removal procedure, and legal terms.",
    author: "Legal Dept",
    authorName: "Legal Dept",
    status: "published",
    inTrash: false,
    content: legalContent,
  },
];

// Also add available translations from INITIAL_PAGE_CONTENT
const allPages: any[] = [];

basePages.forEach((base) => {
  // Add base page
  const blocks = parseContentToBlocks(base.content);
  allPages.push({
    ...base,
    blocks,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  });

  // Find all translations for this pageKey in INITIAL_PAGE_CONTENT
  const translations = INITIAL_PAGE_CONTENT.filter(
    (p) => p.pageKey === base.pageKey && p.language !== "en"
  );

  translations.forEach((tr) => {
    const trBlocks = parseContentToBlocks(tr.content);
    allPages.push({
      id: `page-${base.slug}-${tr.language}`,
      slug: `${base.slug}-${tr.language}`,
      title: tr.title,
      pageKey: base.pageKey,
      translationGroupId: base.translationGroupId,
      language: tr.language,
      excerpt: tr.subtitle || base.excerpt,
      metaTitle: `${tr.title} - Scribd Downloader`,
      metaDescription: tr.subtitle || base.metaDescription,
      author: base.author,
      authorName: base.authorName,
      status: "published",
      inTrash: false,
      content: tr.content,
      blocks: trBlocks,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });
  });
});

fs.writeFileSync(PAGES_FILE, JSON.stringify(allPages, null, 2), "utf-8");
console.log(`Saved ${allPages.length} rich static pages and translations to ${PAGES_FILE}`);
