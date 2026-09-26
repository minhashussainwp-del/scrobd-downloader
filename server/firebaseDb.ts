import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import fs from "fs";
import path from "path";

// Resolve config path
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseConfig: any = {};

if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (err) {
    console.error("[Firebase] Error reading config file:", err);
  }
} else {
  console.warn("[Firebase] Warning: firebase-applet-config.json not found!");
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const STORAGE_ROOT = path.join(process.cwd(), "server_storage");
const PAGES_FILE = path.join(STORAGE_ROOT, "pages.json");
const POSTS_FILE = path.join(STORAGE_ROOT, "blog_posts.json");
const MEDIA_FILE = path.join(STORAGE_ROOT, "media.json");
const ADS_FILE = path.join(STORAGE_ROOT, "ads.json");
const REDIRECTS_FILE = path.join(STORAGE_ROOT, "redirects.json");
const SETTINGS_FILE = path.join(STORAGE_ROOT, "settings.json");
const CATEGORIES_FILE = path.join(STORAGE_ROOT, "categories.json");
const TAGS_FILE = path.join(STORAGE_ROOT, "tags.json");
const HOMEPAGE_FILE = path.join(STORAGE_ROOT, "homepage_content.json");

// Authoritative system secret token for secure backend-to-firestore communication
const SYS_SECRET_TOKEN = "sd_admin_sec_7894561230_token";

// Memory cache for maximum read performance and 0ms latency in Express routes
let pagesCache: any[] = [];
let postsCache: any[] = [];
let mediaCache: any[] = [];
let adsCache: any[] = [];
let redirectsCache: any[] = [];
let settingsCache: any = null;
let categoriesCache: any[] = [];
let tagsCache: any[] = [];
let homepageCache: Record<string, any> = {};

/**
 * Sync Getters for routing and sitemaps (preventing blocking async DB calls during render)
 */
export function getPagesFromCache(): any[] { return pagesCache; }
export function getPostsFromCache(): any[] { return postsCache; }
export function getMediaFromCache(): any[] { return mediaCache; }
export function getAdsFromCache(): any[] { return adsCache; }
export function getRedirectsFromCache(): any[] { return redirectsCache; }
export function getSettingsFromCache(): any { return settingsCache; }
export function getCategoriesFromCache(): any[] { return categoriesCache; }
export function getTagsFromCache(): any[] { return tagsCache; }
export function getHomepageFromCache(): Record<string, any> { return homepageCache; }

/**
 * Helper to write a local filesystem backup
 */
function saveLocalJsonFile<T>(filePath: string, data: T) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`[Backup] Error writing backup file ${filePath}:`, err);
  }
}

/**
 * Helper to read a local filesystem file
 */
function readLocalJsonFile<T>(filePath: string, fallback: T): T {
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data) as T;
    } catch {}
  }
  return fallback;
}

/**
 * Initialize Firebase, Authenticate Server Session, Run Migration and Load Cache
 */
export async function initializeFirebaseAndAuth() {
  const email = "minhashussain.wp@gmail.com";
  const password = "Minhas@#12345";

  try {
    console.log(`[Firebase] Authenticating server as admin: ${email}...`);
    await signInWithEmailAndPassword(auth, email, password);
    console.log("[Firebase] Server session authenticated successfully.");
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const code = err?.code || "";
    if (
      code === "auth/user-not-found" ||
      errMsg.includes("user-not-found") ||
      code === "auth/invalid-credential" ||
      errMsg.includes("invalid-credential")
    ) {
      console.log(`[Firebase] Admin user not found or invalid credentials. Attempting to auto-register: ${email}...`);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log(`[Firebase] Admin user ${email} registered and authenticated successfully.`);
      } catch (createErr: any) {
        console.warn(`[Firebase] Auto-registration warning (might be disabled in console):`, createErr?.message || createErr);
      }
    } else {
      console.error("[Firebase] Auth warning during startup:", err);
    }
  }

  // 1. Load current Firestore cache first to prepare
  await loadDatabaseToMemoryCache();

  // 2. Run database migration if Firestore is empty
  await runDatabaseMigration();

  // 3. Load Firestore data into memory cache again to synchronize
  await loadDatabaseToMemoryCache();
}

/**
 * Run one-time migration from local server_storage JSON files to Firestore
 */
