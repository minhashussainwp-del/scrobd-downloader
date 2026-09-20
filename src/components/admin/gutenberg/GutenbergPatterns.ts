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
];
