import { useState, useEffect } from "react";
import { AuthorProfile } from "../types";

export const DEFAULT_AUTHOR_PROFILE: AuthorProfile = {
  name: "Minhas Hussain",
  role: "Full SEO Expert & Full Stack Engineer",
  title: "WordPress Website Designer & Full-Stack Vibe Coder | Technical & On-Page SEO",
  bio: "Minhas Hussain is a Full SEO Expert, WordPress Website Designer, and Full-Stack Web Engineer specializing in end-to-end search engine optimization (Technical SEO, On-Page architecture, Structured Data, and Core Web Vitals), modern web design, and fast vibe-coding workflows. He builds high-speed, accessible web applications optimized for maximum search visibility and top Google rankings.",
  email: "minhashussain.wp@gmail.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  skills: [
    "Full SEO (Technical, On-Page, Off-Page)",
    "Schema.org & Rich Snippets",
    "Core Web Vitals & PageSpeed",
    "WordPress Website Design",
    "Full-Stack Web Development",
    "Vibe Coding & AI Workflows",
    "Search Performance & AEO",
    "React & TypeScript Architecture"
  ],
  website: "mailto:minhashussain.wp@gmail.com",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  }
};

const STORAGE_KEY = "scribd_author_profile";

export function getAuthorProfile(): AuthorProfile {
  if (typeof window === "undefined") {
    return DEFAULT_AUTHOR_PROFILE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_AUTHOR_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_AUTHOR_PROFILE,
      ...parsed,
      skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : DEFAULT_AUTHOR_PROFILE.skills
    };
  } catch {
    return DEFAULT_AUTHOR_PROFILE;
  }
}

export function saveAuthorProfile(profile: AuthorProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent("author_profile_updated", { detail: profile }));
  } catch (err) {
    console.error("Failed to save author profile", err);
  }
}

export function useAuthorProfile(): {
  profile: AuthorProfile;
  updateProfile: (updated: AuthorProfile) => void;
  resetProfile: () => void;
} {
  const [profile, setProfile] = useState<AuthorProfile>(getAuthorProfile);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<AuthorProfile>;
      if (custom.detail) {
        setProfile(custom.detail);
      } else {
        setProfile(getAuthorProfile());
      }
    };

    window.addEventListener("author_profile_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("author_profile_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateProfile = (updated: AuthorProfile) => {
    setProfile(updated);
    saveAuthorProfile(updated);
  };

  const resetProfile = () => {
    setProfile(DEFAULT_AUTHOR_PROFILE);
    saveAuthorProfile(DEFAULT_AUTHOR_PROFILE);
  };

  return { profile, updateProfile, resetProfile };
}
