import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Home,
  Image as ImageIcon,
  Megaphone,
  Globe,
  Search,
  Sparkles,
  FolderTree,
  Tags,
  ArrowRightLeft,
  AlertTriangle,
  History,
  Activity,
  Users,
  Settings,
  Database,
  Trash2,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  Loader2,
  Bell,
  ShieldCheck,
  ChevronDown,
  Layers,
} from "lucide-react";
import { AdminUser, AdminRole } from "../../types";

export type AdminTab =
  | "dashboard"
  | "posts"
  | "pages"
  | "media"
  | "categories"
  | "tags"
  | "homepage"
  | "seo"
  | "sitemap"
  | "crawler-health"
  | "ads"
  | "languages"
  | "redirects"
  | "404"
  | "revisions"
  | "activity"
  | "users"
  | "settings"
  | "backup"
  | "trash"
  | "ai";

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onVisitSite?: () => void;
  onExitToSite?: () => void;
  saveStatus?: "idle" | "saving" | "saved" | "error";
  currentUser?: AdminUser;
  onSwitchRole?: (role: AdminRole) => void;
  onOpenSearch?: () => void;
  breadcrumbs?: Array<{ label: string; tab?: AdminTab }>;
  badgeCounts?: {
    pages?: number;
    posts?: number;
    trash?: number;
    errors404?: number;
    missingTranslations?: number;
  };
  counts?: {
    pages?: number;
    posts?: number;
    ads?: number;
    media?: number;
  };
  children: React.ReactNode;
}

export function AdminLayout({
  activeTab,
  onSelectTab,
  onVisitSite,
  onExitToSite,
  saveStatus = "saved",
  currentUser = {
    id: "admin-1",
    name: "System Administrator",
    username: "admin",
    email: "admin@scribddownloader.org",
    role: "owner",
    createdAt: new Date().toISOString(),
  },
  onSwitchRole,
  onOpenSearch,
  breadcrumbs = [{ label: "Dashboard", tab: "dashboard" }],
  badgeCounts,
  counts,
  children,
}: AdminLayoutProps) {
  const handleExit = onExitToSite || onVisitSite || (() => { window.location.href = "/"; });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navGroups = [
    {
      group: "WordPress CMS",
      items: [
        { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard },
        { id: "posts" as AdminTab, label: "Posts", icon: BookOpen, badge: badgeCounts?.posts },
        { id: "pages" as AdminTab, label: "Pages", icon: FileText, badge: badgeCounts?.pages },
        { id: "media" as AdminTab, label: "Media", icon: ImageIcon },
        { id: "categories" as AdminTab, label: "Categories", icon: FolderTree },
        { id: "tags" as AdminTab, label: "Tags", icon: Tags },
        { id: "homepage" as AdminTab, label: "Homepage", icon: Home },
      ],
    },
    {
      group: "SEO & Crawler Accessibility",
      items: [
        { id: "seo" as AdminTab, label: "SEO Settings", icon: Search },
        { id: "sitemap" as AdminTab, label: "XML Sitemap", icon: Layers },
        { id: "crawler-health" as AdminTab, label: "Site/Crawler Health", icon: Activity },
        { id: "redirects" as AdminTab, label: "301 Redirects", icon: ArrowRightLeft },
      ],
    },
    {
      group: "Site Management",
      items: [
        { id: "ads" as AdminTab, label: "Advertisements", icon: Megaphone },
        { id: "languages" as AdminTab, label: "Languages", icon: Globe, badge: badgeCounts?.missingTranslations ? `${badgeCounts.missingTranslations} miss` : undefined },
        { id: "settings" as AdminTab, label: "Settings", icon: Settings },
        { id: "backup" as AdminTab, label: "Backup & Restore", icon: Database },
        { id: "activity" as AdminTab, label: "Activity Log", icon: History },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white h-14 px-4 flex items-center justify-between border-b border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            title="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
              W
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-white leading-none">
                Scribd CMS
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">WordPress + Polylang</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-700 text-xs">
            <button
              type="button"
              onClick={handleExit}
              className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <span>Visit Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Search & Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search CMS (Pages, Posts, Media)...</span>
            <kbd className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[10px] border border-slate-700 font-mono">
              Ctrl+K
            </kbd>
          </button>

          {/* Save Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700">
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                <span className="text-amber-300">Saving...</span>
              </>
            ) : saveStatus === "error" ? (
              <>
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span className="text-rose-300">Save Error</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-slate-300">Synced</span>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                {currentUser.username[0].toUpperCase()}
              </div>
              <span className="hidden sm:inline font-medium">{currentUser.name}</span>
              <span className="text-[10px] uppercase font-semibold bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 text-xs text-slate-700 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-900">{currentUser.name}</div>
                  <div className="text-slate-500 text-[11px]">{currentUser.email}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" />
                    Role: {currentUser.role.toUpperCase()}
                  </div>
                </div>

                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role (RBAC)
                </div>
                {(["owner", "admin", "editor", "translator", "seo"] as AdminRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      onSwitchRole(r);
                      setUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 transition ${
                      currentUser.role === r ? "font-bold text-emerald-600 bg-emerald-50/50" : "text-slate-600"
                    }`}
                  >
                    <span className="capitalize">{r}</span>
                    {currentUser.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}

                <div className="border-t border-slate-100 my-1"></div>
                <button
                  type="button"
                  onClick={onVisitSite}
                  className="w-full text-left px-3 py-1.5 text-slate-600 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Return to Website</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar (Desktop & Collapsible Mobile) */}
        <aside
          className={`${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } fixed lg:static inset-y-14 left-0 z-30 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out`}
        >
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 custom-scrollbar">
            {navGroups.map((group) => (
              <div key={group.group}>
                <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.group}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          setMobileOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-sm font-semibold"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge !== 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              isActive
                                ? "bg-emerald-800 text-white"
                                : "bg-slate-800 text-slate-300 border border-slate-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
            <span>WordPress 6.7 + Polylang</span>
            <span className="text-emerald-400 font-mono font-bold">v2.4.0</span>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-slate-950/60 z-20 lg:hidden backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-100">
          {/* Breadcrumb strip */}
          <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-xs">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => onSelectTab("dashboard")}
                className="hover:text-emerald-600 font-medium transition-colors"
              >
                Admin
              </button>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  {crumb.tab ? (
                    <button
                      type="button"
                      onClick={() => onSelectTab(crumb.tab!)}
                      className="hover:text-emerald-600 font-medium transition-colors"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-slate-900 font-semibold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono text-[11px]">
                Base Language: <strong className="text-slate-900">EN (English)</strong>
              </span>
            </div>
          </div>

          {/* Main Content Render */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
