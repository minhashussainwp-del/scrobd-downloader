import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTodo,
  Table,
  Plus,
  Trash2,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Upload,
  Maximize2,
  Minimize2,
  Code,
  FileCode,
  Quote,
  Minus,
  RemoveFormatting,
  Undo,
  Redo,
  Palette,
  Highlighter,
  ChevronDown,
  X,
  Check,
  HelpCircle,
  Sparkles,
  Info,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Type,
  Rows,
  Columns,
} from "lucide-react";

interface ClassicEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// Preset Text Colors
const TEXT_COLORS = [
  { label: "Default Dark", value: "#0f172a" },
  { label: "Slate Gray", value: "#475569" },
  { label: "Indigo Brand", value: "#4f46e5" },
  { label: "Royal Blue", value: "#2563eb" },
  { label: "Cyan", value: "#0891b2" },
  { label: "Emerald Green", value: "#059669" },
  { label: "Amber Orange", value: "#d97706" },
  { label: "Ruby Red", value: "#dc2626" },
  { label: "Rose Pink", value: "#e11d48" },
  { label: "Purple", value: "#7c3aed" },
];

// Preset Highlight Colors
const HIGHLIGHT_COLORS = [
  { label: "None", value: "transparent" },
  { label: "Soft Yellow", value: "#fef08a" },
  { label: "Soft Green", value: "#bbf7d0" },
  { label: "Soft Blue", value: "#bfdbfe" },
  { label: "Soft Purple", value: "#e9d5ff" },
  { label: "Soft Pink", value: "#fbcfe8" },
  { label: "Soft Orange", value: "#fed7aa" },
  { label: "Soft Slate", value: "#e2e8f0" },
];

