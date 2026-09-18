import { useEffect } from "react";
import { PageRoute, BlogPost } from "../types";
import { getAuthorProfile } from "../data/authorData";

interface SeoHeadProps {
  page: PageRoute;
  post?: BlogPost | null;
  customTitle?: string;
  customDescription?: string;
}

export function SeoHead({ page, post, customTitle, customDescription }: SeoHeadProps) {
  useEffect(() => {
    const author = getAuthorProfile();
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://scribddownloader.org";
    const currentUrl = typeof window !== "undefined" ? window.location.href : "https://scribddownloader.org";

    let title = "Scribd Downloader - Free High-Speed Document & Slide Deck Converter";
    let description =
      "Download Scribd documents, academic research papers, and slide presentations as standard high-resolution PDF files with zero wait time. 100% free and mobile-friendly.";
    let pageType: "website" | "article" = "website";
    let featureImage = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80";

    if (customTitle) {
      title = customTitle;
    } else if (page === "how-it-works") {
      title = "How It Works - Scribd Document Extraction Architecture & Guide";
      description = "Learn how our multi-threaded Node.js engine extracts high-resolution vector tiles and compiles unified standard PDF documents.";
    } else if (page === "blog") {
      title = "Scribd Document Tips, Tutorials & Guides - Official Blog";
      description = "Read comprehensive guides, tips, and step-by-step tutorials for downloading, converting, and reading Scribd documents offline.";
    } else if (page === "blog-article" && post) {
      title = `${post.title} | Scribd Downloader Blog`;
      description = post.excerpt;
      pageType = "article";
      featureImage = post.image || featureImage;
    } else if (page === "about") {
      title = "About Scribd Downloader - Our Mission & Engineering Lab";
      description = "Discover our open-access educational document conversion utility, mission, privacy guarantees, and tech stack curated by Full SEO Expert Minhas Hussain.";
    } else if (page === "contact") {
      title = "Contact Us & Document Extraction Support";
      description = "Get in touch with our engineering team for troubleshooting, bug reports, or technical queries.";
    } else if (page === "privacy") {
      title = "Privacy Policy - Scribd Downloader";
      description = "Learn about our strict zero-retention data privacy guarantees. All temp files purged automatically.";
    } else if (page === "terms") {
      title = "Terms of Service & Fair Use - Scribd Downloader";
      description = "Review our terms of service, fair-use guidelines, and DMCA copyright policies.";
    } else if (page === "admin") {
      title = "Admin Dashboard | Scribd Downloader Control Center";
      description = "Administrative management system for blog articles, pages, advertisements, SEO controls, and system analytics.";
    }

    if (customDescription) {
      description = customDescription;
    }

    // 1. Page Title
    document.title = title;

    // Helper to set or create meta tags by name or property
    const setMetaTag = (attr: "name" | "property", key: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 2. Standard Search Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", "scribd downloader, download scribd to pdf, free scribd converter, scribd pdf download, read scribd offline, scribd document viewer, slide deck downloader, technical seo, pdf converter");
    setMetaTag("name", "author", `${author.name} - ${author.role}`);
    setMetaTag("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // 3. Open Graph Tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", pageType);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:image", featureImage);
    setMetaTag("property", "og:site_name", "Scribd Downloader");
    setMetaTag("property", "og:locale", "en_US");

    // 4. Twitter / X Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", featureImage);
    setMetaTag("name", "twitter:creator", "@minhashussain");

    // 5. Canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", currentUrl);

    // 6. Rich Schema.org Structured Data (JSON-LD)
    const existingSchema = document.getElementById("jsonld-dynamic-schema");
    if (existingSchema) existingSchema.remove();

    const script = document.createElement("script");
    script.id = "jsonld-dynamic-schema";
    script.type = "application/ld+json";

    const schemaGraph: any[] = [
      // WebSite Schema with Sitelinks Searchbox
      {
        "@type": "WebSite",
        "@id": `${currentOrigin}/#website`,
        "url": currentOrigin,
        "name": "Scribd Downloader",
        "description": "Free High-Speed Document & Slide Deck Converter",
        "publisher": {
          "@id": `${currentOrigin}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${currentOrigin}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      // Organization Schema
      {
        "@type": "Organization",
        "@id": `${currentOrigin}/#organization`,
        "name": "Scribd Downloader",
        "url": currentOrigin,
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
        },
        "founder": {
          "@id": `${currentOrigin}/#author`
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": author.email,
          "contactType": "Technical Support",
          "availableLanguage": ["English", "Urdu", "Spanish", "Portuguese", "Indonesian"]
        }
      },
      // Person Schema (Author / SEO Expert)
      {
        "@type": "Person",
        "@id": `${currentOrigin}/#author`,
        "name": author.name,
        "jobTitle": author.role,
        "description": author.bio,
        "email": author.email,
        "image": author.avatar,
        "url": currentOrigin,
        "knowsAbout": author.skills
      },
      // SoftwareApplication / WebApplication Schema
      {
        "@type": "WebApplication",
        "@id": `${currentOrigin}/#app`,
        "name": "Scribd Downloader",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All (Web, Windows, macOS, Linux, iOS, Android)",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "14280"
        },
        "description": "Free online tool to extract and download public Scribd documents, textbooks, and slide presentations as standard high-resolution PDF files."
      },
      // BreadcrumbList Schema
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": currentOrigin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": page === "blog-article" && post ? post.title : page.charAt(0).toUpperCase() + page.slice(1).replace("-", " "),
            "item": currentUrl
          }
        ]
      },
      // HowTo Schema: How to Download Scribd Documents to PDF
      {
        "@type": "HowTo",
        "name": "How to Download Scribd Documents as PDF for Free",
        "description": "Step-by-step instructions to convert and save public Scribd slides, books, and documents as offline PDF files.",
        "totalTime": "PT1M",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Copy Document URL",
            "text": "Navigate to the Scribd document in your web browser and copy the URL from your address bar."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Paste URL into Downloader",
            "text": "Paste the copied link into the Scribd Downloader input box on the homepage and click Download."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Save High-Res PDF",
            "text": "Wait a few seconds for page extraction, preview the document, and download your clean, unified PDF file."
          }
        ]
      },
      // FAQPage Schema
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is Scribd Downloader completely free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Scribd Downloader is 100% free with no registration, subscription, or software installation required."
            }
          },
          {
            "@type": "Question",
            "name": "Are downloaded PDF documents high resolution?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our multi-threaded engine extracts original vector tiles and text layers to ensure sharp text rendering and high-quality images."
            }
          },
          {
            "@type": "Question",
            "name": "Does this tool work on mobile phones and tablets?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Scribd Downloader is fully responsive and works smoothly across Chrome, Safari, Firefox, iOS, and Android."
            }
          }
        ]
      }
    ];

    // If blog article page, attach Article schema
    if (page === "blog-article" && post) {
      schemaGraph.push({
        "@type": "Article",
        "@id": `${currentUrl}/#article`,
        "isPartOf": {
          "@id": `${currentOrigin}/#website`
        },
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image,
        "datePublished": post.date,
        "dateModified": post.date,
        "mainEntityOfPage": currentUrl,
        "author": {
          "@type": "Person",
          "name": author.name,
          "jobTitle": author.role,
          "url": currentOrigin
        },
        "publisher": {
          "@id": `${currentOrigin}/#organization`
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
