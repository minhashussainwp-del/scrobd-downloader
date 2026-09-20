import { BlockPattern } from "./types";

export const GUTENBERG_PATTERNS: BlockPattern[] = [
  {
    id: "pattern-article-intro",
    title: "Article Lead & Key Takeaways",
    category: "content",
    description: "Compelling lead paragraph followed by a highlighted key takeaways callout block.",
    blocks: [
      {
        type: "paragraph",
        content:
          "Welcome to this in-depth guide. Below you will find step-by-step instructions on converting Scribd documents into high-resolution, print-ready PDF files safely and without installing third-party software.",
        textAlign: "left",
      },
      {
        type: "callout",
        content:
          "• Always verify document title and page visibility before initiating conversion.\n• Cloud compilation preserves high-res vector typography and embedded diagrams.\n• Downloaded files land directly in your device's default downloads directory.",
        calloutTitle: "Key Takeaways",
        styleVariant: "info",
      },
    ],
  },
  {
    id: "pattern-step-by-step",
    title: "Step-by-Step Procedure",
    category: "content",
    description: "Numbered workflow section with step explanation and tip note.",
    blocks: [
      {
        type: "heading",
        content: "Step 1: Copy the Document URL",
        level: 2,
        textAlign: "left",
      },
      {
        type: "paragraph",
        content:
          "Navigate to the target Scribd document page in your browser. Highlight the full URL in the address bar (e.g., https://www.scribd.com/document/12345/Title) and copy it to your clipboard.",
        textAlign: "left",
      },
      {
        type: "list",
        content: "",
        listType: "ordered",
        listItems: [
          "Open the document's direct landing page (avoid search query pages)",
          "Verify the title is displayed clearly",
          "Copy the address bar link (Ctrl+C or Cmd+C)",
        ],
      },
      {
        type: "callout",
        content:
          "Avoid shortened social share links or search result URLs. The downloader works best with direct canonical document links.",
        calloutTitle: "Pro Tip",
        styleVariant: "tip",
      },
    ],
  },
  {
    id: "pattern-faq-section",
    title: "Comprehensive FAQ Accordion",
    category: "faq",
    description: "4 structured FAQ accordion items with JSON-LD schema support.",
    blocks: [
      {
        type: "heading",
        content: "Frequently Asked Questions",
        level: 2,
        textAlign: "left",
      },
      {
        type: "faq",
        content: "",
        includeFaqSchema: true,
        faqItems: [
          {
            question: "Is this Scribd downloader free to use?",
            answer:
              "Yes, our downloader tool is 100% free with no registration, subscription, or software installation required.",
          },
          {
            question: "What document formats are supported?",
            answer:
              "The system compiles public documents and presentations into unified PDF files or individual high-resolution JPG image archives.",
          },
          {
            question: "Does this store or keep a copy of my documents?",
            answer:
              "No. We enforce a strict zero-log ephemeral processing policy. All compiled buffers are automatically purged from memory immediately after download.",
          },
          {
            question: "Can I download documents on mobile devices?",
            answer:
              "Yes, the web application runs smoothly in Safari on iOS and Chrome on Android without any extra apps.",
          },
        ],
      },
    ],
  },
  {
    id: "pattern-two-column-features",
    title: "Two-Column Feature Comparison",
    category: "features",
    description: "Side-by-side comparison columns for advantages and requirements.",
    blocks: [
      {
        type: "heading",
        content: "Comparison & Performance Features",
        level: 2,
        textAlign: "left",
      },
      {
        type: "columns",
        content: "",
        columnLayout: "50-50",
        columns: [
          "### ⚡ High-Speed Extraction\n- Sub-second metadata parsing\n- Direct stream assembly\n- Parallel slide asset fetching",
          "### 🛡️ Privacy & Reliability\n- Zero retention policy\n- No user accounts required\n- 99.8% compilation uptime",
        ],
      },
    ],
  },
  {
    id: "pattern-download-cta",
    title: "Download Call-to-Action Card",
    category: "callouts",
    description: "High-visibility action box with title, description, and primary button.",
    blocks: [
      {
        type: "callout",
        content:
          "Ready to download your academic papers, research decks, or sheet music? Paste your link on the homepage to begin instant PDF conversion.",
        calloutTitle: "Start Downloading Now",
        styleVariant: "success",
      },
      {
        type: "button",
        content: "",
        buttonText: "Go to Free Downloader →",
        buttonUrl: "/",
        buttonVariant: "primary",
        buttonAlign: "center",
      },
    ],
  },
  {
    id: "pattern-infeed-ad",
    title: "In-Feed Ad Placement Slot",
    category: "features",
    description: "Standardized ad unit placeholder for sponsored messages or monetization.",
    blocks: [
      {
        type: "ad",
        content: "",
        adSlot: "in-feed",
        adLabel: "In-Feed Editorial Sponsor",
        adCode: "<!-- Ad Network Responsive Unit -->",
      },
    ],
  },
  {
    id: "pattern-homepage-hero",
    title: "Interactive Downloader Hero",
    category: "headers",
    description: "Full-width hero header with pill badge, URL input mockup, and security guarantees.",
    blocks: [
      {
        type: "hero",
        content: "Scribd Downloader – Free PDF Downloads",
        heroBadge: "100% Free & Secure Scribd PDF Converter",
        heroTitle: "Scribd Downloader – Free PDF Downloads",
        heroSubtitle:
          "Save documents, research papers, and slide decks from Scribd as clean, readable PDFs. Paste the link, get the file — no account needed, no waitlist.",
        ctaText: "Download PDF",
        placeholderText: "Paste Scribd document link here (e.g. scribd.com/document/12345678/...)",
        qualityBadgeText: "High Resolution 300 DPI",
        autoDownloadBadgeText: "Direct Browser Save",
        checklistItems: [
          "No account or login required",
          "Full document pages preserved",
          "100% Free & Private — zero logs",
        ],
      },
    ],
  },
  {
    id: "pattern-how-it-works-grid",
    title: "How It Works (3 Steps Grid)",
    category: "features",
    description: "Visual 3-step numbered workflow cards with icons and descriptions.",
    blocks: [
      {
        type: "steps",
        content: "How to Download Scribd Documents",
        sectionTitle: "How to Download Scribd Documents",
        sectionSubtitle: "Three simple steps to save any public Scribd document as a PDF in seconds.",
        steps: [
          {
            stepNumber: 1,
            title: "Copy the Document Link",
            description: "Open the document on Scribd and copy the clean URL directly from your browser address bar.",
          },
          {
            stepNumber: 2,
            title: "Paste into the Downloader",
            description: "Paste the copied URL into the input field above and click 'Download PDF'.",
          },
          {
            stepNumber: 3,
            title: "Save Your File",
            description: "The engine renders high-resolution pages and saves the clean PDF straight to your device.",
          },
        ],
      },
    ],
  },
  {
    id: "pattern-features-grid",
    title: "Features & Benefits (4-Card Grid)",
    category: "features",
    description: "4-column feature highlights showcasing speed, safety, compatibility, and free access.",
    blocks: [
      {
        type: "features",
        content: "Why Use Our Scribd Downloader?",
        sectionTitle: "Why Use Our Scribd Downloader?",
        sectionSubtitle: "Engineered for speed, privacy, and flawless document formatting.",
        features: [
          {
            title: "Instant Page Processing",
            description: "High-speed parallel rendering delivers your complete PDF in seconds without throttling.",
            badge: "Fast",
          },
          {
            title: "Complete Privacy Guaranteed",
            description: "We never store files, capture personal data, or ask for login credentials.",
            badge: "Safe",
          },
          {
            title: "All Devices Supported",
            description: "Works seamlessly on Android, iPhone, iPad, Windows, macOS, and Linux without any app install.",
            badge: "Universal",
          },
          {
            title: "Zero Hidden Costs",
            description: "Unlimited free document downloads. No subscriptions, trials, or credit cards required.",
            badge: "100% Free",
          },
        ],
      },
    ],
  },
  {
    id: "pattern-complete-homepage",
    title: "Complete Homepage Template",
    category: "headers",
    description: "Full ready-to-use homepage with Hero Downloader, Steps, Benefits, and Article guide.",
    blocks: [
      {
        type: "hero",
        content: "Scribd Downloader – Free PDF Downloads",
        heroBadge: "100% Free & Secure Scribd PDF Converter",
        heroTitle: "Scribd Downloader – Free PDF Downloads",
        heroSubtitle: "Save documents, research papers, and slide decks from Scribd as clean, readable PDFs.",
        ctaText: "Download PDF",
        placeholderText: "Paste Scribd document link here...",
        qualityBadgeText: "High Resolution 300 DPI",
        autoDownloadBadgeText: "Direct Browser Save",
        checklistItems: ["No login required", "Full document pages preserved", "100% Free & Private"],
      },
      {
        type: "steps",
        content: "How to Download Scribd Documents",
        sectionTitle: "How to Download Scribd Documents",
        sectionSubtitle: "Three simple steps to save any public Scribd document as a PDF in seconds.",
        steps: [
          { stepNumber: 1, title: "Copy the Link", description: "Copy the Scribd document URL." },
          { stepNumber: 2, title: "Paste URL", description: "Paste into the box above and click download." },
          { stepNumber: 3, title: "Get Your PDF", description: "Save the document straight to your device." },
        ],
      },
      {
        type: "features",
        content: "Why Use Our Downloader?",
        sectionTitle: "Why Use Our Downloader?",
        sectionSubtitle: "Engineered for speed, privacy, and flawless document formatting.",
        features: [
          { title: "Fast Processing", description: "Parallel rendering delivers PDF in seconds.", badge: "Fast" },
          { title: "100% Private", description: "Zero logs or stored files.", badge: "Safe" },
          { title: "Universal", description: "Works on all phones and computers.", badge: "Universal" },
          { title: "100% Free", description: "No subscription or credit card needed.", badge: "Free" },
        ],
      },
      {
        type: "heading",
        content: "The Complete Guide to Downloading Scribd Documents",
        level: 2,
      },
      {
        type: "paragraph",
        content:
          "Scribd is one of the world's largest digital libraries, hosting millions of user-uploaded presentations, academic studies, case analyses, and textbooks. Our free web tool allows researchers and students to compile publicly readable pages into standard, offline-accessible PDF documents seamlessly.",
      },
    ],
  },
];