export function ClassicEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "460px",
}: ClassicEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState<"visual" | "html">("visual");

  // Active Dropdowns / Modals
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showCalloutModal, setShowCalloutModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Link Form State
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkTargetBlank, setLinkTargetBlank] = useState(true);
  const [isCaretOnLink, setIsCaretOnLink] = useState(false);

  // Image Form State
  const [imageSourceType, setImageSourceType] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlign, setImageAlign] = useState<"center" | "left" | "right" | "full">("center");
  const [imageWidth, setImageWidth] = useState<string>("100%");

  // Table Form State
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHasHeader, setTableHasHeader] = useState(true);

  // Contextual Table State
  const [activeTableElement, setActiveTableElement] = useState<HTMLTableElement | null>(null);
  const [activeCellElement, setActiveCellElement] = useState<HTMLTableCellElement | null>(null);

  // Word & Character stats
  const [stats, setStats] = useState({ words: 0, characters: 0, readingTime: 1 });
  const [currentPath, setCurrentPath] = useState("p");

  // Sync initial content or when switching from HTML to Visual
  useEffect(() => {
    if (editorRef.current && mode === "visual") {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
      updateStats();
    }
  }, [mode]);

  // Enable styleWithCSS on mount
  useEffect(() => {
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {}
  }, []);

  // Calculate statistics from editor content
  const updateStats = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || "";
    const cleanText = text.trim();
    const words = cleanText.length > 0 ? cleanText.split(/\s+/).filter(Boolean).length : 0;
    const characters = cleanText.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    setStats({ words, characters, readingTime });
  }, []);

  // Save current selection before modal opens
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Restore selection when applying action from modal
  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  // Handle changes and notify parent
  const handleContentChange = () => {
    if (editorRef.current && mode === "visual") {
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateStats();
      detectActiveContext();
    }
  };

  // Detect currently focused element (e.g. inside table, link, heading)
  const detectActiveContext = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let node: Node | null = sel.anchorNode;
    let foundTable: HTMLTableElement | null = null;
    let foundCell: HTMLTableCellElement | null = null;
    let foundLink: HTMLAnchorElement | null = null;
    const tags: string[] = [];

    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        tags.unshift(el.tagName.toLowerCase());
        if (!foundTable && el.tagName === "TABLE") foundTable = el as HTMLTableElement;
        if (!foundCell && (el.tagName === "TD" || el.tagName === "TH")) foundCell = el as HTMLTableCellElement;
        if (!foundLink && el.tagName === "A") foundLink = el as HTMLAnchorElement;
      }
      node = node.parentNode;
    }

    setActiveTableElement(foundTable);
    setActiveCellElement(foundCell);
    setIsCaretOnLink(Boolean(foundLink));
    setCurrentPath(tags.length > 0 ? tags.join(" > ") : "p");
  };

  // Execute standard formatting command
  const exec = (command: string, arg?: string) => {
    if (mode === "html") return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleContentChange();
  };

  // Heading / Block Format Selector
  const handleFormatBlock = (format: string) => {
    if (!format) return;
    editorRef.current?.focus();
    if (format === "p") {
      exec("formatBlock", "<p>");
    } else if (format === "blockquote") {
      exec("formatBlock", "<blockquote>");
    } else if (format === "pre") {
      exec("formatBlock", "<pre>");
    } else {
      exec("formatBlock", `<${format}>`);
    }
  };

  // Custom Font Size application
  const handleFontSize = (sizePx: string) => {
    if (!sizePx) return;
    saveSelection();
    editorRef.current?.focus();
    restoreSelection();

    // Use execCommand fontSize temporary wrapper then replace with px font size
    document.execCommand("fontSize", false, "7");
    if (editorRef.current) {
      const fontEls = editorRef.current.querySelectorAll("font[size='7']");
      fontEls.forEach((font) => {
        const span = document.createElement("span");
        span.style.fontSize = sizePx;
        span.innerHTML = font.innerHTML;
        font.parentNode?.replaceChild(span, font);
      });
    }
    handleContentChange();
  };

  // Text Color application
  const handleApplyColor = (color: string) => {
    saveSelection();
    editorRef.current?.focus();
    restoreSelection();
    exec("foreColor", color);
    setShowColorPicker(false);
  };

  // Highlight / Background Color application
  const handleApplyHighlight = (color: string) => {
    saveSelection();
    editorRef.current?.focus();
    restoreSelection();
    if (color === "transparent") {
      exec("removeFormat");
    } else {
      exec("hiliteColor", color);
    }
    setShowHighlightPicker(false);
  };

  // Open Link Modal
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    const text = sel ? sel.toString() : "";
    setLinkText(text);

    // If caret is on an anchor, prefill URL
    if (sel && sel.anchorNode) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "A") {
          const a = node as HTMLAnchorElement;
          setLinkUrl(a.getAttribute("href") || "");
          setLinkTargetBlank(a.getAttribute("target") === "_blank");
          break;
        }
        node = node.parentNode;
      }
    } else {
      setLinkUrl("");
      setLinkTargetBlank(true);
    }

    setShowLinkModal(true);
  };

  // Apply Link
  const handleConfirmLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    let finalUrl = linkUrl.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://") && !finalUrl.startsWith("/") && !finalUrl.startsWith("#")) {
      finalUrl = "https://" + finalUrl;
    }

    editorRef.current?.focus();
    restoreSelection();

    const targetAttr = linkTargetBlank ? ` target="_blank" rel="noopener noreferrer"` : "";
    const displayText = linkText.trim() || finalUrl;

    const linkHtml = `<a href="${finalUrl}"${targetAttr} class="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-indigo-300 hover:decoration-indigo-600 transition">${displayText}</a>`;

    document.execCommand("insertHTML", false, linkHtml);
    handleContentChange();
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  // Remove existing Link
  const handleRemoveLink = () => {
    editorRef.current?.focus();
    restoreSelection();
    exec("unlink");
    setShowLinkModal(false);
  };

  // Open Image Modal
  const openImageModal = () => {
    saveSelection();
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
    setImageAlign("center");
    setImageWidth("100%");
    setShowImageModal(true);
  };

  // Handle local file upload (FileReader to Base64 data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Auto set alt text from file name
    if (!imageAlt) {
      setImageAlt(file.name.replace(/\.[^/.]+$/, ""));
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImageUrl(reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  // Insert Image into Editor
  const handleConfirmImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    editorRef.current?.focus();
    restoreSelection();

    const alignClasses =
      imageAlign === "center"
        ? "mx-auto block text-center"
        : imageAlign === "left"
        ? "float-left mr-6 mb-4"
        : imageAlign === "right"
        ? "float-right ml-6 mb-4"
        : "w-full block";

    let imgHtml = "";
    if (imageCaption.trim()) {
      imgHtml = `<figure class="my-6 ${alignClasses}" style="max-width: ${imageWidth};">
        <img src="${imageUrl}" alt="${imageAlt || "Article illustration"}" class="rounded-2xl shadow-sm border border-slate-200 w-full object-cover" />
        <figcaption class="text-xs text-slate-500 italic mt-2 text-center">${imageCaption}</figcaption>
      </figure><p><br></p>`;
    } else {
      imgHtml = `<div class="my-6 ${alignClasses}" style="max-width: ${imageWidth};">
        <img src="${imageUrl}" alt="${imageAlt || "Article illustration"}" class="rounded-2xl shadow-sm border border-slate-200 w-full object-cover" />
      </div><p><br></p>`;
    }

    document.execCommand("insertHTML", false, imgHtml);
    handleContentChange();
    setShowImageModal(false);
  };

  // Insert Table Modal
  const openTableModal = () => {
    saveSelection();
    setShowTableModal(true);
  };

  // Confirm Table Insertion
  const handleConfirmTable = (e: React.FormEvent) => {
    e.preventDefault();
    editorRef.current?.focus();
    restoreSelection();

    let tableHtml = `<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-slate-300 rounded-xl overflow-hidden text-sm" style="border-collapse: collapse; width: 100%; border: 1px solid #cbd5e1;">`;

    if (tableHasHeader) {
      tableHtml += `<thead style="background-color: #f8fafc;"><tr style="border-bottom: 2px solid #cbd5e1;">`;
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-weight: 700; color: #0f172a; background-color: #f1f5f9;">Header ${c}</th>`;
      }
      tableHtml += `</tr></thead>`;
    }

    tableHtml += `<tbody>`;
    for (let r = 1; r <= tableRows; r++) {
      const bg = r % 2 === 0 ? "background-color: #f8fafc;" : "background-color: #ffffff;";
      tableHtml += `<tr style="${bg}">`;
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 8px 14px; color: #334155;">Data ${r}-${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br></p>`;

    document.execCommand("insertHTML", false, tableHtml);
    handleContentChange();
    setShowTableModal(false);
  };

  // Contextual Table Helpers
  const addTableRow = (above: boolean = false) => {
    if (!activeTableElement || !activeCellElement) return;
    const currentRow = activeCellElement.closest("tr");
    if (!currentRow) return;

    const colCount = currentRow.cells.length;
    const newRow = document.createElement("tr");
    newRow.style.backgroundColor = "#ffffff";

    for (let i = 0; i < colCount; i++) {
      const cell = document.createElement("td");
      cell.style.cssText = "border: 1px solid #cbd5e1; padding: 8px 14px; color: #334155;";
      cell.innerHTML = "New cell";
      newRow.appendChild(cell);
    }

    if (above) {
      currentRow.parentNode?.insertBefore(newRow, currentRow);
    } else {
      currentRow.parentNode?.insertBefore(newRow, currentRow.nextSibling);
    }
    handleContentChange();
  };

  const deleteTableRow = () => {
    if (!activeTableElement || !activeCellElement) return;
    const currentRow = activeCellElement.closest("tr");
    if (!currentRow) return;

    const tbody = currentRow.closest("tbody");
    if (tbody && tbody.rows.length <= 1) {
      activeTableElement.remove();
      setActiveTableElement(null);
      setActiveCellElement(null);
    } else {
      currentRow.remove();
    }
    handleContentChange();
  };

  const addTableColumn = (left: boolean = false) => {
    if (!activeTableElement || !activeCellElement) return;
    const cellIndex = activeCellElement.cellIndex;

    const allRows = activeTableElement.querySelectorAll("tr");
    allRows.forEach((row) => {
      const isHeader = row.closest("thead") !== null;
      const newCell = document.createElement(isHeader ? "th" : "td");
      if (isHeader) {
        newCell.style.cssText = "border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-weight: 700; color: #0f172a; background-color: #f1f5f9;";
        newCell.innerHTML = "New Col";
      } else {
        newCell.style.cssText = "border: 1px solid #cbd5e1; padding: 8px 14px; color: #334155;";
        newCell.innerHTML = "New cell";
      }

      if (left) {
        row.insertBefore(newCell, row.cells[cellIndex]);
      } else {
        row.insertBefore(newCell, row.cells[cellIndex + 1] || null);
      }
    });
    handleContentChange();
  };

  const deleteTableColumn = () => {
    if (!activeTableElement || !activeCellElement) return;
    const cellIndex = activeCellElement.cellIndex;
    const allRows = activeTableElement.querySelectorAll("tr");

    if (activeTableElement.rows[0]?.cells.length <= 1) {
      activeTableElement.remove();
      setActiveTableElement(null);
      setActiveCellElement(null);
    } else {
      allRows.forEach((row) => {
        if (row.cells[cellIndex]) {
          row.deleteCell(cellIndex);
        }
      });
    }
    handleContentChange();
  };

  const deleteEntireTable = () => {
    if (activeTableElement) {
      activeTableElement.remove();
      setActiveTableElement(null);
      setActiveCellElement(null);
      handleContentChange();
    }
  };

  // Insert Callout Box (Note / Warning / Tip)
  const handleInsertCallout = (type: "info" | "warning" | "success" | "quote") => {
    editorRef.current?.focus();
    restoreSelection();

    let calloutHtml = "";
    if (type === "info") {
      calloutHtml = `<div class="p-4 my-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 flex gap-3 text-sm">
        <strong class="font-bold">Info:</strong> Enter your helpful note or guidance here.
      </div><p><br></p>`;
    } else if (type === "warning") {
      calloutHtml = `<div class="p-4 my-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 flex gap-3 text-sm">
        <strong class="font-bold">Caution:</strong> Please note this important condition before continuing.
      </div><p><br></p>`;
    } else if (type === "success") {
      calloutHtml = `<div class="p-4 my-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 flex gap-3 text-sm">
        <strong class="font-bold">Tip:</strong> Recommended best practice for optimal results.
      </div><p><br></p>`;
    } else {
      calloutHtml = `<blockquote class="border-l-4 border-indigo-500 bg-slate-50 pl-4 py-2 italic my-4 text-slate-700">
        "Your quote or prominent excerpt goes here."
      </blockquote><p><br></p>`;
    }

    document.execCommand("insertHTML", false, calloutHtml);
    handleContentChange();
    setShowCalloutModal(false);
  };

  // Insert Checklist / Task item
  const handleInsertTaskList = () => {
    editorRef.current?.focus();
    const taskHtml = `<ul style="list-style: none; padding-left: 0;" class="space-y-1.5 my-3">
      <li style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" style="width: 16px; height: 16px;" /> Complete Scribd document download</li>
      <li style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" style="width: 16px; height: 16px;" /> Verify high-resolution PDF pages</li>
      <li style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" style="width: 16px; height: 16px;" /> Save to cloud storage or offline reader</li>
    </ul><p><br></p>`;
    document.execCommand("insertHTML", false, taskHtml);
    handleContentChange();
  };

  // Insert Code Block
  const handleInsertCodeBlock = () => {
    editorRef.current?.focus();
    const codeHtml = `<pre class="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto my-4"><code>// Sample code or terminal snippet
curl -X GET "https://api.example.com/v1/download" \\
  -H "Authorization: Bearer token"</code></pre><p><br></p>`;
    document.execCommand("insertHTML", false, codeHtml);
    handleContentChange();
  };

  // Keyboard Shortcuts Handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        exec("bold");
      } else if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        exec("italic");
      } else if (e.key === "u" || e.key === "U") {
        e.preventDefault();
        exec("underline");
      } else if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        openLinkModal();
      }
    }
  };

  return (
    <div
      className={`flex flex-col bg-white border border-slate-300 shadow-xs transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 m-0 rounded-none h-screen"
          : "rounded-2xl overflow-hidden relative"
      }`}
      id="modern-classic-editor"
    >
      {/* Top Toolbar Container */}
      <div className="bg-slate-50 border-b border-slate-300 p-2 select-none">
        
        {/* ROW 1: Typography, Colors, Inline Formats, and History */}
        <div className="flex items-center gap-1 flex-wrap pb-1.5 border-b border-slate-200/80">
          
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 mr-1">
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("undo")}
              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("redo")}
              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Heading / Block Style Dropdown */}
          <div className="relative">
            <select
              onChange={(e) => {
                handleFormatBlock(e.target.value);
                e.target.value = "";
              }}
              disabled={mode === "html"}
              className="text-xs font-semibold border border-slate-300 rounded-lg px-2 py-1 bg-white hover:bg-slate-50 focus:border-indigo-500 outline-none text-slate-700 h-8 disabled:opacity-50 cursor-pointer"
              title="Heading and paragraph format"
            >
              <option value="">Paragraph (Normal Text)</option>
              <option value="H1">Heading 1 (Main Title)</option>
              <option value="H2">Heading 2 (Major Section)</option>
              <option value="H3">Heading 3 (Sub-section)</option>
              <option value="H4">Heading 4</option>
              <option value="H5">Heading 5</option>
              <option value="H6">Heading 6</option>
              <option value="pre">Preformatted Code Block</option>
              <option value="blockquote">Quote Block</option>
            </select>
          </div>

          {/* Font Size Selector */}
          <div className="relative">
            <select
              onChange={(e) => {
                handleFontSize(e.target.value);
                e.target.value = "";
              }}
              disabled={mode === "html"}
              className="text-xs font-semibold border border-slate-300 rounded-lg px-2 py-1 bg-white hover:bg-slate-50 focus:border-indigo-500 outline-none text-slate-700 h-8 disabled:opacity-50 cursor-pointer"
              title="Change font size"
            >
              <option value="">Font Size...</option>
              <option value="12px">12px - Small</option>
              <option value="14px">14px - Compact</option>
              <option value="16px">16px - Standard (Default)</option>
              <option value="18px">18px - Medium</option>
              <option value="20px">20px - Large</option>
              <option value="24px">24px - Extra Large</option>
              <option value="30px">30px - 2X Large</option>
              <option value="36px">36px - Display</option>
            </select>
          </div>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Text Styles: Bold, Italic, Underline, Strikethrough */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("bold")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("italic")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("underline")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("strikeThrough")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("subscript")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Subscript (X₂)"
            >
              <Subscript className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("superscript")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Superscript (X²)"
            >
              <Superscript className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Text Color Picker */}
          <div className="relative">
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => {
                saveSelection();
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors text-xs font-bold cursor-pointer h-8"
              title="Text Color"
            >
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Color</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showColorPicker && (
              <div className="absolute top-9 left-0 z-30 w-56 p-3 bg-white border border-slate-200 rounded-xl shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Text Color</span>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleApplyColor(c.value)}
                      style={{ backgroundColor: c.value }}
                      className="w-8 h-8 rounded-lg border border-slate-300 hover:scale-110 transition-transform cursor-pointer shadow-2xs"
                      title={c.label}
                    />
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Custom Color:</span>
                  <input
                    type="color"
                    onChange={(e) => handleApplyColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    title="Choose custom color"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Highlight / Background Color Picker */}
          <div className="relative">
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => {
                saveSelection();
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors text-xs font-bold cursor-pointer h-8"
              title="Highlight / Background Color"
            >
              <Highlighter className="w-4 h-4 text-amber-500" />
              <span>Highlight</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showHighlightPicker && (
              <div className="absolute top-9 left-0 z-30 w-56 p-3 bg-white border border-slate-200 rounded-xl shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Highlight Color</span>
                  <button
                    type="button"
                    onClick={() => setShowHighlightPicker(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleApplyHighlight(c.value)}
                      style={{ backgroundColor: c.value === "transparent" ? "#ffffff" : c.value }}
                      className="w-10 h-7 rounded-lg border border-slate-300 hover:scale-105 transition-transform text-[10px] font-bold text-slate-700 flex items-center justify-center cursor-pointer shadow-2xs"
                      title={c.label}
                    >
                      {c.value === "transparent" ? "None" : ""}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Custom:</span>
                  <input
                    type="color"
                    onChange={(e) => handleApplyHighlight(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    title="Choose custom highlight"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Clear Formatting */}
          <button
            type="button"
            disabled={mode === "html"}
            onClick={() => exec("removeFormat")}
            className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            title="Remove Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>

          {/* Right Mode Toggle & Fullscreen */}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex rounded-lg overflow-hidden border border-slate-300 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setMode("visual")}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  mode === "visual"
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Visual
              </button>
              <button
                type="button"
                onClick={() => setMode("html")}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  mode === "html"
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                HTML Source
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ROW 2: Alignment, Lists, Table, Media, Links, Callouts, and Utilities */}
        <div className="flex items-center gap-1 flex-wrap pt-1.5">
          
          {/* Alignment */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("justifyLeft")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("justifyCenter")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("justifyRight")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("justifyFull")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Justify Text"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Lists: Bullet, Numbered, Checklist, Indents */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("insertUnorderedList")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Bulleted List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("insertOrderedList")}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={handleInsertTaskList}
              className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              title="Task / Checklist List"
            >
              <ListTodo className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("outdent")}
              className="p-1 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors text-xs font-bold"
              title="Decrease Indent"
            >
              &laquo;
            </button>
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => exec("indent")}
              className="p-1 text-slate-500 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors text-xs font-bold"
              title="Increase Indent"
            >
              &raquo;
            </button>
          </div>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Link Insertion */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled={mode === "html"}
              onClick={openLinkModal}
              className={`p-1.5 rounded-lg disabled:opacity-40 transition-colors cursor-pointer ${
                isCaretOnLink ? "bg-indigo-100 text-indigo-700 font-bold" : "text-slate-700 hover:bg-slate-200"
              }`}
              title="Insert or Edit Link (Ctrl+K)"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            {isCaretOnLink && (
              <button
                type="button"
                disabled={mode === "html"}
                onClick={handleRemoveLink}
                className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
                title="Remove Link"
              >
                <Unlink className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Image Insertion */}
          <button
            type="button"
            disabled={mode === "html"}
            onClick={openImageModal}
            className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors text-xs font-bold cursor-pointer h-8"
            title="Insert Image (URL or Upload)"
          >
            <ImageIcon className="w-4 h-4 text-sky-600" />
            <span>Image</span>
          </button>

          {/* Table Insertion */}
          <button
            type="button"
            disabled={mode === "html"}
            onClick={openTableModal}
            className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors text-xs font-bold cursor-pointer h-8"
            title="Insert Responsive Table"
          >
            <Table className="w-4 h-4 text-emerald-600" />
            <span>Table</span>
          </button>

          <div className="w-px h-5 bg-slate-300 mx-1" />

          {/* Callout Boxes / Quotes */}
          <div className="relative">
            <button
              type="button"
              disabled={mode === "html"}
              onClick={() => {
                saveSelection();
                setShowCalloutModal(!showCalloutModal);
              }}
              className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors text-xs font-bold cursor-pointer h-8"
              title="Insert Callout or Quote"
            >
              <Quote className="w-4 h-4 text-purple-600" />
              <span>Callout</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showCalloutModal && (
              <div className="absolute top-9 left-0 z-30 w-52 p-2 bg-white border border-slate-200 rounded-xl shadow-xl space-y-1">
                <button
                  type="button"
                  onClick={() => handleInsertCallout("info")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-xs font-semibold text-blue-900 flex items-center gap-2 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Info Note Box</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertCallout("warning")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-xs font-semibold text-amber-900 flex items-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Warning Box</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertCallout("success")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-xs font-semibold text-emerald-900 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tip / Success Box</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertCallout("quote")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-xs font-semibold text-purple-900 flex items-center gap-2 cursor-pointer"
                >
                  <Quote className="w-3.5 h-3.5 text-purple-600" />
                  <span>Blockquote</span>
                </button>
              </div>
            )}
          </div>

          {/* Horizontal Line Divider */}
          <button
            type="button"
            disabled={mode === "html"}
            onClick={() => exec("insertHorizontalRule")}
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            title="Insert Horizontal Divider Line"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Code Snippet Block */}
          <button
            type="button"
            disabled={mode === "html"}
            onClick={handleInsertCodeBlock}
            className="p-1.5 text-slate-700 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
            title="Insert Code Block"
          >
            <FileCode className="w-4 h-4 text-slate-700" />
          </button>

          {/* Shortcuts Help */}
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer ml-auto"
            title="Keyboard Shortcuts Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* CONTEXTUAL TABLE BAR: Appears only when cursor is inside a table cell */}
        {activeTableElement && mode === "visual" && (
          <div className="mt-2 pt-2 border-t border-indigo-200 bg-indigo-50/70 -mx-2 px-3 py-1.5 flex items-center justify-between gap-2 flex-wrap rounded-b-lg animate-fade-in">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                <Table className="w-3.5 h-3.5 text-indigo-600" />
                Table Tools:
              </span>
              <button
                type="button"
                onClick={() => addTableRow(true)}
                className="px-2 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded text-xs font-semibold cursor-pointer shadow-2xs"
              >
                + Row Above
              </button>
              <button
                type="button"
                onClick={() => addTableRow(false)}
                className="px-2 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded text-xs font-semibold cursor-pointer shadow-2xs"
              >
                + Row Below
              </button>
              <button
                type="button"
                onClick={deleteTableRow}
                className="px-2 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs font-semibold cursor-pointer shadow-2xs"
              >
                - Delete Row
              </button>

              <div className="w-px h-4 bg-indigo-200 mx-1" />

              <button
                type="button"
                onClick={() => addTableColumn(true)}
                className="px-2 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded text-xs font-semibold cursor-pointer shadow-2xs"
              >
                + Col Left
              </button>
              <button
                type="button"
                onClick={() => addTableColumn(false)}
                className="px-2 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded text-xs font-semibold cursor-pointer shadow-2xs"
              >
                + Col Right
              </button>
              <button
                type="button"
                onClick={deleteTableColumn}
                className="px-2 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs font-semibold cursor-pointer shadow-2xs"
              >
                - Delete Col
              </button>
            </div>

            <button
              type="button"
              onClick={deleteEntireTable}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Table</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Visual / Source Editor Body */}
      <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
        {mode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            onBlur={handleContentChange}
            onKeyUp={detectActiveContext}
            onMouseUp={detectActiveContext}
            onKeyDown={handleKeyDown}
            data-placeholder={placeholder}
            className={`w-full bg-white p-6 sm:p-8 outline-none prose prose-slate max-w-none focus:ring-0 leading-relaxed ${
              isFullscreen ? "h-[calc(100vh-135px)] overflow-y-auto" : "h-[500px] overflow-y-auto"
            }`}
            style={{ minHeight }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="<!-- Write raw HTML here -->"
            className={`w-full bg-slate-900 text-emerald-400 p-6 sm:p-8 outline-none font-mono text-xs sm:text-sm leading-relaxed ${
              isFullscreen ? "h-[calc(100vh-135px)] overflow-y-auto" : "h-[500px] overflow-y-auto"
            }`}
            style={{ minHeight }}
            spellCheck={false}
          />
        )}
      </div>

      {/* Bottom Status & Diagnostics Bar */}
      <div className="bg-slate-100 border-t border-slate-300 px-4 py-2 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2 select-none">
        <div className="flex items-center gap-4">
          <span className="font-semibold">
            Words: <strong className="text-slate-900">{stats.words.toLocaleString()}</strong>
          </span>
          <span className="font-semibold">
            Characters: <strong className="text-slate-900">{stats.characters.toLocaleString()}</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">~{stats.readingTime} min read</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
            Path: {currentPath}
          </span>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            {mode === "visual" ? "WYSIWYG Visual Mode" : "Raw HTML Mode"}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: INSERT / EDIT LINK                                   */}
      {/* ------------------------------------------------------------- */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-indigo-600" />
                <span>Insert / Edit Link</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Link URL (Web Address)</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/guide or /how-it-works"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Display Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Read full guide here"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={linkTargetBlank}
                  onChange={(e) => setLinkTargetBlank(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Open link in new browser tab (`target="_blank"`)</span>
              </label>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {isCaretOnLink ? (
                  <button
                    type="button"
                    onClick={handleRemoveLink}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800"
                  >
                    Remove Link
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Insert Link
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: INSERT IMAGE (URL OR UPLOAD)                         */}
      {/* ------------------------------------------------------------- */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-sky-600" />
                <span>Insert Image</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs: URL vs Local File */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setImageSourceType("url")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  imageSourceType === "url"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Image URL
              </button>
              <button
                type="button"
                onClick={() => setImageSourceType("upload")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  imageSourceType === "upload"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Upload from Device
              </button>
            </div>

            <form onSubmit={handleConfirmImage} className="space-y-4">
              {imageSourceType === "url" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Image URL</label>
                  <input
                    type="url"
                    required={imageSourceType === "url"}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Choose Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="w-full px-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-medium text-slate-700 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                  />
                  {imageUrl && imageUrl.startsWith("data:") && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-40 bg-slate-100 flex items-center justify-center">
                      <img src={imageUrl} alt="Preview" className="max-h-40 object-contain" />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Alt Text (SEO &amp; Access)</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Describe image..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Width</label>
                  <select
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                  >
                    <option value="100%">100% (Full Width)</option>
                    <option value="75%">75% (Large)</option>
                    <option value="50%">50% (Medium)</option>
                    <option value="35%">35% (Compact)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Alignment</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "center", label: "Center" },
                    { id: "left", label: "Float Left" },
                    { id: "right", label: "Float Right" },
                    { id: "full", label: "Full Block" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setImageAlign(item.id as any)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        imageAlign === item.id
                          ? "bg-sky-50 border-sky-400 text-sky-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Caption (Optional)</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. Figure 1: Scribd document preview screen"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!imageUrl}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: INSERT TABLE                                         */}
      {/* ------------------------------------------------------------- */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Table className="w-5 h-5 text-emerald-600" />
                <span>Insert Table</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmTable} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Rows className="w-3.5 h-3.5 text-slate-400" />
                    <span>Rows</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={tableRows}
                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Columns className="w-3.5 h-3.5 text-slate-400" />
                    <span>Columns</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={tableCols}
                    onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={tableHasHeader}
                  onChange={(e) => setTableHasHeader(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Include styled header row (`&lt;thead&gt;`)</span>
              </label>

              {/* Table Preview Grid */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] font-bold text-slate-500 mb-2">Structure Preview:</div>
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${tableCols}, minmax(0, 1fr))` }}>
                  {Array.from({ length: tableCols }).map((_, i) => (
                    <div
                      key={`h-${i}`}
                      className={`h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                        tableHasHeader ? "bg-slate-300 text-slate-700" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      H
                    </div>
                  ))}
                  {Array.from({ length: Math.min(tableRows, 4) }).map((_, r) =>
                    Array.from({ length: tableCols }).map((_, c) => (
                      <div key={`c-${r}-${c}`} className="h-4 bg-white border border-slate-200 rounded" />
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: KEYBOARD SHORTCUTS GUIDE                             */}
      {/* ------------------------------------------------------------- */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Editor Keyboard Shortcuts</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { keys: "Ctrl + B / ⌘ + B", action: "Bold selected text" },
                { keys: "Ctrl + I / ⌘ + I", action: "Italicize selected text" },
                { keys: "Ctrl + U / ⌘ + U", action: "Underline selected text" },
                { keys: "Ctrl + K / ⌘ + K", action: "Insert or edit hyperlink" },
                { keys: "Ctrl + Z / ⌘ + Z", action: "Undo last edit" },
                { keys: "Ctrl + Y / ⌘ + Y", action: "Redo last edit" },
                { keys: "Tab / Shift + Tab", action: "Indent or outdent list items" },
              ].map((s) => (
                <div key={s.keys} className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-800">
                    {s.keys}
                  </span>
                  <span className="text-slate-600 font-medium">{s.action}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