async function runDatabaseMigration() {
  try {
    console.log("[Firebase] Checking if Firestore requires seeding / migration...");

    // Pages Migration
    const pageSnap = await getDocs(collection(db, "pages"));
    if (pageSnap.empty && fs.existsSync(PAGES_FILE)) {
      console.log("[Firebase] Seeding local pages to Firestore...");
      const localPages = readLocalJsonFile<any[]>(PAGES_FILE, []);
      for (const p of localPages) {
        if (p && p.id) {
          await setDoc(doc(db, "pages", p.id), { ...p, sysSecretToken: SYS_SECRET_TOKEN });
        }
      }
    }

    // Posts Migration
    const postSnap = await getDocs(collection(db, "posts"));
    if (postSnap.empty && fs.existsSync(POSTS_FILE)) {
      console.log("[Firebase] Seeding local posts to Firestore...");
      const localPosts = readLocalJsonFile<any[]>(POSTS_FILE, []);
      for (const p of localPosts) {
        if (p && p.id) {
          await setDoc(doc(db, "posts", p.id), { ...p, sysSecretToken: SYS_SECRET_TOKEN });
        }
      }
    }

    // Media Migration
    const mediaSnap = await getDocs(collection(db, "media"));
    if (mediaSnap.empty && fs.existsSync(MEDIA_FILE)) {
      console.log("[Firebase] Seeding local media to Firestore...");
      const localMedia = readLocalJsonFile<any[]>(MEDIA_FILE, []);
      for (const m of localMedia) {
        if (m && m.id) {
          await setDoc(doc(db, "media", m.id), { ...m, sysSecretToken: SYS_SECRET_TOKEN });
        }
      }
    }

    // Ads Migration
    const adSnap = await getDocs(collection(db, "ads"));
    if (adSnap.empty && fs.existsSync(ADS_FILE)) {
      console.log("[Firebase] Seeding local ads to Firestore...");
      const localAds = readLocalJsonFile<any[]>(ADS_FILE, []);
      for (const a of localAds) {
        if (a && a.id) {
          await setDoc(doc(db, "ads", a.id), { ...a, sysSecretToken: SYS_SECRET_TOKEN });
        }
      }
    }

    // Redirects Migration
    const redirectSnap = await getDocs(collection(db, "redirects"));
    if (redirectSnap.empty && fs.existsSync(REDIRECTS_FILE)) {
      console.log("[Firebase] Seeding local redirects to Firestore...");
      const localRedirects = readLocalJsonFile<any[]>(REDIRECTS_FILE, []);
      for (const r of localRedirects) {
        if (r && r.id) {
          await setDoc(doc(db, "redirects", r.id), { ...r, sysSecretToken: SYS_SECRET_TOKEN });
        }
      }
    }

    // Categories Migration
    const catSnap = await getDocs(collection(db, "categories"));
    if (catSnap.empty && fs.existsSync(CATEGORIES_FILE)) {
      console.log("[Firebase] Seeding categories to Firestore...");
      const localCats = readLocalJsonFile<any[]>(CATEGORIES_FILE, []);
      for (const c of localCats) {
        if (c && c.id) {
          await setDoc(doc(db, "categories", c.id), { ...c, sysSecretToken: SYS_SECRET_TOKEN });
        }
      }
    }

    // Tags Migration
    const tagSnap = await getDocs(collection(db, "tags"));
    if (tagSnap.empty && fs.existsSync(TAGS_FILE)) {
      console.log("[Firebase] Seeding tags to Firestore...");
      const localTags = readLocalJsonFile<any[]>(TAGS_FILE, []);
      for (const t of localTags) {
        if (t && t.id) {
          await setDoc(doc(db, "tags", t.id), { ...t, sysSecretToken: SYS_SECRET_TOKEN });
        }
      }
    }

    // Global Settings Migration
    const settingSnap = await getDoc(doc(db, "settings", "global"));
    if (!settingSnap.exists() && fs.existsSync(SETTINGS_FILE)) {
      console.log("[Firebase] Seeding global settings to Firestore...");
      const localSettings = readLocalJsonFile<any>(SETTINGS_FILE, null);
      if (localSettings) {
        await setDoc(doc(db, "settings", "global"), { ...localSettings, sysSecretToken: SYS_SECRET_TOKEN });
      }
    }

    // Homepage Migration
    const homepageSnap = await getDocs(collection(db, "homepage"));
    if (homepageSnap.empty && fs.existsSync(HOMEPAGE_FILE)) {
      console.log("[Firebase] Seeding local homepage content to Firestore...");
      const localHomepage = readLocalJsonFile<Record<string, any>>(HOMEPAGE_FILE, {});
      for (const [lang, content] of Object.entries(localHomepage)) {
        if (content) {
          await setDoc(doc(db, "homepage", lang), { ...(content as any), sysSecretToken: SYS_SECRET_TOKEN });
        }
      }
    }

    console.log("[Firebase] Seeding check complete.");
  } catch (err) {
    console.error("[Firebase] Error during migration:", err);
  }
}

