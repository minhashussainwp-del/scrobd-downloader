import { GutenbergEditorBlock, BlockType } from "./types";

function generateBlockId(): string {
  return "b-" + Math.random().toString(36).substring(2, 9) + "-" + Date.now().toString(36);
}

/**
 * Parses existing raw content (Markdown, HTML, or structured JSON) or existing blocks array
 * into a rich, structured GutenbergEditorBlock[]
 */
export function parseContentToBlocks(
  content?: any,
  existingBlocks?: any[]
): GutenbergEditorBlock[] {
  // If valid existing blocks are provided, sanitize and return them
  if (Array.isArray(existingBlocks) && existingBlocks.length > 0) {
    return existingBlocks.map((b) => ({
      id: b.id || generateBlockId(),
      type: (b.type || "paragraph") as BlockType,
      content: b.content || "",
      level: b.level || 2,
      textAlign: b.textAlign || "left",
      imageUrl: b.imageUrl,
      altText: b.altText || b.caption,
      caption: b.caption,
      imageAlign: b.imageAlign || "center",
      citation: b.citation,
      styleVariant: b.styleVariant || "tip",
      calloutTitle: b.calloutTitle,
      listType: b.listType || "unordered",
      listItems: Array.isArray(b.listItems) ? b.listItems : [],
      hasHeader: b.hasHeader ?? true,
      tableHeaders: Array.isArray(b.tableHeaders) ? b.tableHeaders : [],
      tableRows: Array.isArray(b.tableRows) ? b.tableRows : [],
      faqItems: Array.isArray(b.faqItems) ? b.faqItems : [],
      includeFaqSchema: b.includeFaqSchema ?? true,
      columnLayout: b.columnLayout || "50-50",
      columns: Array.isArray(b.columns) ? b.columns : ["", ""],
      buttonText: b.buttonText || "Download PDF",
      buttonUrl: b.buttonUrl || "#",
      buttonVariant: b.buttonVariant || "primary",
      buttonAlign: b.buttonAlign || "left",
      adSlot: b.adSlot || "in-feed",
      codeLanguage: b.codeLanguage || "text",
      spacerHeight: b.spacerHeight || 32,
      // Hero & Downloader
      heroBadge: b.heroBadge,
      heroTitle: b.heroTitle,
      heroSubtitle: b.heroSubtitle,
      ctaText: b.ctaText,
      placeholderText: b.placeholderText,
      qualityBadgeText: b.qualityBadgeText,
      autoDownloadBadgeText: b.autoDownloadBadgeText,
      checklistItems: Array.isArray(b.checklistItems) ? b.checklistItems : undefined,
      // Steps / How It Works
      sectionTitle: b.sectionTitle,
      sectionSubtitle: b.sectionSubtitle,
      steps: Array.isArray(b.steps) ? b.steps : undefined,
      // Features / Benefits
      features: Array.isArray(b.features) ? b.features : undefined,
    }));
  }

  // If content is an object with structured sections (standard in our CMS BlogPost)
  if (content && typeof content === "object") {
    const blocks: GutenbergEditorBlock[] = [];

    // 1. Intro
    if (content.intro) {
      blocks.push({
        id: generateBlockId(),
        type: "paragraph",
        content: content.intro,
        textAlign: "left",
      });
    }

    // 2. Sections
    if (Array.isArray(content.sections)) {
      content.sections.forEach((sec: any) => {
        if (sec.heading) {
          blocks.push({
            id: generateBlockId(),
            type: "heading",
            content: sec.heading,
            level: 2,
            textAlign: "left",
          });
        }
        if (sec.image) {
          blocks.push({
            id: generateBlockId(),
            type: "image",
            content: "",
            imageUrl: sec.image,
            caption: sec.heading || "Section image",
            imageAlign: "center",
          });
        }
        if (Array.isArray(sec.body)) {
          sec.body.forEach((para: string) => {
            if (para) {
              blocks.push({
                id: generateBlockId(),
                type: "paragraph",
                content: para,
                textAlign: "left",
              });
            }
          });
        } else if (typeof sec.body === "string" && sec.body) {
          blocks.push({
            id: generateBlockId(),
            type: "paragraph",
            content: sec.body,
            textAlign: "left",
          });
        }
        if (sec.tip) {
          blocks.push({
            id: generateBlockId(),
            type: "callout",
            content: sec.tip,
            calloutTitle: "Pro Tip",
            styleVariant: "tip",
          });
        }
      });
    }

    if (blocks.length > 0) return blocks;
  }

  const raw = (typeof content === "string" ? content : "").trim();
  if (!raw) {
    return [
      {
        id: generateBlockId(),
        type: "paragraph",
        content: "",
        textAlign: "left",
      },
    ];
  }

  // If content is an HTML string with Gutenberg comment markers or standard tags
  const isHtml = /<(?:p|h[1-6]|ul|ol|table|blockquote|pre|figure|img|hr|div)\b/i.test(raw);

  if (isHtml) {
    return parseHtmlToBlocks(raw);
  }

  // Otherwise parse as Markdown
  return parseMarkdownToBlocks(raw);
}

