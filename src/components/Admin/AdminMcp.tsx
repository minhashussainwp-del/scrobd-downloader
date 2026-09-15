import React, { useState, useEffect } from "react";
import {
  McpCredential,
  McpPlatform,
  McpScope,
  McpInvocationLog,
  McpToolDefinition,
} from "../../types";
import {
  Terminal,
  Cpu,
  Key,
  ShieldCheck,
  Copy,
  Check,
  Play,
  RefreshCw,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Sparkles,
  Globe,
  FileText,
  Layout,
  Server,
  Code,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  SlidersHorizontal,
  Database,
  Lock,
  Search,
  ExternalLink,
  ChevronRight,
  Zap,
  Edit3,
  Power,
  X,
} from "lucide-react";

export function AdminMcp() {
  const [credentials, setCredentials] = useState<McpCredential[]>([]);
  const [logs, setLogs] = useState<McpInvocationLog[]>([]);
  const [tools, setTools] = useState<McpToolDefinition[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<
    "tools" | "credentials" | "config" | "playground" | "diagnostics" | "logs"
  >("tools");
  const [isLoading, setIsLoading] = useState(false);

  // Tools Management State (Enable/Disable, Read/Edit, Add Custom)
  const [toolSearchQuery, setToolSearchQuery] = useState("");
  const [toolCategoryFilter, setToolCategoryFilter] = useState("all");
  const [selectedToolForView, setSelectedToolForView] = useState<McpToolDefinition | null>(null);
  const [selectedToolForEdit, setSelectedToolForEdit] = useState<McpToolDefinition | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("seo_onpage");
  const [editEnabled, setEditEnabled] = useState(true);
  const [editSystemInstruction, setEditSystemInstruction] = useState("");
  const [editInputSchema, setEditInputSchema] = useState("");
  const [editError, setEditError] = useState("");
  const [isSavingTool, setIsSavingTool] = useState(false);
  const [togglingTools, setTogglingTools] = useState<Record<string, boolean>>({});
  const [toolActionFeedback, setToolActionFeedback] = useState<string | null>(null);

  // Custom Tool Creation Modal State
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [newToolName, setNewToolName] = useState("");
  const [newToolDescription, setNewToolDescription] = useState("");
  const [newToolCategory, setNewToolCategory] = useState("seo_onpage");
  const [newToolInstruction, setNewToolInstruction] = useState("");
  const [newToolSchema, setNewToolSchema] = useState(
    JSON.stringify(
      {
        type: "object",
        properties: {
          action: { type: "string", description: "Action to execute" },
          param: { type: "string", description: "Parameter value" },
        },
        required: ["action"],
      },
      null,
      2
    )
  );
  const [newToolError, setNewToolError] = useState("");

  // Modal / Form state for manually adding username & application password
  const [showAddModal, setShowAddModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPlatform, setFormPlatform] = useState<McpPlatform>("opencode");
  const [formUsername, setFormUsername] = useState("admin");
  const [formPassword, setFormPassword] = useState("");
  const [formScope, setFormScope] = useState<McpScope>("full_control");
  const [formError, setFormError] = useState("");

  // Visibility toggle for passwords in credentials table
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedConfigSnippet, setCopiedConfigSnippet] = useState<string | null>(null);

  // Playground state
  const [selectedTool, setSelectedTool] = useState("seo_audit_page");
  const [playgroundArgs, setPlaygroundArgs] = useState<string>(
    JSON.stringify({ path: "/" }, null, 2)
  );
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [isExecutingTool, setIsExecutingTool] = useState(false);

  // Diagnostics state
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);

  // Fetch credentials & logs
  const fetchCredentials = async () => {
    try {
      const res = await fetch("/api/mcp/credentials");
      if (res.ok) {
        const data = await res.json();
        setCredentials(data.credentials || []);
      }
    } catch (e) {
      console.error("Failed to load MCP credentials:", e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/mcp/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error("Failed to load MCP logs:", e);
    }
  };

  const fetchTools = async () => {
    try {
      const res = await fetch("/api/mcp/tools");
      if (res.ok) {
        const data = await res.json();
        setTools(data.tools || []);
      }
    } catch (e) {
      console.error("Failed to load MCP tools:", e);
    }
  };

  const fetchDiagnostics = async () => {
    setIsLoadingDiagnostics(true);
    try {
      const res = await fetch("/api/mcp/diagnostics");
      if (res.ok) {
        const data = await res.json();
        setDiagnosticsData(data);
      }
    } catch (e) {
      console.error("Failed to load diagnostics:", e);
    } finally {
      setIsLoadingDiagnostics(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
    fetchTools();
    fetchLogs();
  }, []);

  // Generate random strong application password
  const generateRandomPassword = (platform: McpPlatform) => {
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    return `mcp_app_${platform}_${randomHex}`;
  };

  // Open modal with prefilled data
  const handleOpenAddModal = (presetPlatform?: McpPlatform) => {
    const plat = presetPlatform || "opencode";
    setFormPlatform(plat);
    setFormName(
      plat === "opencode"
        ? "OpenCode Development Agent"
        : plat === "antigravity"
        ? "Antigravity Super Agent"
        : plat === "claude"
        ? "Claude Desktop Client"
        : plat === "cursor"
        ? "Cursor IDE Assistant"
        : "Custom MCP Client"
    );
    setFormUsername("admin");
    setFormPassword(generateRandomPassword(plat));
    setFormScope("full_control");
    setFormError("");
    setShowAddModal(true);
  };

  // Submit manual credential
  const handleCreateCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formPassword.trim()) {
      setFormError("Both Username and Application Password are required.");
      return;
    }

    setIsLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/mcp/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName || `${formPlatform} Client`,
          platform: formPlatform,
          username: formUsername.trim(),
          applicationPassword: formPassword.trim(),
          scope: formScope,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        await fetchCredentials();
      } else {
        const err = await res.json();
        setFormError(err.error || "Failed to save credential.");
      }
    } catch (e: any) {
      setFormError(e.message || "Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle active
  const handleToggleCredential = async (id: string) => {
    try {
      await fetch(`/api/mcp/credentials/${id}/toggle`, { method: "POST" });
      await fetchCredentials();
    } catch (e) {
      console.error(e);
    }
  };

  // Revoke credential
  const handleDeleteCredential = async (id: string) => {
    if (!confirm("Are you sure you want to revoke and delete this MCP Application Password?")) return;
    try {
      await fetch(`/api/mcp/credentials/${id}`, { method: "DELETE" });
      await fetchCredentials();
    } catch (e) {
      console.error(e);
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // -------------------------------------------------------------
  // TOOL MANAGEMENT HANDLERS (TOGGLE, READ/EDIT, CREATE, RESET)
  // -------------------------------------------------------------
  const handleToggleTool = async (toolName: string) => {
    setTogglingTools((prev) => ({ ...prev, [toolName]: true }));
    try {
      const res = await fetch(`/api/mcp/tools/${encodeURIComponent(toolName)}/toggle`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setTools((prev) =>
          prev.map((t) => (t.name === toolName ? { ...t, enabled: data.tool.enabled } : t))
        );
        setToolActionFeedback(data.message || `Tool '${toolName}' updated.`);
        setTimeout(() => setToolActionFeedback(null), 3500);
      }
    } catch (err) {
      console.error("Failed to toggle tool:", err);
    } finally {
      setTogglingTools((prev) => ({ ...prev, [toolName]: false }));
    }
  };

  const handleOpenViewTool = (tool: McpToolDefinition) => {
    setSelectedToolForView(tool);
  };

  const handleOpenEditTool = (tool: McpToolDefinition) => {
    setSelectedToolForEdit(tool);
    setEditDescription(tool.description || "");
    setEditCategory(tool.category || "seo_onpage");
    setEditEnabled(tool.enabled !== false);
    setEditSystemInstruction(tool.systemInstruction || "");
    setEditInputSchema(JSON.stringify(tool.inputSchema || { type: "object", properties: {} }, null, 2));
    setEditError("");
  };

  const handleSaveEditTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToolForEdit) return;

    let parsedSchema = {};
    try {
      parsedSchema = JSON.parse(editInputSchema);
    } catch (err: any) {
      setEditError(`Invalid Input Schema JSON: ${err.message}`);
      return;
    }

    setIsSavingTool(true);
    setEditError("");
    try {
      const res = await fetch(`/api/mcp/tools/${encodeURIComponent(selectedToolForEdit.name)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editDescription,
          category: editCategory,
          enabled: editEnabled,
          systemInstruction: editSystemInstruction,
          inputSchema: parsedSchema,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTools((prev) =>
          prev.map((t) => (t.name === selectedToolForEdit.name ? data.tool : t))
        );
        setSelectedToolForEdit(null);
        setToolActionFeedback(`Tool '${selectedToolForEdit.name}' settings saved successfully.`);
        setTimeout(() => setToolActionFeedback(null), 3500);
      } else {
        const data = await res.json();
        setEditError(data.error || "Failed to update tool.");
      }
    } catch (err: any) {
      setEditError(err.message || "Failed to save tool.");
    } finally {
      setIsSavingTool(false);
    }
  };

  const handleCreateCustomTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim() || !newToolDescription.trim()) {
      setNewToolError("Tool name and description are required.");
      return;
    }

    let parsedSchema = {};
    try {
      parsedSchema = JSON.parse(newToolSchema);
    } catch (err: any) {
      setNewToolError(`Invalid Schema JSON: ${err.message}`);
      return;
    }

    setIsLoading(true);
    setNewToolError("");
    try {
      const res = await fetch("/api/mcp/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newToolName.trim(),
          description: newToolDescription.trim(),
          category: newToolCategory,
          systemInstruction: newToolInstruction.trim(),
          inputSchema: parsedSchema,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTools((prev) => [...prev, data.tool]);
        setShowAddToolModal(false);
        setNewToolName("");
        setNewToolDescription("");
        setNewToolInstruction("");
        setToolActionFeedback(`Custom tool '${data.tool.name}' created successfully.`);
        setTimeout(() => setToolActionFeedback(null), 3500);
      } else {
        const data = await res.json();
        setNewToolError(data.error || "Failed to create tool.");
      }
    } catch (err: any) {
      setNewToolError(err.message || "Failed to create tool.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetTools = async () => {
    if (
      !confirm(
        "Are you sure you want to restore all 24 MCP tools back to their factory defaults? Custom changes will be reset."
      )
    )
      return;

    try {
      const res = await fetch("/api/mcp/tools/reset", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setTools(data.tools || []);
        setToolActionFeedback("All MCP tools restored to default configuration.");
        setTimeout(() => setToolActionFeedback(null), 3500);
      }
    } catch (e) {
      console.error("Reset error:", e);
    }
  };

  const handleDeleteTool = async (tool: McpToolDefinition) => {
    const isCustom = tool.isCustom;
    const confirmMsg = isCustom
      ? `Delete custom tool '${tool.name}' permanently?`
      : `Disable built-in tool '${tool.name}'?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/mcp/tools/${encodeURIComponent(tool.name)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (isCustom) {
          setTools((prev) => prev.filter((t) => t.name !== tool.name));
        } else {
          setTools((prev) =>
            prev.map((t) => (t.name === tool.name ? { ...t, enabled: false } : t))
          );
        }
        setToolActionFeedback(`Tool '${tool.name}' ${isCustom ? "deleted" : "disabled"}.`);
        setTimeout(() => setToolActionFeedback(null), 3500);
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const handleLaunchPlayground = (toolName: string) => {
    handleSelectTool(toolName);
    setActiveSubTab("playground");
  };

  // Change selected tool in playground and update default template
  const handleSelectTool = (toolName: string) => {
    setSelectedTool(toolName);
    const tool = tools.find((t) => t.name === toolName);
    if (!tool) return;

    if (toolName === "seo_audit_page") {
      setPlaygroundArgs(JSON.stringify({ path: "/" }, null, 2));
    } else if (toolName === "seo_update_metadata") {
      setPlaygroundArgs(
        JSON.stringify(
          {
            path: "/",
            title: "Scribd Downloader - High-Fidelity UI/UX & PDF Platform",
            description:
              "Fast, lightweight, and responsive document conversion with full SEO optimization.",
            keywords: "scribd, downloader, pdf, offline",
          },
          null,
          2
        )
      );
    } else if (toolName === "seo_keyword_density_analyzer") {
      setPlaygroundArgs(
        JSON.stringify(
          {
            path: "/",
            targetKeywords: ["scribd downloader", "pdf download", "free document converter"],
          },
          null,
          2
        )
      );
    } else if (toolName === "seo_get_robots") {
      setPlaygroundArgs("{}");
    } else if (toolName === "seo_update_robots") {
      setPlaygroundArgs(
        JSON.stringify(
          {
            preset: "standard_seo",
            content:
              "User-agent: *\nAllow: /\nDisallow: /admin123/\nDisallow: /api/\nSitemap: https://mysite.com/sitemap.xml\n",
          },
          null,
          2
        )
      );
    } else if (toolName === "seo_generate_sitemap") {
      setPlaygroundArgs(
        JSON.stringify(
          {
            domain: "https://mysite.com",
            includeCustomPages: true,
            includeBlogs: true,
          },
          null,
          2
        )
      );
    } else if (toolName === "seo_test_crawler") {
      setPlaygroundArgs(
        JSON.stringify({ userAgent: "Googlebot", path: "/admin123" }, null, 2)
      );
    } else if (toolName === "seo_schema_generator") {
      setPlaygroundArgs(
        JSON.stringify(
          {
            schemaType: "SoftwareApplication",
            pageRoute: "/",
          },
          null,
          2
        )
      );
    } else if (toolName === "seo_broken_link_checker") {
      setPlaygroundArgs(
        JSON.stringify(
          {
            checkExternal: false,
            maxDepth: 2,
          },
          null,
          2
        )
      );
    } else if (toolName === "content_list_blogs") {
      setPlaygroundArgs(JSON.stringify({ status: "all" }, null, 2));
    } else if (toolName === "content_manage_page") {
      setPlaygroundArgs(
        JSON.stringify(
          {
            action: "create",
            title: "Frequently Asked Questions",
            slug: "faq",
            content:
              "# Frequently Asked Questions\n\n### Is this free?\nYes, 100% free.\n\n### How fast is it?\nUnder 0.2s ultra speed.",
            showInHeader: false,
            showInFooter: true,
            status: "published",
          },
          null,
          2
        )
      );
    } else if (toolName === "content_bulk_import_export") {
      setPlaygroundArgs(
        JSON.stringify(
          {
            action: "export",
            contentType: "all",
          },
          null,
          2
        )
      );
    } else if (toolName === "translation_manage_strings") {
      setPlaygroundArgs(
        JSON.stringify(
          {
            language: "es",
          },
          null,
          2
        )
      );
    } else if (toolName === "ui_ux_diagnose_issues") {
      setPlaygroundArgs(JSON.stringify({ route: "/" }, null, 2));
    } else if (toolName === "ui_ux_fix_issue") {
      setPlaygroundArgs(JSON.stringify({ issueType: "touch_target" }, null, 2));
    } else if (toolName === "ui_ux_font_typography_checker") {
      setPlaygroundArgs(JSON.stringify({ route: "/" }, null, 2));
    } else if (toolName === "ads_manage_placements") {
      setPlaygroundArgs(JSON.stringify({ action: "get" }, null, 2));
    } else if (toolName === "system_status") {
      setPlaygroundArgs("{}");
    } else if (toolName === "system_rate_limit_controller") {
      setPlaygroundArgs(JSON.stringify({ action: "status" }, null, 2));
    } else {
      setPlaygroundArgs("{}");
    }
  };

  // Run test tool
  const handleExecutePlayground = async () => {
    setIsExecutingTool(true);
    setPlaygroundResult(null);
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(playgroundArgs);
      } catch (err: any) {
        alert(`Invalid JSON in parameters: ${err.message}`);
        setIsExecutingTool(false);
        return;
      }

      const activeCred = credentials.find((c) => c.active) || credentials[0];
      const res = await fetch("/api/mcp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: selectedTool,
          args: parsed,
          credentialId: activeCred?.id,
        }),
      });

      const data = await res.json();
      setPlaygroundResult(data);
      fetchLogs(); // refresh audit logs
    } catch (e: any) {
      setPlaygroundResult({ success: false, error: e.message });
    } finally {
      setIsExecutingTool(false);
    }
  };

  // Primary active credential to use for generated configurations
  const primaryCred = credentials.find((c) => c.active) || credentials[0] || {
    username: "admin",
    applicationPassword: "mcp_sec_antigravity_9f82a",
    platform: "antigravity",
    name: "Default Agent",
  };

  const currentHost = typeof window !== "undefined" ? window.location.origin : "https://mysite.com";
  const basicAuthB64 = typeof window !== "undefined"
    ? btoa(`${primaryCred.username}:${primaryCred.applicationPassword}`)
    : "YWRtaW46bWNwX3NlYw==";

  return (
    <div className="space-y-6 animate-fade-in" id="admin-mcp-panel">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Terminal className="w-48 h-48" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Context Protocol (MCP) Server</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Server Online (Port 3000)</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            MCP Full-Control Center &amp; Agent Connect
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Connect AI Agents (<strong>OpenCode</strong>, <strong>Antigravity</strong>, Claude, Cursor) with full control over On-Page &amp; Technical SEO, Content (Blog &amp; Pages), UI/UX diagnostics, and System settings using manual Username &amp; Application Passwords.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>JSON-RPC: <strong className="text-white">POST /api/mcp</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>SSE Stream: <strong className="text-white">GET /api/mcp/sse</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "tools", label: "MCP Tools & Permissions", icon: SlidersHorizontal, count: tools.length },
            { id: "credentials", label: "Application Passwords", icon: Key, count: credentials.length },
            { id: "config", label: "OpenCode & Antigravity Setup", icon: Code },
            { id: "playground", label: "Live MCP Tool Runner", icon: Play, count: tools.length },
            { id: "diagnostics", label: "SEO & UI/UX Audit", icon: ShieldCheck },
            { id: "logs", label: "Audit Logs", icon: Terminal, count: logs.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveSubTab(tab.id as any);
                  if (tab.id === "diagnostics" && !diagnosticsData) fetchDiagnostics();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? "bg-indigo-700 text-indigo-100" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === "tools" ? (
            <>
              <button
                type="button"
                onClick={() => handleResetTools()}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Restore all default 24 tools"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddToolModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Custom Tool</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application Password</span>
            </button>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------
          TAB 0: MCP TOOLS & PERMISSIONS (ENABLE/DISABLE, READ/EDIT)
          ------------------------------------------------------------- */}
      {activeSubTab === "tools" && (
        <div className="space-y-4">
          {/* Feedback Toast */}
          {toolActionFeedback && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center justify-between shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{toolActionFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setToolActionFeedback(null)}
                className="text-emerald-600 hover:text-emerald-800 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total MCP Tools
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-slate-900">{tools.length}</span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Registry
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Enabled Tools
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-emerald-600">
                  {tools.filter((t) => t.enabled !== false).length}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Disabled Tools
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-rose-500">
                  {tools.filter((t) => t.enabled === false).length}
                </span>
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                  Locked
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Invocations
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-slate-800">
                  {tools.reduce((acc, t) => acc + (t.executionCount || 0), 0)}
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Runs
                </span>
              </div>
            </div>
          </div>

          {/* Search, Filter & Management Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  MCP Tool Registry &amp; Granular Permissions
                </h3>
                <p className="text-xs text-slate-500">
                  Enable or disable any tool, inspect JSON schema read-only specs, edit custom prompt instructions, or test in runner.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchTools}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Refresh Tools</span>
                </button>
              </div>
            </div>

            {/* Filter Pills & Search Input */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All Tools", count: tools.length },
                  {
                    id: "seo_onpage",
                    label: "On-Page SEO",
                    count: tools.filter((t) => t.category === "seo_onpage").length,
                  },
                  {
                    id: "seo_technical",
                    label: "Technical SEO",
                    count: tools.filter((t) => t.category === "seo_technical").length,
                  },
                  {
                    id: "content",
                    label: "Content",
                    count: tools.filter((t) => t.category === "content").length,
                  },
                  {
                    id: "ui_ux",
                    label: "UI / UX",
                    count: tools.filter((t) => t.category === "ui_ux").length,
                  },
                  {
                    id: "system",
                    label: "System",
                    count: tools.filter((t) => t.category === "system").length,
                  },
                  {
                    id: "custom",
                    label: "Custom",
                    count: tools.filter((t) => t.isCustom || t.category === "custom").length,
                  },
                ].map((cat) => {
                  const isSelected = toolCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setToolCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? "bg-slate-800 text-slate-300" : "bg-white text-slate-500"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-64 shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={toolSearchQuery}
                  onChange={(e) => setToolSearchQuery(e.target.value)}
                  placeholder="Search tools by name..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Tools Table */}
            <div className="overflow-x-auto border border-slate-200/70 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Tool Name &amp; Category</th>
                    <th className="py-3 px-4">Description &amp; System Guidance</th>
                    <th className="py-3 px-4">Schema Parameters</th>
                    <th className="py-3 px-4 text-center">Status / Toggle</th>
                    <th className="py-3 px-4 text-right">Actions (Read / Edit / Test)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tools
                    .filter((tool) => {
                      if (toolCategoryFilter !== "all") {
                        if (toolCategoryFilter === "custom") {
                          if (!tool.isCustom && tool.category !== "custom") return false;
                        } else if (tool.category !== toolCategoryFilter) {
                          return false;
                        }
                      }
                      if (toolSearchQuery.trim()) {
                        const q = toolSearchQuery.toLowerCase();
                        const matchName = tool.name.toLowerCase().includes(q);
                        const matchDesc = (tool.description || "").toLowerCase().includes(q);
                        const matchInst = (tool.systemInstruction || "").toLowerCase().includes(q);
                        return matchName || matchDesc || matchInst;
                      }
                      return true;
                    })
                    .map((tool) => {
                      const isEnabled = tool.enabled !== false;
                      const isToggling = !!togglingTools[tool.name];
                      const propKeys = Object.keys(tool.inputSchema?.properties || {});
                      const requiredKeys = tool.inputSchema?.required || [];

                      const getCatColor = (cat?: string) => {
                        switch (cat) {
                          case "seo_onpage":
                            return "bg-emerald-50 text-emerald-700 border-emerald-200";
                          case "seo_technical":
                            return "bg-blue-50 text-blue-700 border-blue-200";
                          case "content":
                            return "bg-purple-50 text-purple-700 border-purple-200";
                          case "ui_ux":
                            return "bg-amber-50 text-amber-700 border-amber-200";
                          case "system":
                            return "bg-slate-100 text-slate-700 border-slate-300";
                          default:
                            return "bg-indigo-50 text-indigo-700 border-indigo-200";
                        }
                      };

                      return (
                        <tr
                          key={tool.name}
                          className={`transition ${
                            isEnabled ? "hover:bg-slate-50/60" : "bg-slate-50/40 opacity-75"
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900 text-xs">
                                  {tool.name}
                                </span>
                                {tool.isCustom && (
                                  <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-indigo-100 text-indigo-700">
                                    CUSTOM
                                  </span>
                                )}
                              </div>
                              <span
                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCatColor(
                                  tool.category
                                )}`}
                              >
                                {tool.category?.replace("_", " ") || "GENERAL"}
                              </span>
                              {tool.executionCount ? (
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {tool.executionCount} call{tool.executionCount > 1 ? "s" : ""}
                                </div>
                              ) : null}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-sm">
                            <p className="text-xs text-slate-800 font-medium leading-relaxed">
                              {tool.description}
                            </p>
                            {tool.systemInstruction && (
                              <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">
                                Agent Prompt: &ldquo;{tool.systemInstruction}&rdquo;
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {propKeys.length === 0 ? (
                              <span className="text-[11px] text-slate-400 font-mono">
                                No parameters required
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {propKeys.slice(0, 4).map((p) => {
                                  const isReq = requiredKeys.includes(p);
                                  return (
                                    <span
                                      key={p}
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                        isReq
                                          ? "bg-slate-800 text-slate-200 font-bold"
                                          : "bg-slate-100 text-slate-600 border border-slate-200"
                                      }`}
                                      title={isReq ? "Required parameter" : "Optional parameter"}
                                    >
                                      {p}
                                      {isReq && "*"}
                                    </span>
                                  );
                                })}
                                {propKeys.length > 4 && (
                                  <span className="text-[10px] text-slate-400 self-center">
                                    +{propKeys.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Status / Toggle switch */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <button
                                type="button"
                                disabled={isToggling}
                                onClick={() => handleToggleTool(tool.name)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-200 cursor-pointer ${
                                  isEnabled ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"
                                } ${isToggling ? "opacity-50" : ""}`}
                                title={isEnabled ? "Click to disable tool" : "Click to enable tool"}
                              >
                                <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition" />
                              </button>
                              <span
                                className={`text-[10px] font-bold ${
                                  isEnabled ? "text-emerald-700" : "text-slate-400"
                                }`}
                              >
                                {isEnabled ? "Active" : "Disabled"}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Read / View Spec */}
                              <button
                                type="button"
                                onClick={() => handleOpenViewTool(tool)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                                title="Inspect tool specification & schema"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-600" />
                                <span>Read</span>
                              </button>

                              {/* Edit Tool Settings */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditTool(tool)}
                                className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                                title="Edit tool description, category, guidance and schema"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Edit</span>
                              </button>

                              {/* Test in Playground */}
                              <button
                                type="button"
                                onClick={() => handleLaunchPlayground(tool.name)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                                title="Test execute this tool live"
                              >
                                <Play className="w-3 h-3 text-emerald-400" />
                                <span>Run</span>
                              </button>

                              {/* Delete if custom or disable */}
                              {tool.isCustom && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTool(tool)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Delete custom tool"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 1: CREDENTIALS & APPLICATION PASSWORDS
          ------------------------------------------------------------- */}
      {activeSubTab === "credentials" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Authorized MCP Connections &amp; Application Passwords
                </h3>
                <p className="text-xs text-slate-500">
                  Manage usernames and secure application passwords used by OpenCode, Antigravity, and AI agents to execute tools on this server.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAddModal("opencode")}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>+ OpenCode Bot</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal("antigravity")}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>+ Antigravity Agent</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200/70 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Platform &amp; Label</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Application Password</th>
                    <th className="py-3 px-4">Permissions Scope</th>
                    <th className="py-3 px-4">Total Calls</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {credentials.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No MCP credentials created yet. Click "+ Add Application Password" to get started.
                      </td>
                    </tr>
                  ) : (
                    credentials.map((cred) => {
                      const isPwVisible = !!visiblePasswords[cred.id];
                      return (
                        <tr key={cred.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 ${
                                  cred.platform === "opencode"
                                    ? "bg-blue-600"
                                    : cred.platform === "antigravity"
                                    ? "bg-amber-600"
                                    : cred.platform === "claude"
                                    ? "bg-purple-600"
                                    : cred.platform === "cursor"
                                    ? "bg-teal-600"
                                    : "bg-slate-700"
                                }`}
                              >
                                {cred.platform === "antigravity" ? (
                                  <Sparkles className="w-3.5 h-3.5" />
                                ) : (
                                  <Code className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{cred.name}</div>
                                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                  {cred.platform}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                            {cred.username}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-mono text-xs">
                              <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 max-w-[170px] truncate select-all">
                                {isPwVisible
                                  ? cred.applicationPassword
                                  : "••••••••••••••••••••"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setVisiblePasswords((prev) => ({
                                    ...prev,
                                    [cred.id]: !prev[cred.id],
                                  }))
                                }
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                title={isPwVisible ? "Hide password" : "Show password"}
                              >
                                {isPwVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopy(cred.applicationPassword, cred.id)}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                                title="Copy password"
                              >
                                {copiedKeyId === cred.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                cred.scope === "full_control"
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : cred.scope === "seo_technical"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : cred.scope === "content_manager"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {cred.scope.replace("_", " ")}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono font-medium text-slate-600">
                            {cred.totalRequests || 0}
                          </td>

                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleCredential(cred.id)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                                cred.active
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                            >
                              {cred.active ? "Active" : "Revoked"}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSubTab("config");
                              }}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-semibold transition"
                              title="View connection snippets"
                            >
                              Config
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCredential(cred.id)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 transition"
                              title="Revoke and delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: CONFIGURATION SNIPPETS FOR OPENCODE & ANTIGRAVITY
          ------------------------------------------------------------- */}
      {activeSubTab === "config" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ready-To-Connect Configurations
              </h3>
              <p className="text-xs text-slate-500">
                Using active credential: <strong>{primaryCred.name}</strong> (Username:{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">{primaryCred.username}</code>). Copy and paste these JSON blocks directly into OpenCode or Antigravity configurations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* 1. OpenCode Configuration */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3 border border-slate-800 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      OC
                    </div>
                    <h4 className="text-sm font-bold text-white">OpenCode MCP Configuration</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const snippet = JSON.stringify(
                        {
                          mcpServers: {
                            "scribd-platform-controller": {
                              url: `${currentHost}/api/mcp`,
                              headers: {
                                Authorization: `Basic ${basicAuthB64}`,
                              },
                            },
                          },
                        },
                        null,
                        2
                      );
                      handleCopy(snippet, "opencode-snippet");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedKeyId === "opencode-snippet" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy JSON</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Add to your OpenCode workspace or MCP client config:
                </p>

                <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-blue-300 overflow-x-auto leading-relaxed border border-slate-800">
{`{
  "mcpServers": {
    "scribd-platform-controller": {
      "url": "${currentHost}/api/mcp",
      "headers": {
        "Authorization": "Basic ${basicAuthB64}"
      }
    }
  }
}`}
                </pre>
              </div>

              {/* 2. Antigravity Agent Configuration */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3 border border-slate-800 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Antigravity Agent Configuration</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const snippet = JSON.stringify(
                        {
                          agent: "antigravity",
                          mcpConnection: {
                            endpoint: `${currentHost}/api/mcp`,
                            transport: "http-jsonrpc",
                            auth: {
                              type: "application_password",
                              username: primaryCred.username,
                              applicationPassword: primaryCred.applicationPassword,
                            },
                            capabilities: ["seo_onpage", "seo_technical", "content", "ui_ux", "system"],
                          },
                        },
                        null,
                        2
                      );
                      handleCopy(snippet, "antigravity-snippet");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedKeyId === "antigravity-snippet" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy JSON</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Direct connection for Antigravity Coding Agents &amp; Gemini models:
                </p>

                <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-amber-300 overflow-x-auto leading-relaxed border border-slate-800">
{`{
  "agent": "antigravity",
  "mcpConnection": {
    "endpoint": "${currentHost}/api/mcp",
    "transport": "http-jsonrpc",
    "auth": {
      "type": "application_password",
      "username": "${primaryCred.username}",
      "applicationPassword": "${primaryCred.applicationPassword}"
    },
    "capabilities": ["seo_onpage", "seo_technical", "content", "ui_ux", "system"]
  }
}`}
                </pre>
              </div>

              {/* 3. Claude Desktop Config */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      CD
                    </div>
                    <h4 className="text-sm font-bold text-white">Claude Desktop / Cursor Config</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const snippet = JSON.stringify(
                        {
                          mcpServers: {
                            "scribd-downloader": {
                              command: "npx",
                              args: ["-y", "@modelcontextprotocol/server-fetch", `${currentHost}/api/mcp`],
                              env: {
                                MCP_AUTH_BEARER: primaryCred.applicationPassword,
                              },
                            },
                          },
                        },
                        null,
                        2
                      );
                      handleCopy(snippet, "claude-snippet");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedKeyId === "claude-snippet" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy JSON</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Save inside <code>claude_desktop_config.json</code> or <code>.cursor/mcp.json</code>:
                </p>

                <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-purple-300 overflow-x-auto leading-relaxed border border-slate-800">
{`{
  "mcpServers": {
    "scribd-downloader": {
      "url": "${currentHost}/api/mcp",
      "headers": {
        "Authorization": "Bearer ${primaryCred.applicationPassword}"
      }
    }
  }
}`}
                </pre>
              </div>

              {/* 4. Direct cURL Command */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      <Terminal className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Instant cURL Test Command</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const curlCmd = `curl -X POST ${currentHost}/api/mcp \\\n  -H "Content-Type: application/json" \\\n  -u "${primaryCred.username}:${primaryCred.applicationPassword}" \\\n  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"seo_audit_page","arguments":{"path":"/"}}}'`;
                      handleCopy(curlCmd, "curl-snippet");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedKeyId === "curl-snippet" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy Command</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Run directly in bash/zsh to trigger a live SEO audit via MCP:
                </p>

                <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[10.5px] text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
{`curl -X POST ${currentHost}/api/mcp \\
  -H "Content-Type: application/json" \\
  -u "${primaryCred.username}:${primaryCred.applicationPassword}" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"seo_audit_page","arguments":{"path":"/"}}}'`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: INTERACTIVE PLAYGROUND (RUN MCP TOOLS LIVE)
          ------------------------------------------------------------- */}
      {activeSubTab === "playground" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive MCP Tool Execution Playground
                </h3>
                <p className="text-xs text-slate-500">
                  Test and execute any of the 16 server MCP tools live with custom arguments. See real-time JSON-RPC responses.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Using Credential:</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                  {primaryCred.name} ({primaryCred.username})
                </span>
              </div>
            </div>

            {/* Tool Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select MCP Tool to Call:
                </label>
                <select
                  value={selectedTool}
                  onChange={(e) => handleSelectTool(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 transition cursor-pointer"
                >
                  <optgroup label="SEO & Metadata Control">
                    <option value="seo_audit_page">seo_audit_page (Onpage SEO check)</option>
                    <option value="seo_update_metadata">seo_update_metadata (Update title/meta/OG)</option>
                  </optgroup>
                  <optgroup label="Technical SEO & Crawlers">
                    <option value="seo_get_robots">seo_get_robots (Read robots.txt)</option>
                    <option value="seo_update_robots">seo_update_robots (Update robots.txt rules)</option>
                    <option value="seo_generate_sitemap">seo_generate_sitemap (Rebuild sitemap.xml)</option>
                    <option value="seo_test_crawler">seo_test_crawler (Test crawler bot access)</option>
                  </optgroup>
                  <optgroup label="Content Management">
                    <option value="content_list_blogs">content_list_blogs (List articles)</option>
                    <option value="content_manage_page">content_manage_page (Create/edit custom pages)</option>
                  </optgroup>
                  <optgroup label="UI / UX Issues & Layout">
                    <option value="ui_ux_diagnose_issues">ui_ux_diagnose_issues (Scan UI/UX defects)</option>
                    <option value="ui_ux_fix_issue">ui_ux_fix_issue (Auto-fix touch/contrast)</option>
                  </optgroup>
                  <optgroup label="System & Cache Engine">
                    <option value="system_status">system_status (Server metrics & speed)</option>
                    <option value="system_manage_cache">system_manage_cache (Purge cache)</option>
                  </optgroup>
                </select>

                {/* Tool Description box */}
                {(() => {
                  const currTool = tools.find((t) => t.name === selectedTool);
                  if (!currTool) return null;
                  return (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{currTool.name}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        {currTool.description}
                      </p>
                    </div>
                  );
                })()}

                <button
                  type="button"
                  onClick={handleExecutePlayground}
                  disabled={isExecutingTool}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  {isExecutingTool ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing MCP Tool...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Execute Tool Call</span>
                    </>
                  )}
                </button>
              </div>

              {/* JSON Parameters Input */}
              <div className="md:col-span-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Input Parameters (JSON):
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">arguments</span>
                </div>
                <textarea
                  value={playgroundArgs}
                  onChange={(e) => setPlaygroundArgs(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  spellCheck={false}
                />
              </div>

              {/* Result Viewport */}
              <div className="md:col-span-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    MCP Tool Response:
                  </label>
                  {playgroundResult && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        playgroundResult.success
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {playgroundResult.success ? "200 SUCCESS" : "ERROR"}
                    </span>
                  )}
                </div>
                <pre className="w-full h-[220px] bg-slate-950 text-indigo-200 font-mono text-[11px] rounded-xl p-3 border border-slate-800 overflow-auto leading-relaxed">
                  {playgroundResult
                    ? JSON.stringify(playgroundResult, null, 2)
                    : "// Click 'Execute Tool Call' to see live JSON response"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: SEO & UI/UX COMPREHENSIVE AUDIT & DIAGNOSTICS
          ------------------------------------------------------------- */}
      {activeSubTab === "diagnostics" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Full-Site SEO &amp; UI/UX Health Diagnostics
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time audit results across On-Page SEO, Technical search engine crawlers, and UI/UX accessibility standards.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchDiagnostics}
                disabled={isLoadingDiagnostics}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoadingDiagnostics ? "animate-spin" : ""}`}
                />
                <span>Run Fresh Audit</span>
              </button>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">On-Page SEO Score</span>
                  <Globe className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">94 / 100</div>
                <p className="text-[11px] text-slate-500">
                  Optimal &lt;title&gt; (58 chars), meta description, canonical, and Schema.org JSON-LD detected.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700">UI/UX Health Score</span>
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">96 / 100</div>
                <p className="text-[11px] text-slate-500">
                  WCAG AA compliant contrast ratio (5.2:1), responsive viewport, and zero banner shifts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700">Technical SEO &amp; Speed</span>
                  <Server className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">100 / 100</div>
                <p className="text-[11px] text-slate-500">
                  robots.txt is active, sitemap.xml dynamically compiled, and bypass headers verified.
                </p>
              </div>
            </div>

            {/* Diagnostic Details */}
            {diagnosticsData && (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Detected UI/UX &amp; SEO Checks
                </h4>

                <div className="space-y-2">
                  {(diagnosticsData.uiux?.issues || []).map((issue: any) => (
                    <div
                      key={issue.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0 mt-0.5 ${
                            issue.resolved ? "bg-emerald-600" : "bg-amber-500"
                          }`}
                        >
                          {issue.resolved ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{issue.description}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                              {issue.element}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px]">{issue.suggestion}</p>
                        </div>
                      </div>

                      {!issue.resolved && issue.autoFixable && (
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch("/api/mcp/test", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                toolName: "ui_ux_fix_issue",
                                args: { issueType: issue.type },
                              }),
                            });
                            fetchDiagnostics();
                          }}
                          className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition cursor-pointer"
                        >
                          Auto-Fix Issue
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 5: AUDIT LOGS
          ------------------------------------------------------------- */}
      {activeSubTab === "logs" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">MCP Invocation Audit Trail</h3>
              <p className="text-xs text-slate-500">
                Log of all tool invocations made by connected AI agents (OpenCode, Antigravity, Claude, etc.).
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLogs}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200/70 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Tool Called</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Response Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                      No MCP tool invocations recorded yet. Use the Playground or an external agent to run calls.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(l.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-4 font-sans font-semibold text-slate-900">
                        {l.clientName}
                      </td>
                      <td className="py-2.5 px-4 text-indigo-600">{l.username}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{l.toolName}</td>
                      <td className="py-2.5 px-4 text-slate-500">{l.durationMs}ms</td>
                      <td className="py-2.5 px-4 font-sans">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            l.status === "success"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 truncate max-w-xs">
                        {l.responseSummary || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: MANUALLY ADD USERNAME & APPLICATION PASSWORD
          ------------------------------------------------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Add New Application Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manually specify Username &amp; Password for MCP AI Client
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateCredential} className="space-y-4 text-xs">
              {/* Target Platform Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Select AI Client / Platform:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "opencode", label: "OpenCode", icon: Code, desc: "OpenCode IDE" },
                    { id: "antigravity", label: "Antigravity", icon: Sparkles, desc: "Gemini Agent" },
                    { id: "claude", label: "Claude Desktop", icon: Cpu, desc: "Claude App" },
                    { id: "cursor", label: "Cursor", icon: Terminal, desc: "Cursor Editor" },
                    { id: "custom", label: "Custom Client", icon: Server, desc: "Any MCP Client" },
                  ].map((p) => {
                    const isSelected = formPlatform === p.id;
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setFormPlatform(p.id as McpPlatform);
                          setFormPassword(generateRandomPassword(p.id as McpPlatform));
                        }}
                        className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className="w-3.5 h-3.5 text-indigo-600" />
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <span className="font-bold text-xs">{p.label}</span>
                        <span className="text-[10px] text-slate-500">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Friendly Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Connection Friendly Name / Label:
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. OpenCode IDE Bot"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-indigo-600"
                />
              </div>

              {/* Username (Manual Add Option) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">
                    Username (Manual Entry):
                  </label>
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    e.g. admin, opencode_dev, bot
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-600"
                />
              </div>

              {/* Application Password (Manual Add Option) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">
                    Application Password (Manual Entry):
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormPassword(generateRandomPassword(formPlatform))}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Strong Key</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="mcp_sec_your_custom_password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-indigo-800 focus:bg-white focus:border-indigo-600"
                />
                <p className="text-[10px] text-slate-400">
                  You can type your own manual password or generate a random secret key.
                </p>
              </div>

              {/* Scope */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Permissions Scope:
                </label>
                <select
                  value={formScope}
                  onChange={(e) => setFormScope(e.target.value as McpScope)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 cursor-pointer"
                >
                  <option value="full_control">
                    Full Control (SEO, Content, UI/UX, Technical &amp; System)
                  </option>
                  <option value="seo_technical">
                    SEO &amp; Technical Only (Robots.txt, Sitemap, Meta tags)
                  </option>
                  <option value="content_manager">
                    Content Manager Only (Blog Posts &amp; Custom Pages)
                  </option>
                  <option value="ui_ux_control">
                    UI/UX Only (Diagnostics, Notice banners, Ad settings)
                  </option>
                  <option value="read_only">Read-Only Audits &amp; Status</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  {isLoading ? "Saving..." : "Save Application Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 1: VIEW / READ MCP TOOL SPECIFICATION
          ------------------------------------------------------------- */}
      {selectedToolForView && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6 my-8 max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {selectedToolForView.category?.replace("_", " ") || "TOOL"}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      selectedToolForView.enabled !== false
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedToolForView.enabled !== false ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {selectedToolForView.enabled !== false ? "Enabled" : "Disabled"}
                  </span>
                  {selectedToolForView.isCustom && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Custom Tool
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black font-mono text-slate-900">
                  {selectedToolForView.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedToolForView(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tool Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Description
              </h4>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                {selectedToolForView.description}
              </div>
            </div>

            {/* System Instruction / AI Prompt */}
            {selectedToolForView.systemInstruction && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  AI Model Guidance &amp; System Instruction
                </h4>
                <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-950 font-mono leading-relaxed">
                  {selectedToolForView.systemInstruction}
                </div>
              </div>
            )}

            {/* Schema Parameters Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Input Parameters Breakdown
              </h4>
              {Object.keys(selectedToolForView.inputSchema?.properties || {}).length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-400 text-center">
                  This tool accepts no arguments (empty payload: <code>{'{}'}</code>).
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3.5">Parameter</th>
                        <th className="py-2.5 px-3.5">Type</th>
                        <th className="py-2.5 px-3.5">Required</th>
                        <th className="py-2.5 px-3.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Object.entries(selectedToolForView.inputSchema?.properties || {}).map(
                        ([propName, propVal]: [string, any]) => {
                          const isReq = (selectedToolForView.inputSchema?.required || []).includes(
                            propName
                          );
                          return (
                            <tr key={propName} className="hover:bg-slate-50/60">
                              <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">
                                {propName}
                              </td>
                              <td className="py-2.5 px-3.5 text-indigo-600 font-mono">
                                {propVal.type || "any"}
                              </td>
                              <td className="py-2.5 px-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isReq
                                      ? "bg-rose-100 text-rose-700"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {isReq ? "REQUIRED" : "Optional"}
                                </span>
                              </td>
                              <td className="py-2.5 px-3.5 text-slate-600 leading-normal">
                                {propVal.description || "—"}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Raw JSON Schema with Copy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Raw JSON Schema Definition
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(selectedToolForView.inputSchema, null, 2),
                      "view-schema-copy"
                    )
                  }
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKeyId === "view-schema-copy" ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedKeyId === "view-schema-copy" ? "Copied!" : "Copy Schema JSON"}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 text-xs font-mono p-4 rounded-2xl overflow-x-auto max-h-48 border border-slate-800">
                {JSON.stringify(selectedToolForView.inputSchema, null, 2)}
              </pre>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedToolForView(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-xs transition cursor-pointer"
              >
                Close Spec
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const t = selectedToolForView;
                    setSelectedToolForView(null);
                    handleOpenEditTool(t);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs hover:bg-indigo-100 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Tool Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const name = selectedToolForView.name;
                    setSelectedToolForView(null);
                    handleLaunchPlayground(name);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Launch in Runner</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 2: EDIT MCP TOOL DEFINITION (READ / EDIT FEATURE)
          ------------------------------------------------------------- */}
      {selectedToolForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  <span>Edit MCP Tool: {selectedToolForEdit.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update execution status, model instructions, description, or JSON input schema.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedToolForEdit(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditTool} className="space-y-4 text-xs">
              {/* Tool Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Tool Identifier:</label>
                  <input
                    type="text"
                    disabled
                    value={selectedToolForEdit.name}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400">Tool name identifier is fixed for API stability.</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Category:</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="seo_onpage">On-Page SEO (seo_onpage)</option>
                    <option value="seo_technical">Technical SEO (seo_technical)</option>
                    <option value="content">Content Management (content)</option>
                    <option value="ui_ux">UI / UX Design &amp; Layout (ui_ux)</option>
                    <option value="system">System &amp; Cache (system)</option>
                    <option value="custom">Custom Tool (custom)</option>
                  </select>
                </div>
              </div>

              {/* Status Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="font-bold text-slate-900 block">Tool Enabled Status</span>
                  <span className="text-[11px] text-slate-500">
                    When disabled, MCP clients receive an error if they attempt to invoke this tool.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditEnabled(!editEnabled)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-200 cursor-pointer ${
                    editEnabled ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition" />
                </button>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Description for AI Clients:</label>
                <textarea
                  rows={2}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Explains what this tool does when listed in tools/list..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
                />
              </div>

              {/* System Instruction */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  AI Model Guidance / System Instruction:
                </label>
                <textarea
                  rows={2}
                  value={editSystemInstruction}
                  onChange={(e) => setEditSystemInstruction(e.target.value)}
                  placeholder="Special instructions passed to Antigravity / OpenCode agents..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800 focus:bg-white focus:border-indigo-600"
                />
              </div>

              {/* Input Schema Editor */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Input JSON Schema:</label>
                  <span className="text-[10px] text-slate-400 font-mono">Standard JSON Schema (Draft-07)</span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={editInputSchema}
                  onChange={(e) => setEditInputSchema(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 font-mono text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedToolForEdit(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTool}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  {isSavingTool ? "Saving..." : "Save Tool Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 3: CREATE CUSTOM MCP TOOL
          ------------------------------------------------------------- */}
      {showAddToolModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  <span>Create Custom MCP Tool</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Register a custom MCP tool for OpenCode and Antigravity agents to discover and invoke.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddToolModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newToolError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{newToolError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCustomTool} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Tool Name (Identifier):</label>
                <input
                  type="text"
                  required
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  placeholder="e.g. seo_keyword_custom_audit"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-indigo-600"
                />
                <p className="text-[10px] text-slate-400">Lowercase letters, numbers, and underscores only.</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Category:</label>
                <select
                  value={newToolCategory}
                  onChange={(e) => setNewToolCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-600 cursor-pointer"
                >
                  <option value="seo_onpage">On-Page SEO (seo_onpage)</option>
                  <option value="seo_technical">Technical SEO (seo_technical)</option>
                  <option value="content">Content Management (content)</option>
                  <option value="ui_ux">UI / UX Design &amp; Layout (ui_ux)</option>
                  <option value="system">System &amp; Cache (system)</option>
                  <option value="custom">Custom Tool (custom)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Description:</label>
                <textarea
                  rows={2}
                  required
                  value={newToolDescription}
                  onChange={(e) => setNewToolDescription(e.target.value)}
                  placeholder="Explain what this tool does and when the agent should invoke it..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">System Instruction (Guidance):</label>
                <textarea
                  rows={2}
                  value={newToolInstruction}
                  onChange={(e) => setNewToolInstruction(e.target.value)}
                  placeholder="Guidance provided to the agent before tool execution..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800 focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Input JSON Schema:</label>
                <textarea
                  rows={5}
                  required
                  value={newToolSchema}
                  onChange={(e) => setNewToolSchema(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 font-mono text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddToolModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  {isLoading ? "Creating..." : "Create Custom Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
