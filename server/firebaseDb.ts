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

// Default fallback Firebase configuration (ensures seamless deployment on Vercel)
const DEFAULT_FIREBASE_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || "carbon-atlas-qdzmz",
  appId: process.env.FIREBASE_APP_ID || "1:815265023401:web:bf44c034dbd71a434830b8",
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyC5BVSWwIXePgXz0-6CyVcchmwWReQ2D_M",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "carbon-atlas-qdzmz.firebaseapp.com",
  firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || "ai-studio-scribddownloader-e21bd29b-3810-4085-9c14-431af3caba1a",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "carbon-atlas-qdzmz.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "815265023401",
};

// Resolve config path
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseConfig: any = { ...DEFAULT_FIREBASE_CONFIG };

if (fs.existsSync(configPath)) {
  try {
    const fileCfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    firebaseConfig = { ...DEFAULT_FIREBASE_CONFIG, ...fileCfg };
  } catch (err) {
    console.error("[Firebase] Error reading config file:", err);
  }
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

// Memory cache pre-loaded directly on module startup for instant 0ms responses on Vercel cold starts
let pagesCache: any[] = readLocalJsonFile<any[]>(PAGES_FILE, []);
let postsCache: any[] = readLocalJsonFile<any[]>(POSTS_FILE, []);
let mediaCache: any[] = readLocalJsonFile<any[]>(MEDIA_FILE, []);
let adsCache: any[] = readLocalJsonFile<any[]>(ADS_FILE, []);
let redirectsCache: any[] = readLocalJsonFile<any[]>(REDIRECTS_FILE, []);
let settingsCache: any = readLocalJsonFile<any>(SETTINGS_FILE, null);
let categoriesCache: any[] = readLocalJsonFile<any[]>(CATEGORIES_FILE, []);
let tagsCache: any[] = readLocalJsonFile<any[]>(TAGS_FILE, []);
let homepageCache: Record<string, any> = readLocalJsonFile<Record<string, any>>(HOMEPAGE_FILE, {});

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

let isFirebaseInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize Firebase, Authenticate Server Session, Run Migration and Load Cache
 */
export async function initializeFirebaseAndAuth(): Promise<void> {
  if (isFirebaseInitialized) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    const email = "minhashussain.wp@gmail.com";
    const password = "Minhas@#12345";

    try {
      const authTimeout = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("Auth timeout")), 2500)
      );
      const authTask = (async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          const errMsg = err?.message || String(err);
          const code = err?.code || "";
          if (
            code === "auth/user-not-found" ||
            errMsg.includes("user-not-found") ||
            code === "auth/invalid-credential" ||
            errMsg.includes("invalid-credential")
          ) {
            try {
              await createUserWithEmailAndPassword(auth, email, password);
            } catch {}
          }
        }
      })();

      await Promise.race([authTask, authTimeout]);
    } catch {}

    // Load Firestore cache in parallel with timeout
    await loadDatabaseToMemoryCache();

    // Check if migration is needed in background
    runDatabaseMigration().catch(() => {});

    isFirebaseInitialized = true;
  })();

  return initializationPromise;
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
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Firestore load timeout")), 3500)
  );

  const fetchTask = async () => {
    const [
      pagesRes,
      postsRes,
      mediaRes,
      adsRes,
      redirectsRes,
      catsRes,
      tagsRes,
      settingsRes,
      homepageRes,
    ] = await Promise.allSettled([
      getDocs(collection(db, "pages")),
      getDocs(collection(db, "posts")),
      getDocs(collection(db, "media")),
      getDocs(collection(db, "ads")),
      getDocs(collection(db, "redirects")),
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "tags")),
      getDoc(doc(db, "settings", "global")),
      getDocs(collection(db, "homepage")),
    ]);

    if (pagesRes.status === "fulfilled") {
      const list: any[] = [];
      pagesRes.value.forEach((d) => {
        const data = d.data();
        delete data.sysSecretToken;
        list.push(data);
      });
      if (list.length > 0) {
        pagesCache = list;
        saveLocalJsonFile(PAGES_FILE, pagesCache);
      }
    }

    if (postsRes.status === "fulfilled") {
      const list: any[] = [];
      postsRes.value.forEach((d) => {
        const data = d.data();
        delete data.sysSecretToken;
        list.push(data);
      });
      if (list.length > 0) {
        postsCache = list;
        saveLocalJsonFile(POSTS_FILE, postsCache);
      }
    }

    if (mediaRes.status === "fulfilled") {
      const list: any[] = [];
      mediaRes.value.forEach((d) => {
        const data = d.data();
        delete data.sysSecretToken;
        list.push(data);
      });
      if (list.length > 0) {
        mediaCache = list;
        saveLocalJsonFile(MEDIA_FILE, mediaCache);
      }
    }

    if (adsRes.status === "fulfilled") {
      const list: any[] = [];
      adsRes.value.forEach((d) => {
        const data = d.data();
        delete data.sysSecretToken;
        list.push(data);
      });
      if (list.length > 0) {
        adsCache = list;
        saveLocalJsonFile(ADS_FILE, adsCache);
      }
    }

    if (redirectsRes.status === "fulfilled") {
      const list: any[] = [];
      redirectsRes.value.forEach((d) => {
        const data = d.data();
        delete data.sysSecretToken;
        list.push(data);
      });
      if (list.length > 0) {
        redirectsCache = list;
        saveLocalJsonFile(REDIRECTS_FILE, redirectsCache);
      }
    }

    if (catsRes.status === "fulfilled") {
      const list: any[] = [];
      catsRes.value.forEach((d) => {
        const data = d.data();
        delete data.sysSecretToken;
        list.push(data);
      });
      if (list.length > 0) {
        categoriesCache = list;
        saveLocalJsonFile(CATEGORIES_FILE, categoriesCache);
      }
    }

    if (tagsRes.status === "fulfilled") {
      const list: any[] = [];
      tagsRes.value.forEach((d) => {
        const data = d.data();
        delete data.sysSecretToken;
        list.push(data);
      });
      if (list.length > 0) {
        tagsCache = list;
        saveLocalJsonFile(TAGS_FILE, tagsCache);
      }
    }

    if (settingsRes.status === "fulfilled" && settingsRes.value.exists()) {
      const data = settingsRes.value.data();
      delete data.sysSecretToken;
      settingsCache = data;
      saveLocalJsonFile(SETTINGS_FILE, settingsCache);
    }

    if (homepageRes.status === "fulfilled") {
      const hp: Record<string, any> = {};
      homepageRes.value.forEach((d) => {
        const data = d.data();
        delete data.sysSecretToken;
        hp[d.id] = data;
      });
      if (Object.keys(hp).length > 0) {
        homepageCache = hp;
        saveLocalJsonFile(HOMEPAGE_FILE, homepageCache);
      }
    }
  };

  try {
    await Promise.race([fetchTask(), timeoutPromise]);
    console.log(`[Firebase] Loaded cache: ${pagesCache.length} pages, ${postsCache.length} posts, ${mediaCache.length} media.`);
  } catch (err: any) {
    console.warn("[Firebase] Fast sync finished or timed out, keeping local cache:", err?.message || err);
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