/**
 * Parses Markdown formatted text into Gutenberg blocks
 */
function parseMarkdownToBlocks(text: string): GutenbergEditorBlock[] {
  const blocks: GutenbergEditorBlock[] = [];
  const lines = text.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Headings (# H1 to ###### H6)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      blocks.push({
        id: generateBlockId(),
        type: "heading",
        content: headingMatch[2].trim(),
        level,
        textAlign: "left",
      });
      i++;
      continue;
    }

    // 3. Horizontal Rule
    if (/^(?:---|\*\*\*|___)$/.test(trimmed)) {
      blocks.push({
        id: generateBlockId(),
        type: "divider",
        content: "",
      });
      i++;
      continue;
    }

    // 4. Code Block (```lang ... ```)
    if (trimmed.startsWith("```")) {
      const lang = trimmed.replace(/^```/, "").trim();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      blocks.push({
        id: generateBlockId(),
        type: "code",
        content: codeLines.join("\n"),
        codeLanguage: lang || "javascript",
      });
      continue;
    }

    // 5. Image (![alt](url))
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      blocks.push({
        id: generateBlockId(),
        type: "image",
        content: "",
        altText: imgMatch[1],
        imageUrl: imgMatch[2],
        caption: imgMatch[1] || "",
        imageAlign: "center",
      });
      i++;
      continue;
    }

    // 6. Blockquote or Callout (> text)
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const fullQuote = quoteLines.join(" ").trim();

      // Check if it's a Callout notice (e.g., > **Note:** or > **Tip:** or > [!TIP])
      if (/\*\*(?:Note|Tip|Warning|Important|Caution|Info):\*\*/i.test(fullQuote)) {
        const variantMatch = fullQuote.match(/\*\*(Note|Tip|Warning|Important|Caution|Info):\*\*/i);
        const variantWord = (variantMatch ? variantMatch[1].toLowerCase() : "info");
        let styleVariant: "info" | "warning" | "success" | "tip" | "note" = "info";
        if (variantWord === "warning" || variantWord === "caution") styleVariant = "warning";
        else if (variantWord === "tip") styleVariant = "tip";
        else if (variantWord === "note") styleVariant = "note";

        const cleanText = fullQuote.replace(/\*\*(?:Note|Tip|Warning|Important|Caution|Info):\*\*\s*/i, "");
        blocks.push({
          id: generateBlockId(),
          type: "callout",
          content: cleanText,
          calloutTitle: variantMatch ? variantMatch[1] : "Notice",
          styleVariant,
        });
      } else {
        blocks.push({
          id: generateBlockId(),
          type: "quote",
          content: fullQuote,
          citation: "",
          quoteVariant: "standard",
        });
      }
      continue;
    }

    // 7. Markdown Table (| Header 1 | Header 2 |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        // skip delimiter line (e.g. |---|---|)
        const rowLines = tableLines.slice(2);
        const rows = rowLines.map((row) =>
          row
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim())
        );

        blocks.push({
          id: generateBlockId(),
          type: "table",
          content: "",
          hasHeader: true,
          tableHeaders: headerCells,
          tableRows: rows,
        });
        continue;
      }
    }

    // 8. Lists (Unordered: - / * / + or Ordered: 1. 2.)
    const isUnordered = /^[*\-+]\s+/.test(trimmed);
    const isOrdered = /^\d+\.\s+/.test(trimmed);

    if (isUnordered || isOrdered) {
      const items: string[] = [];
      const listType = isOrdered ? "ordered" : "unordered";

      while (i < lines.length) {
        const currentTrim = lines[i].trim();
        if (isOrdered && /^\d+\.\s+/.test(currentTrim)) {
          items.push(currentTrim.replace(/^\d+\.\s+/, ""));
          i++;
        } else if (!isOrdered && /^[*\-+]\s+/.test(currentTrim)) {
          items.push(currentTrim.replace(/^[*\-+]\s+/, ""));
          i++;
        } else if (currentTrim === "") {
          break;
        } else {
          break;
        }
      }

      blocks.push({
        id: generateBlockId(),
        type: "list",
        content: "",
        listType,
        listItems: items,
      });
      continue;
    }

    // 9. Standard Paragraph (accumulate consecutive non-empty lines)
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "") {
      const cur = lines[i].trim();
      // break if next line starts a new block
      if (
        cur.startsWith("#") ||
        cur.startsWith("```") ||
        cur.startsWith(">") ||
        cur.startsWith("---") ||
        cur.startsWith("![") ||
        (cur.startsWith("|") && cur.endsWith("|")) ||
        /^[*\-+]\s+/.test(cur) ||
        /^\d+\.\s+/.test(cur)
      ) {
        break;
      }
      paraLines.push(cur);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        id: generateBlockId(),
        type: "paragraph",
        content: paraLines.join(" "),
        textAlign: "left",
      });
    }
  }

  if (blocks.length === 0) {
    blocks.push({
      id: generateBlockId(),
      type: "paragraph",
      content: "",
      textAlign: "left",
    });
  }

  return blocks;
}

