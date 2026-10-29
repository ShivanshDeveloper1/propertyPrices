import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogClientWrapper from "@/components/BlogClientWrapper";
import { getPublishedBlogBySlug } from "@/lib/blogs";

const BASE = "https://saharanpurprice.in";

const getSeoImage = (blog: any) => {
  const p = blog?.imageUrl;

  if (!p) return `${BASE}/main.png`;

  if (p.startsWith("http")) return p;

  return `${BASE}${p.startsWith("/") ? p : `/${p.replace(/^\.?\//, "")}`}`;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;

    const blog = await getPublishedBlogBySlug(decodeURIComponent(slug));

    if (!blog) {
      return {
        title: "Property Guide Not Found",
      };
    }

    const title = blog.title || "Saharanpur Real Estate Guide";

    const description =
      blog.whyItMatters?.slice(0, 160) ||
      "Property market insights for Saharanpur.";

    const img = getSeoImage(blog);

    return {
      title,
      description,

      keywords: [
        blog.niche,
        "Saharanpur Real Estate",
      ].filter(Boolean),

      openGraph: {
        title,
        description,
        url: `${BASE}/blog/${blog.slug}`,
        images: [
          {
            url: img,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: "article",
        section: blog.niche,
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [img],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    return {
      title: "Saharanpur Real Estate",
    };
  }
}

const SingleBlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  let blog: any;

  try {
    blog = await getPublishedBlogBySlug(
      decodeURIComponent(slug)
    );
  } catch (error) {
    console.error(`Error loading blog: ${slug}`, error);
    notFound();
  }

  if (!blog) {
    notFound();
  }

  const safeBlog = JSON.parse(JSON.stringify(blog));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",

    headline: blog.title,

    image: [getSeoImage(blog)],

    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,

    author: {
      "@type": "Person",
      name: "Shivansh",
      url: `${BASE}/about`,
    },

    publisher: {
      "@type": "Organization",
      name: "Saharanpur Price",
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/icon.png`,
      },
    },

    description: blog.whyItMatters?.slice(0, 160),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />

      <BlogClientWrapper blog={safeBlog} />
    </>
  );
};

export default SingleBlogPage;