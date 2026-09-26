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
        return parsed.filter((p) => p && p.id && !p.inTrash);
      }
    }
  } catch (e) {
    console.error("Error reading stored blog posts:", e);
  }
  return BLOG_POSTS;
}

export function saveBlogPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem("scribd_blog_posts", JSON.stringify(posts));
  } catch (e) {
    console.error("Error saving blog posts:", e);
  }
}