/**
 * Parses HTML formatted text into Gutenberg blocks
 */
function parseHtmlToBlocks(html: string): GutenbergEditorBlock[] {
  const blocks: GutenbergEditorBlock[] = [];
  const temp = html
    .replace(/\r?\n/g, " ")
    .replace(/<br\s*\/?>/gi, "\n");

  // Regex parser for common top-level HTML tags
  const tagRegex = /<(h[1-6]|p|blockquote|pre|ul|ol|table|figure|hr|div)([^>]*)>(.*?)<\/\1>|<hr\s*\/?>|<img([^>]+)\/?>/gis;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = tagRegex.exec(temp)) !== null) {
    const tagName = (match[1] || "").toLowerCase();
    const attrs = match[2] || match[4] || "";
    const inner = match[3] || "";

    if (tagName.startsWith("h")) {
      const level = parseInt(tagName.replace("h", ""), 10) as 1 | 2 | 3 | 4 | 5 | 6;
      blocks.push({
        id: generateBlockId(),
        type: "heading",
        content: stripTags(inner).trim(),
        level: level || 2,
        textAlign: "left",
      });
    } else if (tagName === "p") {
      const text = inner.trim();
      if (text) {
        blocks.push({
          id: generateBlockId(),
          type: "paragraph",
          content: text,
          textAlign: "left",
        });
      }
    } else if (tagName === "blockquote") {
      blocks.push({
        id: generateBlockId(),
        type: "quote",
        content: stripTags(inner).trim(),
        citation: "",
      });
    } else if (tagName === "pre") {
      blocks.push({
        id: generateBlockId(),
        type: "code",
        content: stripTags(inner).trim(),
        codeLanguage: "text",
      });
    } else if (tagName === "ul" || tagName === "ol") {
      const items: string[] = [];
      const liRegex = /<li[^>]*>(.*?)<\/li>/gis;
      let liMatch: RegExpExecArray | null;
      while ((liMatch = liRegex.exec(inner)) !== null) {
        items.push(liMatch[1].trim());
      }
      blocks.push({
        id: generateBlockId(),
        type: "list",
        content: "",
        listType: tagName === "ol" ? "ordered" : "unordered",
        listItems: items,
      });
    } else if (tagName === "table") {
      const headers: string[] = [];
      const thRegex = /<th[^>]*>(.*?)<\/th>/gis;
      let thMatch: RegExpExecArray | null;
      while ((thMatch = thRegex.exec(inner)) !== null) {
        headers.push(stripTags(thMatch[1]).trim());
      }

      const rows: string[][] = [];
      const trRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
      let trMatch: RegExpExecArray | null;
      while ((trMatch = trRegex.exec(inner)) !== null) {
        const rowCells: string[] = [];
        const tdRegex = /<td[^>]*>(.*?)<\/td>/gis;
        let tdMatch: RegExpExecArray | null;
        while ((tdMatch = tdRegex.exec(trMatch[1])) !== null) {
          rowCells.push(stripTags(tdMatch[1]).trim());
        }
        if (rowCells.length > 0) rows.push(rowCells);
      }

      blocks.push({
        id: generateBlockId(),
        type: "table",
        content: "",
        hasHeader: headers.length > 0,
        tableHeaders: headers,
        tableRows: rows,
      });
    } else if (tagName === "hr" || match[0].startsWith("<hr")) {
      blocks.push({
        id: generateBlockId(),
        type: "divider",
        content: "",
      });
    } else if (match[0].startsWith("<img")) {
      const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
      const altMatch = attrs.match(/alt=["']([^"']+)["']/i);
      if (srcMatch) {
        blocks.push({
          id: generateBlockId(),
          type: "image",
          content: "",
          imageUrl: srcMatch[1],
          altText: altMatch ? altMatch[1] : "",
          caption: altMatch ? altMatch[1] : "",
          imageAlign: "center",
        });
      }
    }
  }

  if (blocks.length === 0) {
    return parseMarkdownToBlocks(html);
  }

  return blocks;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