/**
 * Load Firestore collections into RAM Cache and strip secret tokens
 */
async function loadDatabaseToMemoryCache() {
  try {
    console.log("[Firebase] Loading Firestore collections into memory cache...");

    // Pages
    const pagesSnap = await getDocs(collection(db, "pages"));
    pagesCache = [];
    pagesSnap.forEach((d) => {
      const data = d.data();
      delete data.sysSecretToken;
      pagesCache.push(data);
    });
    saveLocalJsonFile(PAGES_FILE, pagesCache);

    // Posts
    const postsSnap = await getDocs(collection(db, "posts"));
    postsCache = [];
    postsSnap.forEach((d) => {
      const data = d.data();
      delete data.sysSecretToken;
      postsCache.push(data);
    });
    saveLocalJsonFile(POSTS_FILE, postsCache);

    // Media
    const mediaSnap = await getDocs(collection(db, "media"));
    mediaCache = [];
    mediaSnap.forEach((d) => {
      const data = d.data();
      delete data.sysSecretToken;
      mediaCache.push(data);
    });
    saveLocalJsonFile(MEDIA_FILE, mediaCache);

    // Ads
    const adsSnap = await getDocs(collection(db, "ads"));
    adsCache = [];
    adsSnap.forEach((d) => {
      const data = d.data();
      delete data.sysSecretToken;
      adsCache.push(data);
    });
    saveLocalJsonFile(ADS_FILE, adsCache);

    // Redirects
    const redirectsSnap = await getDocs(collection(db, "redirects"));
    redirectsCache = [];
    redirectsSnap.forEach((d) => {
      const data = d.data();
      delete data.sysSecretToken;
      redirectsCache.push(data);
    });
    saveLocalJsonFile(REDIRECTS_FILE, redirectsCache);

    // Categories
    const catsSnap = await getDocs(collection(db, "categories"));
    categoriesCache = [];
    catsSnap.forEach((d) => {
      const data = d.data();
      delete data.sysSecretToken;
      categoriesCache.push(data);
    });
    saveLocalJsonFile(CATEGORIES_FILE, categoriesCache);

    // Tags
    const tagsSnap = await getDocs(collection(db, "tags"));
    tagsCache = [];
    tagsSnap.forEach((d) => {
      const data = d.data();
      delete data.sysSecretToken;
      tagsCache.push(data);
    });
    saveLocalJsonFile(TAGS_FILE, tagsCache);

    // Settings
    const settingSnap = await getDoc(doc(db, "settings", "global"));
    if (settingSnap.exists()) {
      const data = settingSnap.data();
      delete data.sysSecretToken;
      settingsCache = data;
    } else {
      settingsCache = readLocalJsonFile(SETTINGS_FILE, null);
    }
    if (settingsCache) {
      saveLocalJsonFile(SETTINGS_FILE, settingsCache);
    }

    // Homepage
    const homepageColSnap = await getDocs(collection(db, "homepage"));
    homepageCache = {};
    homepageColSnap.forEach((d) => {
      const data = d.data();
      delete data.sysSecretToken;
      homepageCache[d.id] = data;
    });
    if (Object.keys(homepageCache).length === 0) {
      homepageCache = readLocalJsonFile<Record<string, any>>(HOMEPAGE_FILE, {});
    }
    if (homepageCache && Object.keys(homepageCache).length > 0) {
      saveLocalJsonFile(HOMEPAGE_FILE, homepageCache);
    }

    console.log(`[Firebase] Loaded cache: ${pagesCache.length} pages, ${postsCache.length} posts, ${mediaCache.length} media, ${Object.keys(homepageCache).length} homepage locales.`);
  } catch (err) {
    console.error("[Firebase] Error loading Firestore cache, falling back to local files:", err);
    pagesCache = readLocalJsonFile<any[]>(PAGES_FILE, []);
    postsCache = readLocalJsonFile<any[]>(POSTS_FILE, []);
    mediaCache = readLocalJsonFile<any[]>(MEDIA_FILE, []);
    adsCache = readLocalJsonFile<any[]>(ADS_FILE, []);
    redirectsCache = readLocalJsonFile<any[]>(REDIRECTS_FILE, []);
    categoriesCache = readLocalJsonFile<any[]>(CATEGORIES_FILE, []);
    tagsCache = readLocalJsonFile<any[]>(TAGS_FILE, []);
    settingsCache = readLocalJsonFile<any>(SETTINGS_FILE, null);
    homepageCache = readLocalJsonFile<Record<string, any>>(HOMEPAGE_FILE, {});
  }
}

