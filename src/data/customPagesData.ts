import { CustomPage } from "../types";
import { CUSTOM_PAGES_KEY, syncPostsAndRebuildSitemap } from "./siteConfig";

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [];

export function loadCustomPages(): CustomPage[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PAGES_KEY);
    if (raw) {
      const parsed: CustomPage[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_CUSTOM_PAGES;
}

export function saveCustomPages(pages: CustomPage[]) {
  try {
    localStorage.setItem(CUSTOM_PAGES_KEY, JSON.stringify(pages));
    // Also sync to server in background
    fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages }),
    }).catch(() => {});
    syncPostsAndRebuildSitemap(undefined, pages);
  } catch (e) {
    console.error(e);
  }
}
