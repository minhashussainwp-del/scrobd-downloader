import { SupportedLanguage } from "../../../types";

export type BlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "quote"
  | "callout"
  | "list"
  | "table"
  | "faq"
  | "columns"
  | "button"
  | "ad"
  | "code"
  | "html"
  | "divider"
  | "spacer";

export interface GutenbergEditorBlock {
  id: string;
  type: BlockType;
  content: string;
  // Heading specific
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  textAlign?: "left" | "center" | "right";
  anchor?: string;
  // Image specific
  imageUrl?: string;
  altText?: string;
  caption?: string;
  imageAlign?: "left" | "center" | "right" | "wide" | "full";
  width?: number;
  height?: number;
  // Quote specific
  citation?: string;
  quoteVariant?: "standard" | "large" | "bordered";
  // Callout specific
  styleVariant?: "info" | "warning" | "success" | "tip" | "note";
  calloutTitle?: string;
  // List specific
  listType?: "unordered" | "ordered";
  listItems?: string[];
  // Table specific
  hasHeader?: boolean;
  tableHeaders?: string[];
  tableRows?: string[][];
  tableCaption?: string;
  // FAQ specific
  faqItems?: Array<{ question: string; answer: string }>;
  includeFaqSchema?: boolean;
  // Columns specific
  columnLayout?: "50-50" | "30-70" | "70-30" | "33-33-33";
  columns?: string[];
  // Button specific
  buttonText?: string;
  buttonUrl?: string;
  buttonVariant?: "primary" | "secondary" | "outline";
  buttonAlign?: "left" | "center" | "right";
  buttonNewTab?: boolean;
  // Ad specific
  adSlot?: "in-feed" | "below-hero" | "sidebar" | "article-mid";
  adCode?: string;
  adLabel?: string;
  // Code specific
  codeLanguage?: string;
  // Spacer specific
  spacerHeight?: number;
  // Advanced styling
  customClassName?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: "small" | "normal" | "medium" | "large" | "huge";
}

export interface BlockCategory {
  id: string;
  name: string;
  iconName: string;
}

export interface BlockPattern {
  id: string;
  title: string;
  category: "headers" | "content" | "callouts" | "features" | "faq";
  description: string;
  blocks: Omit<GutenbergEditorBlock, "id">[];
}

export interface DocumentStats {
  words: number;
  characters: number;
  readingTimeMin: number;
  headingsCount: number;
  paragraphsCount: number;
  imagesCount: number;
  blocksCount: number;
}