/**
 * CRUD functions that update both local cache, local filesystem backups, and Firestore
 */
export async function savePage(page: any): Promise<boolean> {
  const idx = pagesCache.findIndex((p) => p.id === page.id);
  if (idx >= 0) pagesCache[idx] = page;
  else pagesCache.unshift(page);

  saveLocalJsonFile(PAGES_FILE, pagesCache);
  try {
    await setDoc(doc(db, "pages", page.id), { ...page, sysSecretToken: SYS_SECRET_TOKEN });
    return true;
  } catch (err) {
    console.error("[Firebase] Error saving page:", err);
    return false;
  }
}

export async function deletePage(id: string): Promise<boolean> {
  pagesCache = pagesCache.filter((p) => p.id !== id);
  saveLocalJsonFile(PAGES_FILE, pagesCache);
  try {
    await deleteDoc(doc(db, "pages", id));
    return true;
  } catch (err) {
    console.error("[Firebase] Error deleting page:", err);
    return false;
  }
}

export async function savePost(post: any): Promise<boolean> {
  const idx = postsCache.findIndex((p) => p.id === post.id);
  if (idx >= 0) postsCache[idx] = post;
  else postsCache.unshift(post);

  saveLocalJsonFile(POSTS_FILE, postsCache);
  try {
    await setDoc(doc(db, "posts", post.id), { ...post, sysSecretToken: SYS_SECRET_TOKEN });
    return true;
  } catch (err) {
    console.error("[Firebase] Error saving post:", err);
    return false;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  postsCache = postsCache.filter((p) => p.id !== id);
  saveLocalJsonFile(POSTS_FILE, postsCache);
  try {
    await deleteDoc(doc(db, "posts", id));
    return true;
  } catch (err) {
    console.error("[Firebase] Error deleting post:", err);
    return false;
  }
}

export async function saveMediaItem(item: any): Promise<boolean> {
  const idx = mediaCache.findIndex((m) => m.id === item.id);
  if (idx >= 0) mediaCache[idx] = item;
  else mediaCache.unshift(item);

  saveLocalJsonFile(MEDIA_FILE, mediaCache);
  try {
    await setDoc(doc(db, "media", item.id), { ...item, sysSecretToken: SYS_SECRET_TOKEN });
    return true;
  } catch (err) {
    console.error("[Firebase] Error saving media:", err);
    return false;
  }
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  mediaCache = mediaCache.filter((m) => m.id !== id);
  saveLocalJsonFile(MEDIA_FILE, mediaCache);
  try {
    await deleteDoc(doc(db, "media", id));
    return true;
  } catch (err) {
    console.error("[Firebase] Error deleting media:", err);
    return false;
  }
}

export async function saveAd(ad: any): Promise<boolean> {
  const idx = adsCache.findIndex((a) => a.id === ad.id);
  if (idx >= 0) adsCache[idx] = ad;
  else adsCache.push(ad);

  saveLocalJsonFile(ADS_FILE, adsCache);
  try {
    await setDoc(doc(db, "ads", ad.id), { ...ad, sysSecretToken: SYS_SECRET_TOKEN });
    return true;
  } catch (err) {
    console.error("[Firebase] Error saving ad:", err);
    return false;
  }
}

export async function saveAdsBatch(adsList: any[]): Promise<boolean> {
  adsCache = adsList;
  saveLocalJsonFile(ADS_FILE, adsCache);
  try {
    for (const a of adsList) {
      if (a && a.id) {
        await setDoc(doc(db, "ads", a.id), { ...a, sysSecretToken: SYS_SECRET_TOKEN });
      }
    }
    return true;
  } catch (err) {
    console.error("[Firebase] Error saving ads batch:", err);
    return false;
  }
}

export async function saveRedirect(redirect: any): Promise<boolean> {
  const idx = redirectsCache.findIndex((r) => r.id === redirect.id);
  if (idx >= 0) redirectsCache[idx] = redirect;
  else redirectsCache.unshift(redirect);

  saveLocalJsonFile(REDIRECTS_FILE, redirectsCache);
  try {
    await setDoc(doc(db, "redirects", redirect.id), { ...redirect, sysSecretToken: SYS_SECRET_TOKEN });
    return true;
  } catch (err) {
    console.error("[Firebase] Error saving redirect:", err);
    return false;
  }
}

export async function deleteRedirect(id: string): Promise<boolean> {
  redirectsCache = redirectsCache.filter((r) => r.id !== id);
  saveLocalJsonFile(REDIRECTS_FILE, redirectsCache);
  try {
    await deleteDoc(doc(db, "redirects", id));
    return true;
  } catch (err) {
    console.error("[Firebase] Error deleting redirect:", err);
    return false;
  }
}

export async function saveGlobalSettings(settings: any): Promise<boolean> {
  settingsCache = settings;
  saveLocalJsonFile(SETTINGS_FILE, settingsCache);
  try {
    await setDoc(doc(db, "settings", "global"), { ...settings, sysSecretToken: SYS_SECRET_TOKEN });
    return true;
  } catch (err) {
    console.error("[Firebase] Error saving global settings:", err);
    return false;
  }
}

export async function saveCategory(cat: any): Promise<boolean> {
  const idx = categoriesCache.findIndex((c) => c.id === cat.id);
  if (idx >= 0) categoriesCache[idx] = cat;
  else categoriesCache.push(cat);

  saveLocalJsonFile(CATEGORIES_FILE, categoriesCache);
  try {
    await setDoc(doc(db, "categories", cat.id), { ...cat, sysSecretToken: SYS_SECRET_TOKEN });
    return true;
  } catch (err) {
    console.error("[Firebase] Error saving category:", err);
    return false;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  categoriesCache = categoriesCache.filter((c) => c.id !== id);
  saveLocalJsonFile(CATEGORIES_FILE, categoriesCache);
  try {
    await deleteDoc(doc(db, "categories", id));
    return true;
  } catch (err) {
    console.error("[Firebase] Error deleting category:", err);
    return false;
  }
}

export async function saveTag(tag: any): Promise<boolean> {
  const idx = tagsCache.findIndex((t) => t.id === tag.id);
  if (idx >= 0) tagsCache[idx] = tag;
  else tagsCache.push(tag);

  saveLocalJsonFile(TAGS_FILE, tagsCache);
  try {
    await setDoc(doc(db, "tags", tag.id), { ...tag, sysSecretToken: SYS_SECRET_TOKEN });
    return true;
  } catch (err) {
    console.error("[Firebase] Error saving tag:", err);
    return false;
  }
}

export async function deleteTag(id: string): Promise<boolean> {
  tagsCache = tagsCache.filter((t) => t.id !== id);
  saveLocalJsonFile(TAGS_FILE, tagsCache);
  try {
    await deleteDoc(doc(db, "tags", id));
    return true;
  } catch (err) {
    console.error("[Firebase] Error deleting tag:", err);
    return false;
  }
}

export async function saveHomepage(lang: string, content: any): Promise<boolean> {
  homepageCache[lang] = content;
  saveLocalJsonFile(HOMEPAGE_FILE, homepageCache);
  try {
    await setDoc(doc(db, "homepage", lang), { ...content, sysSecretToken: SYS_SECRET_TOKEN });
    return true;
  } catch (err) {
    console.error(`[Firebase] Error saving homepage [${lang}]:`, err);
    return false;
  }
}
