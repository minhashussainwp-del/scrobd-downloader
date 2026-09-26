import { BlogPost } from "../types";

export const BLOG_POSTS: BlogPost[] = [];

export function getPostTranslationGroupId(post: BlogPost): string {
  if (post.translationGroupId) return post.translationGroupId;
  return `tg-${post.id}`;
}

export function loadAllBlogPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem("scribd_blog_posts");
    if (raw) {
      const parsed: BlogPost[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((p) => p && p.id && !p.inTrash && p.status !== "draft");
      }
    }
  } catch (e) {
    console.error("Error reading stored blog posts:", e);
  }
  return BLOG_POSTS.filter((p) => !p.inTrash && p.status !== "draft");
}

export function saveBlogPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem("scribd_blog_posts", JSON.stringify(posts));
  } catch (e) {
    console.error("Error saving blog posts:", e);
  }
}

export function getUniquePublishedPosts(posts: BlogPost[], currentLang?: string): BlogPost[] {
  const activePublished = (posts || []).filter((p) => p && !p.inTrash && p.status !== "draft");
  const groups = new Map<string, BlogPost[]>();

  activePublished.forEach((post) => {
    const groupId = post.translationGroupId || `tg-${post.id}`;
    if (!groups.has(groupId)) {
      groups.set(groupId, []);
    }
    groups.get(groupId)!.push(post);
  });

  const result: BlogPost[] = [];
  groups.forEach((groupPosts) => {
    if (currentLang) {
      const match = groupPosts.find((p) => (p.language || "en") === currentLang);
      if (match) {
        result.push(match);
        return;
      }
    }
    const defaultMatch = groupPosts.find((p) => (p.language || "en") === "en") || groupPosts[0];
    if (defaultMatch) {
      result.push(defaultMatch);
    }
  });

  return result;
}
