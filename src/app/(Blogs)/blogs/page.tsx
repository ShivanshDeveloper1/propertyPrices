import React from "react";
import { Featured } from "@/components/Featured";
import HomePage from "@/components/Home";
import { getPublishedBlogCards } from "@/lib/blogs";

export const metadata = {
  title: "Saharanpur Property Blog | Rates, Buying Tips & Investment Insights",
  description:
    "Explore Saharanpur property rates, buying guides, investment tips, and real estate updates. Learn where to buy property in Saharanpur with local expert insights.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const blogs = await getPublishedBlogCards({ limit: 8, skip: 0 });

  return (
    <>
      <HomePage />
      <Featured initialBlogs={blogs} />
    </>
  );
}