/**
 * Serializes Gutenberg blocks into clean, semantic HTML
 */
export function serializeBlocksToHtml(blocks: GutenbergEditorBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading": {
          const level = block.level || 2;
          const alignStyle = block.textAlign && block.textAlign !== "left" ? ` style="text-align: ${block.textAlign}"` : "";
          const idAttr = block.anchor ? ` id="${block.anchor}"` : "";
          return `<h${level}${idAttr}${alignStyle}>${block.content}</h${level}>`;
        }

        case "paragraph": {
          const alignStyle = block.textAlign && block.textAlign !== "left" ? ` style="text-align: ${block.textAlign}"` : "";
          return `<p${alignStyle}>${block.content}</p>`;
        }

        case "image": {
          const alt = block.altText || block.caption || "";
          const alignClass = block.imageAlign ? ` align-${block.imageAlign}` : "";
          return `<figure class="wp-block-image${alignClass}"><img src="${block.imageUrl || ""}" alt="${alt}" loading="lazy" />${
            block.caption ? `<figcaption>${block.caption}</figcaption>` : ""
          }</figure>`;
        }

        case "quote": {
          return `<blockquote class="wp-block-quote"><p>${block.content}</p>${
            block.citation ? `<cite>${block.citation}</cite>` : ""
          }</blockquote>`;
        }

        case "callout": {
          const variant = block.styleVariant || "info";
          return `<div class="wp-block-callout callout-${variant}">${
            block.calloutTitle ? `<h4>${block.calloutTitle}</h4>` : ""
          }<p>${block.content}</p></div>`;
        }

        case "list": {
          const tag = block.listType === "ordered" ? "ol" : "ul";
          const items = (block.listItems || []).map((li) => `<li>${li}</li>`).join("");
          return `<${tag}>${items}</${tag}>`;
        }

        case "table": {
          const hasHeader = block.hasHeader && block.tableHeaders && block.tableHeaders.length > 0;
          const thead = hasHeader
            ? `<thead><tr>${block.tableHeaders!.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`
            : "";
          const tbody = `<tbody>${(block.tableRows || [])
            .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
            .join("")}</tbody>`;
          return `<div class="wp-block-table"><table>${thead}${tbody}</table></div>`;
        }

        case "faq": {
          const items = (block.faqItems || [])
            .map(
              (item) =>
                `<details class="wp-block-faq-item"><summary><strong>${item.question}</strong></summary><div class="faq-answer"><p>${item.answer}</p></div></details>`
            )
            .join("\n");
          return `<div class="wp-block-faq">${items}</div>`;
        }

        case "columns": {
          const cols = (block.columns || [])
            .map((col) => `<div class="wp-block-column">${col}</div>`)
            .join("");
          return `<div class="wp-block-columns layout-${block.columnLayout || "50-50"}">${cols}</div>`;
        }

        case "button": {
          const target = block.buttonNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
          const align = block.buttonAlign || "left";
          return `<div class="wp-block-button text-${align}"><a href="${block.buttonUrl || "#"}" class="btn btn-${
            block.buttonVariant || "primary"
          }"${target}>${block.buttonText || "Click Here"}</a></div>`;
        }

        case "ad": {
          return `<div class="wp-block-ad-slot" data-slot="${block.adSlot || "in-feed"}"><!-- Ad Placement: ${
            block.adLabel || block.adSlot
          } -->${block.adCode || ""}</div>`;
        }

        case "code": {
          return `<pre><code class="language-${block.codeLanguage || "text"}">${block.content}</code></pre>`;
        }

        case "html": {
          return block.content;
        }

        case "divider": {
          return `<hr class="wp-block-separator" />`;
        }

        case "spacer": {
          return `<div style="height: ${block.spacerHeight || 32}px" aria-hidden="true" class="wp-block-spacer"></div>`;
        }

        case "hero": {
          const badge = block.heroBadge ? `<span class="badge">${block.heroBadge}</span>` : "";
          const title = block.heroTitle || block.content || "Scribd Downloader";
          const sub = block.heroSubtitle ? `<p class="hero-desc">${block.heroSubtitle}</p>` : "";
          const cta = block.ctaText || "Download PDF";
          return `<div class="wp-block-hero-downloader"><div class="hero-header">${badge}<h1>${title}</h1>${sub}</div><div class="downloader-input-box"><input type="url" placeholder="${block.placeholderText || "Paste link here..."}" /><button class="btn btn-primary">${cta}</button></div></div>`;
        }

        case "steps": {
          const title = block.sectionTitle || "How It Works";
          const sub = block.sectionSubtitle ? `<p class="steps-sub">${block.sectionSubtitle}</p>` : "";
          const stepsHtml = (block.steps || [])
            .map(
              (s, i) =>
                `<div class="step-card"><span class="step-num">${s.stepNumber || i + 1}</span><h4>${s.title}</h4><p>${s.description}</p></div>`
            )
            .join("");
          return `<div class="wp-block-how-it-works"><h2>${title}</h2>${sub}<div class="steps-grid">${stepsHtml}</div></div>`;
        }

        case "features": {
          const title = block.sectionTitle || "Key Features & Benefits";
          const sub = block.sectionSubtitle ? `<p class="features-sub">${block.sectionSubtitle}</p>` : "";
          const featsHtml = (block.features || [])
            .map(
              (f) =>
                `<div class="feature-card">${f.badge ? `<span class="feature-badge">${f.badge}</span>` : ""}<h4>${f.title}</h4><p>${f.description}</p></div>`
            )
            .join("");
          return `<div class="wp-block-features-grid"><h2>${title}</h2>${sub}<div class="features-grid">${featsHtml}</div></div>`;
        }

        default:
          return `<p>${block.content || ""}</p>`;
      }
    })
    .join("\n\n");
}

