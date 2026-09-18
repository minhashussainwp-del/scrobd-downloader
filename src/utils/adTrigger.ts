import { AdSettings } from "../types";

/**
 * Validates whether a valid, non-empty advertising destination URL is configured.
 */
export function hasValidAdUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed === "" || trimmed === "about:blank" || trimmed === "#") {
    return false;
  }
  return true;
}

/**
 * Checks whether the New-Tab On-Download Ad is actively eligible to open:
 * 1. Master monetization is enabled (adSettings.enabled === true)
 * 2. New Tab on Download feature is enabled (adSettings.newTabOnDownload === true)
 * 3. A non-empty, valid ad URL is configured (hasValidAdUrl(adSettings.newTabUrl) === true)
 * 
 * IF an ad is NOT configured (even if the toggle is ON), this returns FALSE.
 */
export function isNewTabAdEligible(adSettings?: AdSettings): boolean {
  if (!adSettings) return false;
  if (!adSettings.enabled) return false;
  if (!adSettings.newTabOnDownload) return false;
  return hasValidAdUrl(adSettings.newTabUrl);
}

/**
 * Safely triggers the monetization new-tab ad.
 * 
 * STRICT BEHAVIOR RULES (as requested):
 * - If enabled AND an ad URL is attached: Opens the ad URL in a new tab.
 * - If enabled BUT NO AD IS CONFIGURED (empty/blank URL): GUARANTEED NOT to open any new tab or blank window.
 * - If disabled: GUARANTEED NOT to open any new tab.
 * - PDF process in the current tab is never interrupted.
 * 
 * @returns boolean true if a new tab was opened, false otherwise.
 */
export function triggerNewTabAdIfConfigured(adSettings?: AdSettings): boolean {
  if (!isNewTabAdEligible(adSettings)) {
    return false;
  }

  const rawUrl = (adSettings!.newTabUrl || "").trim();
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
      // Focus the original window back so the PDF process remains front-and-center
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
