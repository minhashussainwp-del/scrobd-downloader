import { useEffect } from "react";
import { PageRoute, BlogPost } from "../types";

interface SeoHeadProps {
  page: PageRoute;
  post?: BlogPost | null;
  customTitle?: string;
  customDescription?: string;
}

export function SeoHead({ page, post, customTitle, customDescription }: SeoHeadProps) {
  useEffect(() => {
    let title = "Scribd PDF Downloader - Free High-Speed Document & Slide Deck Converter";
    let description =
      "Download Scribd documents, academic research papers, and slide presentations as standard high-resolution PDF files with zero wait time. 100% free and mobile-friendly.";

    if (customTitle) {
      title = customTitle;
    } else if (page === "how-it-works") {
      title = "How It Works - Scribd Document Extraction Architecture & Guide";
      description = "Learn how our multi-threaded Node.js engine extracts high-resolution vector tiles and compiles unified standard PDF documents.";
    } else if (page === "blog") {
      title = "Scribd Document Tips, Tutorials & Guides - Official Blog";
      description = "Read comprehensive guides, tips, and step-by-step tutorials for downloading, converting, and reading Scribd documents offline.";
    } else if (page === "blog-article" && post) {
      title = `${post.title} | Scribd PDF Downloader Blog`;
      description = post.excerpt;
    } else if (page === "about") {
      title = "About Scribd PDF Downloader - Our Mission & Engineering Lab";
      description = "Discover our open-access educational document conversion utility, mission, privacy guarantees, and tech stack.";
    } else if (page === "contact") {
      title = "Contact Us & Document Extraction Support";
      description = "Get in touch with our engineering team for troubleshooting, bug reports, or feature requests.";
    } else if (page === "privacy") {
      title = "Privacy Policy - Scribd PDF Downloader";
      description = "Learn about our strict zero-retention data privacy guarantees. All temp files purged automatically.";
    } else if (page === "terms") {
      title = "Terms of Service & Fair Use - Scribd PDF Downloader";
      description = "Review our terms of service, fair-use guidelines, and DMCA copyright policies.";
    } else if (page === "admin") {
      title = "Admin Dashboard | Scribd PDF Downloader Control Center";
      description = "Administrative management system for blog articles, pages, advertisements, and system analytics.";
    }

    if (customDescription) {
      description = customDescription;
    }

    document.title = title;

    // Update or insert meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Update Open Graph tags
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setOgTag("og:title", title);
    setOgTag("og:description", description);
    setOgTag("og:type", page === "blog-article" ? "article" : "website");
    setOgTag("og:url", window.location.href);

    // Dynamic JSON-LD Schema markup injection
    const existingSchema = document.getElementById("jsonld-dynamic-schema");
    if (existingSchema) existingSchema.remove();

    const script = document.createElement("script");
    script.id = "jsonld-dynamic-schema";
    script.type = "application/ld+json";

    const schemaGraph: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Scribd PDF Downloader",
        "operatingSystem": "All",
        "applicationCategory": "UtilitiesApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free web tool to convert and download public Scribd documents and presentations into clean high-resolution PDF files."
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": page.charAt(0).toUpperCase() + page.slice(1),
            "item": window.location.href
          }
        ]
      }
    ];

    if (page === "blog-article" && post) {
      schemaGraph.push({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image,
        "datePublished": post.date,
        "author": {
          "@type": "Person",
          "name": post.author.name
        }
      });
    }

    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": schemaGraph
    });

    document.head.appendChild(script);
  }, [page, post, customTitle, customDescription]);

  return null;
}
