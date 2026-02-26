import React from "react";
import { Featured } from "@/components/Featured";
import HomePage from "@/components/Home";
import { Blog } from "@/entities/Blog"; // Import your DB logic

// Revalidate data every hour (ISR)
export const revalidate = 3600;

export default async function BlogPage() {
  // 1. Fetch data directly on the server (FAST & SEO FRIENDLY)
  // This happens BEFORE the page is sent to the user.
  const blogs = await Blog.list();

  return (
    <>
      <HomePage />
      {/* 2. Pass the data to the client component */}
      <Featured initialBlogs={blogs} />
    </>
  );
}
