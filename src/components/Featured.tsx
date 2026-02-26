"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// --- HELPER FUNCTION: Fixes Broken Image URLs ---
// This ensures relative paths (like "./blog/img.png") become full URLs
const getAbsoluteUrl = (path: string) => {
  // You can change this to your actual production domain
  const baseUrl = "https://saharanpurprice.in";

  // 1. If empty, return a default placeholder
  if (!path) return `${baseUrl}/main.png`;

  // 2. If it's already a full web link (starts with http), leave it alone
  if (path.startsWith("http")) return path;

  // 3. Remove the dot if it exists (e.g., "./blog" becomes "/blog")
  const cleanPath = path.startsWith(".") ? path.substring(1) : path;

  // 4. Ensure it starts with a slash
  const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  // 5. Combine domain + path
  return `${baseUrl}${finalPath}`;
};

// Define the shape of the data we expect
interface FeaturedProps {
  initialBlogs: any[];
}

export const Featured = ({ initialBlogs = [] }: FeaturedProps) => {
  // Animation for the container (stagger effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // Animation for individual cards
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0c1a2b] to-[#0a0a0f] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- HEADER --- */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Featured Posts
          </h1>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Hand-picked insights and guides to boost your real estate journey
          </p>
        </div>

        {/* --- GRID --- */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {initialBlogs.map((cur) => (
            <motion.div
              key={cur.post.metadata.slug}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-full"
            >
              {/* SEO FIX: Use Next.js Link instead of onClick/div */}
              <Link
                href={`/Blogs/${encodeURIComponent(cur.post.metadata.slug)}`}
                className="block h-full bg-[#111827] border border-gray-800/60 rounded-2xl overflow-hidden hover:border-cyan-400/40 shadow-md hover:shadow-cyan-500/10 transition-all duration-300"
              >
                {/* --- IMAGE --- */}
                <div className="overflow-hidden">
                  <img
                    // FIX: Use the helper function here to prevent 404 errors
                    src={getAbsoluteUrl(cur.post.metadata.featuredImage.url)}
                    alt={cur.post.metadata.title}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>

                {/* --- CONTENT --- */}
                <div className="p-6 flex flex-col gap-2">
                  <p className="text-cyan-400 font-medium text-sm">
                    {cur.post.metadata.category}
                  </p>
                  <h2 className="text-xl font-bold text-white hover:text-cyan-400 transition-colors duration-300 leading-snug">
                    {cur.post.metadata.title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {cur.post.metadata.publishDate} &bull;{" "}
                    {cur.post.metadata.readTimeMinutes} min read
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.section>

        {/* --- BUTTON --- */}
        <div className="mt-16 text-center">
          <button className="text-white font-semibold py-3 px-8 bg-transparent border border-gray-700 rounded-lg hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 text-base">
            Explore More Articles
          </button>
        </div>
      </div>
    </main>
  );
};

export default Featured;
