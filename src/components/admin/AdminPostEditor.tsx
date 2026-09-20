import React from "react";
import { GutenbergEditor } from "./gutenberg/GutenbergEditor";
import { GutenbergEditorBlock } from "./gutenberg/types";

interface AdminPostEditorProps {
  initialPost: any;
  targetLang?: string;
  onBack: () => void;
  onSave: (postData: any) => Promise<void>;
  onPreview: (slug: string, lang?: string) => void;
  categories?: any[];
  availableLanguages?: Array<{ code: string; name: string; flag: string }>;
}

const DEFAULT_LANGS = [
  { code: "en", name: "English (Base)", flag: "🇺🇸" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇲🇽" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
];

export function AdminPostEditor({
  initialPost,
  targetLang = "en",
  onBack,
  onSave,
  onPreview,
  categories = [
    { id: "cat-1", name: "Guides" },
    { id: "cat-2", name: "Tutorials" },
    { id: "cat-3", name: "Tech" },
    { id: "cat-4", name: "Tips" },
  ],
  availableLanguages = DEFAULT_LANGS,
}: AdminPostEditorProps) {
  const handleSave = async (payload: {
    title: string;
    content: string;
    htmlContent: string;
    blocks: GutenbergEditorBlock[];
    metadata: any;
    status: "published" | "draft";
    language: string;
  }) => {
    const postToSave = {
      ...initialPost,
      ...payload.metadata,
      id: initialPost?.id || payload.metadata.id || "",
      title: payload.title,
      content: payload.content,
      htmlContent: payload.htmlContent,
      blocks: payload.blocks,
      status: payload.status,
      language: payload.language,
      slug: payload.metadata.slug,
      excerpt: payload.metadata.excerpt,
      category: payload.metadata.category || "Guides",
      tags: Array.isArray(payload.metadata.tags)
        ? payload.metadata.tags
        : typeof payload.metadata.tags === "string"
        ? payload.metadata.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : ["Scribd", "PDF", "Guide"],
      metaTitle: payload.metadata.metaTitle || payload.title,
      metaDescription: payload.metadata.metaDescription || payload.metadata.excerpt,
      canonicalUrl: payload.metadata.canonicalUrl,
      noindex: payload.metadata.noindex,
      image:
        payload.metadata.featuredImage ||
        initialPost?.image ||
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
      featured: payload.metadata.featured ?? initialPost?.featured ?? false,
      author: {
        name: payload.metadata.author || initialPost?.author?.name || "Minhas Hussain",
        role: initialPost?.author?.role || "Lead Document Specialist",
        avatar:
          initialPost?.author?.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      },
      translationGroupId:
        payload.metadata.translationGroupId ||
        initialPost?.translationGroupId ||
        `group-post-${payload.metadata.slug || Date.now()}`,
      readTime: `${Math.max(1, Math.ceil((payload.content?.length || 500) / 1000))} min read`,
      date:
        initialPost?.date ||
        new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    };

    await onSave(postToSave);
  };

  return (
    <GutenbergEditor
      initialTitle={initialPost?.title || ""}
      initialContent={initialPost?.htmlContent || initialPost?.content || ""}
      initialBlocks={initialPost?.blocks}
      initialMetadata={{
        id: initialPost?.id || "",
        slug: initialPost?.slug || "",
        excerpt: initialPost?.excerpt || "",
        status: initialPost?.status || "published",
        category: initialPost?.category || "Guides",
        tags: Array.isArray(initialPost?.tags)
          ? initialPost.tags.join(", ")
          : initialPost?.tags || "Scribd, PDF, Guide",
        author: initialPost?.author?.name || "Minhas Hussain",
        featuredImage: initialPost?.image || "",
        metaTitle: initialPost?.metaTitle || initialPost?.title || "",
        metaDescription: initialPost?.metaDescription || initialPost?.excerpt || "",
        canonicalUrl: initialPost?.canonicalUrl || "",
        noindex: initialPost?.noindex || false,
        translationGroupId:
          initialPost?.translationGroupId || `group-post-${initialPost?.slug || Date.now()}`,
      }}
      targetLang={targetLang || initialPost?.language || "en"}
      availableLanguages={availableLanguages}
      onSave={handleSave}
      onBack={onBack}
      onPreview={(slug, lang) => onPreview(slug, lang)}
      entityType="post"
    />
  );
}
