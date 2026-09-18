export const DEFAULT_POST_IMAGE =
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80";

export const DEFAULT_AUTHOR_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";

/**
 * Robust image error handler that tries alternative local paths before falling back to high-res placeholder
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = DEFAULT_POST_IMAGE
) {
  const target = event.currentTarget;
  const currentSrc = target.src || "";

  // If failed on /images/articles/..., try fallback to /images/...
  if (currentSrc.includes("/images/articles/")) {
    const filename = currentSrc.split("/images/articles/")[1];
    if (filename && !target.dataset.retriedLocal) {
      target.dataset.retriedLocal = "true";
      target.src = `/images/${filename}`;
      return;
    }
  }

  // If already retried or generic failure, set safe fallback
  if (target.src !== fallbackUrl) {
    target.src = fallbackUrl;
  }
}
