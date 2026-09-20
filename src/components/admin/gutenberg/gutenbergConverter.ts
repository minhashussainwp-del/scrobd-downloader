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

        default:
          return block.content || "";
      }
    })
    .join("\n\n");
}
