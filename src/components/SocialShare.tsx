import React, { useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, MessageCircle, Copy, Check } from "lucide-react";

interface SocialShareProps {
  url?: string;
  shareUrl?: string;
  title?: string;
  className?: string;
}

export function SocialShare({
  url,
  shareUrl,
  title = "Scribd Downloader - Free High Speed Document & Slide Converter",
  className = "",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const activeUrl =
    shareUrl ||
    url ||
    (typeof window !== "undefined" ? window.location.href : "https://scribddownloader.org");

  const encodedUrl = encodeURIComponent(activeUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: activeUrl,
        });
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`} id="social-share-widget">
      <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5" />
        <span>Share:</span>
      </span>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 transition shadow-2xs"
        title="Share on X (Twitter)"
        aria-label="Share on X"
      >
        <Twitter className="w-3.5 h-3.5" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition shadow-2xs"
        title="Share on Facebook"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-3.5 h-3.5" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition shadow-2xs"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-700 transition shadow-2xs"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>

      {/* Copy link button */}
      <button
        type="button"
        onClick={handleCopy}
        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
        title="Copy Link to Clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