/**
 * Serializes Gutenberg blocks into clean Markdown
 */
export function serializeBlocksToMarkdown(blocks: GutenbergEditorBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading": {
          const hashes = "#".repeat(block.level || 2);
          return `${hashes} ${block.content}`;
        }

        case "paragraph":
          return block.content;

        case "image":
          return `![${block.altText || block.caption || ""}](${block.imageUrl || ""})`;

        case "quote":
          return `> ${block.content}${block.citation ? `\n> — ${block.citation}` : ""}`;

        case "callout":
          return `> **${block.calloutTitle || "Notice"}:** ${block.content}`;

        case "list":
          return (block.listItems || [])
            .map((item, idx) => (block.listType === "ordered" ? `${idx + 1}. ${item}` : `- ${item}`))
            .join("\n");

        case "table": {
          if (!block.tableHeaders || block.tableHeaders.length === 0) return "";
          const headerLine = `| ${block.tableHeaders.join(" | ")} |`;
          const sepLine = `| ${block.tableHeaders.map(() => "---").join(" | ")} |`;
          const rowsLines = (block.tableRows || []).map((row) => `| ${row.join(" | ")} |`).join("\n");
          return `${headerLine}\n${sepLine}\n${rowsLines}`;
        }

        case "code":
          return `\`\`\`${block.codeLanguage || ""}\n${block.content}\n\`\`\``;

        case "divider":
          return "---";

        case "hero":
          return `## ${block.heroTitle || "Scribd Downloader"}\n${block.heroSubtitle || ""}\n\n[CTA: ${block.ctaText || "Download PDF"}]`;

        case "steps":
          return `## ${block.sectionTitle || "How It Works"}\n${(block.steps || []).map((s, i) => `${i + 1}. **${s.title}**: ${s.description}`).join("\n")}`;

        case "features":
          return `## ${block.sectionTitle || "Features"}\n${(block.features || []).map((f) => `- **${f.title}** (${f.badge || "Feature"}): ${f.description}`).join("\n")}`;

        default:
          return block.content || "";
      }
    })
    .join("\n\n");
}

