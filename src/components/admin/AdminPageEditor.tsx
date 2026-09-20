import React from "react";
import { GutenbergEditor } from "./gutenberg/GutenbergEditor";
import { GutenbergEditorBlock } from "./gutenberg/types";

interface AdminPageEditorProps {
  initialPage: any;
  targetLang?: string;
  onBack: () => void;
  onSave: (pageData: any) => Promise<void>;
  onOpenMediaSelector?: (callback: (url: string) => void) => void;
  onPreview: (slug: string, lang?: string) => void;
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

export function AdminPageEditor({
  initialPage,
  targetLang = "en",
  onBack,
  onSave,
  onOpenMediaSelector,
  onPreview,
  availableLanguages = DEFAULT_LANGS,
}: AdminPageEditorProps) {
  const handleSave = async (payload: {
    title: string;
    content: string;
    htmlContent: string;
    blocks: GutenbergEditorBlock[];
    metadata: any;
    status: "published" | "draft";
    language: string;
  }) => {
    const pageToSave = {
      ...initialPage,
      ...payload.metadata,
      id: initialPage?.id || payload.metadata.id || "",
      title: payload.title,
      content: payload.content,
      htmlContent: payload.htmlContent,
      blocks: payload.blocks,
      status: payload.status,
      language: payload.language,
      slug: payload.metadata.slug,
      excerpt: payload.metadata.excerpt,
      metaTitle: payload.metadata.metaTitle || payload.title,
      metaDescription: payload.metadata.metaDescription || payload.metadata.excerpt,
      canonicalUrl: payload.metadata.canonicalUrl,
      noindex: payload.metadata.noindex,
      featuredImage: payload.metadata.featuredImage,
      author: payload.metadata.author,
      authorName: payload.metadata.author,
      translationGroupId: payload.metadata.translationGroupId,
      lastModified: new Date().toISOString(),
    };

    await onSave(pageToSave);
  };

  return (
    <GutenbergEditor
      initialTitle={initialPage?.title || ""}
      initialContent={initialPage?.htmlContent || initialPage?.content || ""}
      initialBlocks={initialPage?.blocks}
      initialMetadata={{
        id: initialPage?.id || "",
        slug: initialPage?.slug || "",
        subtitle: initialPage?.subtitle || "",
        excerpt: initialPage?.excerpt || "",
        status: initialPage?.status || "published",
        author: initialPage?.authorName || initialPage?.author || "Admin Team",
        featuredImage: initialPage?.featuredImage || "",
        metaTitle: initialPage?.metaTitle || initialPage?.title || "",
        metaDescription: initialPage?.metaDescription || initialPage?.excerpt || "",
        canonicalUrl: initialPage?.canonicalUrl || "",
        noindex: initialPage?.noindex || false,
        translationGroupId:
          initialPage?.translationGroupId || `group-page-${initialPage?.slug || Date.now()}`,
      }}
      targetLang={targetLang || initialPage?.language || "en"}
      availableLanguages={availableLanguages}
      onSave={handleSave}
      onBack={onBack}
      onPreview={(slug, lang) => onPreview(slug, lang)}
      entityType="page"
    />
  );
}
