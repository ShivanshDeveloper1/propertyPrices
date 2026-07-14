import React from "react";
import { Featured } from "@/components/Featured";
import HomePage from "@/components/Home";
import { Blog } from "@/models/Blog"; // Import your DB logic

// Revalidate data every hour (ISR)

export const metadata = {
  title: "Saharanpur Property Blog | Rates, Buying Tips & Investment Insights",
  description:
    "Explore Saharanpur property rates, buying guides, investment tips, and real estate updates. Learn where to buy property in Saharanpur with local expert insights.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const blogs = await Blog.list();

  return (
    <>
      <HomePage />
      {/* 2. Pass the data to the client component */}
      <Featured initialBlogs={blogs} />
    </>
  );
}
