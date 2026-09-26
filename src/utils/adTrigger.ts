import { AdSettings } from "../types";

/**
 * Validates whether a valid, non-empty advertising destination URL is configured.
 * Strictly rejects empty URLs, placeholders, and unwanted external redirects (like pdfviewer.org).
 */
export function hasValidAdUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed === "" ||
    trimmed === "about:blank" ||
    trimmed === "#" ||
    trimmed.includes("pdfviewer.org")
  ) {
    return false;
  }
  return true;
}

/**
 * Checks whether the Download Button or New-Tab Ad is actively eligible to open:
 * 1. Master monetization is enabled (adSettings.enabled === true)
 * 2. Either Button Ad is enabled (buttonAdEnabled) OR New Tab on Download is enabled (newTabOnDownload)
 * 3. A non-empty, genuine ad URL is configured (hasValidAdUrl returns true)
 * 
 * STRICT RULE: If NO valid ad is actively configured, this GUARANTEES return of FALSE.
 */
export function isNewTabAdEligible(adSettings?: AdSettings): boolean {
  if (!adSettings) return false;
  if (!adSettings.enabled) return false;

  const buttonEnabled = Boolean(adSettings.buttonAdEnabled);
  const newTabEnabled = Boolean(adSettings.newTabOnDownload);

  if (!buttonEnabled && !newTabEnabled) {
    return false;
  }

  const candidateUrl = adSettings.buttonAdUrl || adSettings.newTabUrl;
  return hasValidAdUrl(candidateUrl);
}

/**
 * Safely triggers the monetization button ad if and only if an ad has been added.
 * 
 * STRICT BEHAVIOR RULES (per user request):
 * - If ads are ADDED (enabled + valid URL): Opens the sponsor ad in a new tab.
 * - If ads are NOT added (empty/blank URL or disabled): ABSOLUTELY NOTHING opens. 
 *   The user download continues cleanly without any popups, redirects, or new tabs.
 * - Under NO circumstance does pdfviewer.org ever open.
 * 
 * @returns boolean true if a new tab was opened, false otherwise.
 */
export function triggerNewTabAdIfConfigured(adSettings?: AdSettings): boolean {
  if (!isNewTabAdEligible(adSettings)) {
    return false;
  }

  const rawUrl = (adSettings!.buttonAdUrl || adSettings!.newTabUrl || "").trim();
  if (!hasValidAdUrl(rawUrl)) {
    return false;
  }

  let targetUrl = rawUrl;
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  try {
    // Record impression/click in local telemetry
    recordAdClick();
    
    // Open the sponsored ad in a new tab
    const win = window.open(targetUrl, "_blank", "noopener,noreferrer");
    if (win) {
      try {
        window.focus();
      } catch (_) {}
      return true;
    }
    return false;
  } catch (err) {
    console.warn("[AdSystem] Notice: Popup or new tab blocked by browser:", err);
    return false;
  }
}

/**
 * Records an ad impression for stats in the admin panel.
 */
export function recordAdImpression() {
  try {
    const raw = localStorage.getItem("scribd_ad_impressions") || "0";
    localStorage.setItem("scribd_ad_impressions", String(parseInt(raw, 10) + 1));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Records an ad click for stats in the admin panel.
 */
export function recordAdClick() {
  try {
    const raw = localStorage.getItem("scribd_ad_clicks") || "0";
    localStorage.setItem("scribd_ad_clicks", String(parseInt(raw, 10) + 1));
  } catch (e) {
    console.error(e);
  }
}
