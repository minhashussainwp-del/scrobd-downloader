/**
 * Dedicated Admin API Client Utility
 * Provides authenticated, timeout-protected, and resilient fetch calls for CMS Admin Panel.
 */

export const DEFAULT_ADMIN_TOKEN = "sd_admin_sec_7894561230_token";

/**
 * Returns current valid admin token from localStorage or default secret token
 */
export function getAdminToken(): string {
  if (typeof window === "undefined") return DEFAULT_ADMIN_TOKEN;
  try {
    const stored = localStorage.getItem("admin_token");
    if (stored && stored.trim() && stored !== "undefined" && stored !== "null") {
      return stored.trim();
    }
    // Set default token if none exists so future requests stay synced
    localStorage.setItem("admin_token", DEFAULT_ADMIN_TOKEN);
    return DEFAULT_ADMIN_TOKEN;
  } catch {
    return DEFAULT_ADMIN_TOKEN;
  }
}

/**
 * Store admin token in localStorage
 */
export function setAdminToken(token: string): void {
  try {
    if (token && token.trim()) {
      localStorage.setItem("admin_token", token.trim());
    } else {
      localStorage.removeItem("admin_token");
    }
  } catch (e) {
    console.warn("Failed to save admin token:", e);
  }
}

/**
 * Robust fetch wrapper for /api/admin/* endpoints
 * - Automatically injects Authorization: Bearer <token> & X-Admin-Token
 * - Adds a strict timeout (default 8000ms) to prevent infinite pending state
 */
export async function adminFetch(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 8000
): Promise<Response> {
  const token = getAdminToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(options.headers || {});
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("X-Admin-Token")) {
    headers.set("X-Admin-Token", token);
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Global monkey-patching of window.fetch for /api/admin endpoints as early safety net
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const urlString =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.toString()
        : input.url;

    if (urlString.includes("/api/admin")) {
      const token = getAdminToken();
      const customInit = init ? { ...init } : {};
      const headers = new Headers(customInit.headers || {});
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (!headers.has("X-Admin-Token")) {
        headers.set("X-Admin-Token", token);
      }
      customInit.headers = headers;
      return originalFetch(input, customInit);
    }
    return originalFetch(input, init);
  };
}