/**
 * Converts HomepageContent into a unified GutenbergEditorBlock[] tree
 */
export function parseHomepageToBlocks(hpContent: any): GutenbergEditorBlock[] {
  if (!hpContent) return [];

  // If already contains valid Gutenberg blocks
  if (Array.isArray(hpContent.blocks) && hpContent.blocks.length > 0) {
    return parseContentToBlocks(null, hpContent.blocks);
  }

  const blocks: GutenbergEditorBlock[] = [];

  // 1. Hero & Downloader Block
  blocks.push({
    id: generateBlockId(),
    type: "hero",
    content: hpContent.heroTitle || hpContent.h1Title || "Scribd Downloader – Free PDF Downloads",
    heroBadge: hpContent.heroBadge || "100% Free & Secure Scribd PDF Converter",
    heroTitle: hpContent.heroTitle || hpContent.h1Title || "Scribd Downloader – Free PDF Downloads",
    heroSubtitle:
      hpContent.heroSubtitle ||
      "Save documents, research papers, and slide decks from Scribd as clean, readable PDFs. Paste the link, get the file — no account needed, no waitlist.",
    ctaText: hpContent.ctaText || "Download PDF",
    placeholderText:
      hpContent.placeholderText ||
      "Paste Scribd document link here (e.g. scribd.com/document/12345678/...)",
    qualityBadgeText: hpContent.qualityBadgeText || "High Resolution 300 DPI",
    autoDownloadBadgeText: hpContent.autoDownloadBadgeText || "Direct Browser Save",
    checklistItems: Array.isArray(hpContent.checklistItems)
      ? hpContent.checklistItems
      : [
          "No account or login required",
          "Full document pages preserved",
          "100% Free & Private — zero logs",
        ],
  });

  // 2. How It Works (Steps) Block
  blocks.push({
    id: generateBlockId(),
    type: "steps",
    content: hpContent.howItWorksTitle || "How to Download Scribd Documents",
    sectionTitle: hpContent.howItWorksTitle || "How to Download Scribd Documents",
    sectionSubtitle:
      hpContent.howItWorksSubtitle ||
      "Three simple steps to save any public Scribd document as a PDF in seconds.",
    steps: Array.isArray(hpContent.steps) && hpContent.steps.length > 0
      ? hpContent.steps
      : [
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
  });

  // 3. Features & Benefits Block
  blocks.push({
    id: generateBlockId(),
    type: "features",
    content: hpContent.benefitsTitle || "Why Use Our Scribd Downloader?",
    sectionTitle: hpContent.benefitsTitle || "Why Use Our Scribd Downloader?",
    sectionSubtitle:
      hpContent.benefitsSubtitle ||
      "Engineered for speed, privacy, and flawless document formatting.",
    features: Array.isArray(hpContent.benefits) && hpContent.benefits.length > 0
      ? hpContent.benefits
      : [
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
  });

  // 4. Guide Article Section
  if (hpContent.guideTitle) {
    blocks.push({
      id: generateBlockId(),
      type: "heading",
      content: hpContent.guideTitle,
      level: 2,
    });
  }

  if (hpContent.guideContent) {
    const articleBlocks = parseContentToBlocks(hpContent.guideContent);
    blocks.push(...articleBlocks);
  }

  return blocks;
}

/**
 * Extracts unified Gutenberg blocks back into a HomepageContent object
 */
export function extractBlocksToHomepage(blocks: GutenbergEditorBlock[], baseContent: any = {}): any {
  const result = { ...baseContent };
  result.blocks = blocks;

  // Extract Hero
  const heroBlock = blocks.find((b) => b.type === "hero");
  if (heroBlock) {
    if (heroBlock.heroTitle) {
      result.heroTitle = heroBlock.heroTitle;
      result.h1Title = heroBlock.heroTitle;
    }
    if (heroBlock.heroBadge) result.heroBadge = heroBlock.heroBadge;
    if (heroBlock.heroSubtitle) result.heroSubtitle = heroBlock.heroSubtitle;
    if (heroBlock.ctaText) result.ctaText = heroBlock.ctaText;
    if (heroBlock.placeholderText) result.placeholderText = heroBlock.placeholderText;
    if (heroBlock.qualityBadgeText) result.qualityBadgeText = heroBlock.qualityBadgeText;
    if (heroBlock.autoDownloadBadgeText) result.autoDownloadBadgeText = heroBlock.autoDownloadBadgeText;
    if (heroBlock.checklistItems) result.checklistItems = heroBlock.checklistItems;
  }

  // Extract Steps
  const stepsBlock = blocks.find((b) => b.type === "steps");
  if (stepsBlock) {
    if (stepsBlock.sectionTitle) result.howItWorksTitle = stepsBlock.sectionTitle;
    if (stepsBlock.sectionSubtitle) result.howItWorksSubtitle = stepsBlock.sectionSubtitle;
    if (stepsBlock.steps) result.steps = stepsBlock.steps;
  }

  // Extract Features
  const featuresBlock = blocks.find((b) => b.type === "features");
  if (featuresBlock) {
    if (featuresBlock.sectionTitle) result.benefitsTitle = featuresBlock.sectionTitle;
    if (featuresBlock.sectionSubtitle) result.benefitsSubtitle = featuresBlock.sectionSubtitle;
    if (featuresBlock.features) result.benefits = featuresBlock.features;
  }

  // Extract Article (all blocks after or excluding hero, steps, features)
  const articleBlocks = blocks.filter((b) => b.type !== "hero" && b.type !== "steps" && b.type !== "features");
  if (articleBlocks.length > 0) {
    result.guideContent = serializeBlocksToMarkdown(articleBlocks);
    result.htmlContent = serializeBlocksToHtml(blocks);
  }

  return result;
}
