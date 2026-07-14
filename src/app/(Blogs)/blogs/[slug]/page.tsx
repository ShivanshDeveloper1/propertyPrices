import React from "react";
import type { Metadata } from "next";
import BlogClientWrapper from "../../../../components/BlogClientWrapper";
import { notFound } from "next/navigation";
import { Blog } from "@/models/Blog";
import fs from "fs";
import path from "path";

// --- SMART PATH CHECKER (The Magic Fix) ---
// This function checks the REAL hard drive to see if the file exists.
// If missing, it returns the default image.
const getVerifiedPath = (originalPath: string) => {
  if (!originalPath) return "/main.png";
  if (originalPath.startsWith("http")) return originalPath;

  // 1. Fix the "uploads" folder mismatch logic
  let clean = originalPath.replace("uploads/", "");
  clean = clean.replace(/^\.?\//, ""); // Remove starting ./ or /

  try {
    // 2. Check if file exists on the server's hard drive
    const publicDir = path.join(process.cwd(), "public");
    const fullPath = path.join(publicDir, clean);

    if (fs.existsSync(fullPath)) {
      return `/${clean}`; // File exists! Return clean path.
    } else {
      // File is missing! Return default so browser doesn't error.
      // (Optional: Log to server console so YOU know it's missing)
      // console.log(`[Server] Image missing: ${clean}, falling back to default.`);
      return "/main.png";
    }
  } catch (error) {
    // If any error checking file, failsafe to default
    return "/main.png";
  }
};

// --- HELPER 1: For Google/SEO (Full HTTPS link) ---
const getSeoUrl = (path: string) => {
  const baseUrl = "https://saharanpurprice.in";
  const verifiedPath = getVerifiedPath(path);

  if (verifiedPath.startsWith("http")) return verifiedPath;
  return `${baseUrl}${verifiedPath}`;
};

// --- HELPER 2: For Display (Relative link) ---
const getDisplayUrl = (path: string) => {
  return getVerifiedPath(path);
};

// 1. DYNAMIC SEO METADATA
export async function generateMetadata({ params }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  const postData = await Blog.getBySlug(decodedSlug);
  if (!postData) return { title: "Post Not Found" };

  const { metadata } = postData.post;

  // This will now ALWAYS be a valid link (real image or main.png)
  const seoImageUrl = getSeoUrl(metadata?.featuredImage?.url || "");
  const authorName = metadata.author?.name || "Shivansh";

  return {
    title: metadata.title,
    description: metadata.summary,
    authors: [{ name: authorName }],
    keywords: (
      metadata.tags ?? [metadata.category, "Saharanpur Real Estate"]
    ).join(", "),
    openGraph: {
      title: metadata.title,
      description: metadata.summary,
      url: `https://saharanpurprice.in/blogs/${decodedSlug}`,
      images: [
        {
          url: seoImageUrl,
          width: 1200,
          height: 630,
          alt: metadata.featuredImage.altText,
        },
      ],
      type: "article",
      publishedTime: metadata.publishDate,
      authors: [authorName],
      tags: metadata.tags,
      section: metadata.category,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.summary,
      images: [seoImageUrl],
    },
  };
}

// 2. SERVER COMPONENT
const SingleBlogPage = async ({ params }) => {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  const postData = await Blog.getBySlug(decodedSlug);
  if (!postData) notFound();

  const { metadata, body } = postData.post;

  const seoImageUrl = getSeoUrl(metadata.featuredImage.url);
  const displayImageUrl = getDisplayUrl(metadata.featuredImage.url);

  const cleanMetadata = {
    ...metadata,
    featuredImage: { ...metadata.featuredImage, url: displayImageUrl },
  };

  const authorName = metadata.author?.name || "Shivansh";

  // --- 1. NewsArticle Schema ---
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": metadata.title,
    "image": [seoImageUrl],
    "datePublished": metadata.publishDate,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": metadata.author?.url || "https://saharanpurprice.in/about",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Saharanpur Price",
      "logo": { "@type": "ImageObject", "url": "https://saharanpurprice.in/icon.png" }
    },
    "description": metadata.summary,
  };

  // --- 2. Improved FAQ Schema Logic ---
  const faqBlock = body.find(block => block.type === "list" && block.items);
  const faqItems = faqBlock ? faqBlock.items : [];

  const faqJsonLd = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => {
      // Split by "** " and "?** " to handle your Markdown formatting
      const parts = item.split("?** "); 
      const question = parts[0].replace(/\*\*/g, "").trim();
      const answer = parts[1]?.trim() || "";

      return {
        "@type": "Question",
        "name": question + "?",
        "acceptedAnswer": { "@type": "Answer", "text": answer }
      };
    })
  } : null;

  // --- 3. Combine into a Schema Graph ---
  // This is the cleanest way for Google to read multiple schemas
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [articleJsonLd, faqJsonLd].filter(Boolean)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <BlogClientWrapper metadata={cleanMetadata} body={body} />
    </>
  );
};

export default SingleBlogPage;
