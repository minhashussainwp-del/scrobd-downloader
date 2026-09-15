const fs = require('fs');
let code = fs.readFileSync('src/data/siteConfig.ts', 'utf8');

const newHomeContent = `Our platform provides the easiest and fastest way to download Scribd documents, academic research, and presentations completely free. No registration is required. We understand that accessing educational materials offline is crucial for students, researchers, and professionals. Unlike other tools that make you wait or require paid subscriptions, our smart engine compiles full, high-resolution PDF documents instantly.

## How It Works in 3 Simple Steps

No technical skills or complicated software installations needed. Turn any web presentation into a portable PDF in under 10 seconds.

### 1. Paste Scribd Document Link
Copy the web address of any public Scribd document, report, or slide deck and paste it into the downloader input field above. Our system automatically detects the format and sanitizes tracking parameters.

### 2. Fetch & Preview Pages
Our high-speed conversion engine processes the document data instantly. You can inspect high-resolution page thumbnails and verify the document contents before committing to a full download, saving you time and cellular data.

### 3. Instant Lossless PDF Download
Receive your compiled standard high-resolution PDF document with instant direct streaming. Download pure vector PDF files with universal compatibility across Kindle, iPad, and PC without any artificial waiting lag.

## Engineered for Crisp, Effortless Document Extraction

Everything you need to convert research papers, book chapters, and slide decks into permanent offline reading formats.

### Fast PDF Processing
Our high-speed conversion engine processes complex multi-page slide decks and whitepapers in seconds without artificial wait times. 

### Easy Clipboard Paste
One-click clipboard detection pastes your Scribd document link instantly, auto-sanitizing tracking parameters and redirects.

### 100% Mobile Friendly
Optimized touch targets, clean fluid layouts, and lightweight memory footprint designed specifically for phones and tablets.

### Private & Secure Processing
No account registration or personal details required. All compiled temporary files are permanently purged within 2 hours.`;

// Replace the old home content string. We need to be careful with escaping.
code = code.replace(
  /"Our platform provides the easiest and fastest way to download Scribd documents.*?"/,
  JSON.stringify(newHomeContent)
);

code = code.replace(
  /title: "Why Use Our Free Scribd PDF Downloader\?"/,
  'title: "The Ultimate Free Scribd PDF Downloader"'
);

fs.writeFileSync('src/data/siteConfig.ts', code);
