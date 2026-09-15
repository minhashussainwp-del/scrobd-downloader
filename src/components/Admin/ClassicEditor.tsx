import React, { useRef, useEffect, useState } from "react";
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Link, Image as ImageIcon, Undo, Redo, 
  RemoveFormatting, Maximize, Code, Quote, Type 
} from "lucide-react";

interface ClassicEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function ClassicEditor({ value, onChange }: ClassicEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState<"visual" | "html">("visual");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && mode === "visual") {
      editorRef.current.innerHTML = value || "";
    }
  }, [mode]); // Update when switching back to visual

  const exec = (command: string, arg?: string) => {
    if (mode === "html") return;
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleChange();
  };

  const handleInsertLink = () => {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  const handleInsertImage = () => {
    const url = prompt("Enter Image URL:");
    if (url) exec("insertImage", url);
  };

  const handleChange = () => {
    if (editorRef.current && mode === "visual") {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleHeading = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "p") exec("formatBlock", "<P>");
    else exec("formatBlock", `<${val}>`);
    e.target.value = "";
  };

  return (
    <div className={`flex flex-col bg-white border border-slate-300 ${isFullscreen ? 'fixed inset-0 z-50 m-0' : 'rounded-lg overflow-hidden relative'}`}>
      <div className="flex items-center justify-between bg-slate-50 border-b border-slate-300 p-1 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap p-1">
          <select 
            onChange={handleHeading} 
            disabled={mode === "html"}
            className="text-sm border border-slate-300 rounded px-2 py-1 bg-white hover:bg-slate-50 outline-none text-slate-700 h-8"
          >
            <option value="">Paragraph...</option>
            <option value="H1">Heading 1</option>
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
            <option value="H4">Heading 4</option>
            <option value="H5">Heading 5</option>
            <option value="H6">Heading 6</option>
            <option value="PRE">Preformatted</option>
          </select>

          <div className="w-px h-6 bg-slate-300 mx-1"></div>

          <button type="button" disabled={mode === "html"} onClick={() => exec('bold')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50" title="Bold"><Bold className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={() => exec('italic')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50" title="Italic"><Italic className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={() => exec('underline')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50" title="Underline"><Underline className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={() => exec('strikeThrough')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50" title="Strikethrough"><span className="line-through font-bold text-xs leading-none">S</span></button>

          <div className="w-px h-6 bg-slate-300 mx-1"></div>

          <button type="button" disabled={mode === "html"} onClick={() => exec('justifyLeft')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50"><AlignLeft className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={() => exec('justifyCenter')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50"><AlignCenter className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={() => exec('justifyRight')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50"><AlignRight className="w-4 h-4" /></button>

          <div className="w-px h-6 bg-slate-300 mx-1"></div>

          <button type="button" disabled={mode === "html"} onClick={() => exec('insertUnorderedList')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50"><List className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={() => exec('insertOrderedList')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50"><ListOrdered className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={() => exec('formatBlock', 'BLOCKQUOTE')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50"><Quote className="w-4 h-4" /></button>

          <div className="w-px h-6 bg-slate-300 mx-1"></div>

          <button type="button" disabled={mode === "html"} onClick={handleInsertLink} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50"><Link className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={handleInsertImage} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50"><ImageIcon className="w-4 h-4" /></button>
          
          <div className="w-px h-6 bg-slate-300 mx-1"></div>

          <button type="button" disabled={mode === "html"} onClick={() => exec('removeFormat')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50" title="Remove Formatting"><RemoveFormatting className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={() => exec('undo')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50" title="Undo"><Undo className="w-4 h-4" /></button>
          <button type="button" disabled={mode === "html"} onClick={() => exec('redo')} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50" title="Redo"><Redo className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-1 p-1 pr-2">
          <div className="flex rounded overflow-hidden border border-slate-300 mr-2">
            <button 
              type="button"
              onClick={() => setMode("visual")}
              className={`px-3 py-1 text-xs font-semibold ${mode === "visual" ? "bg-slate-200 text-slate-900" : "bg-white text-slate-500"}`}
            >
              Visual
            </button>
            <button 
              type="button"
              onClick={() => setMode("html")}
              className={`px-3 py-1 text-xs font-semibold ${mode === "html" ? "bg-slate-200 text-slate-900" : "bg-white text-slate-500"}`}
            >
              Text (HTML)
            </button>
          </div>
          <button type="button" onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 relative overflow-hidden">
        {mode === "visual" ? (
          <div 
            ref={editorRef}
            contentEditable 
            onInput={handleChange}
            onBlur={handleChange}
            className={`w-full bg-white p-6 outline-none prose prose-slate max-w-none ${isFullscreen ? 'h-[calc(100vh-53px)] overflow-y-auto' : 'min-h-[400px] h-[500px] overflow-y-auto'}`}
            style={{ minHeight: "400px" }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-slate-900 text-slate-100 p-6 outline-none font-mono text-sm ${isFullscreen ? 'h-[calc(100vh-53px)] overflow-y-auto' : 'min-h-[400px] h-[500px] overflow-y-auto'}`}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
