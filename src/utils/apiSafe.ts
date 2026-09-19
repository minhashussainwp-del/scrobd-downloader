/**
 * Safely parses a response as JSON.
 * Prevents "Unexpected token '<', '<!doctype '... is not valid JSON" errors
 * by checking HTTP status, Content-Type, and valid JSON starting characters.
 */
export async function safeParseJson<T = any>(res: Response): Promise<T | null> {
  try {
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return null;
    }
    const text = await res.text();
    const trimmed = text.trim();
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      return null;
    }
    return JSON.parse(trimmed) as T;
  } catch {
    return null;
  }
}

/**
 * Perform a fetch and safely parse JSON response.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; data: T | null; error?: string }> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      return { ok: false, data: null, error: `HTTP ${res.status}` };
    }
    const data = await safeParseJson<T>(res);
    if (data === null) {
      return { ok: false, data: null, error: "Non-JSON response" };
    }
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, data: null, error: err?.message || "Network error" };
  }
}
