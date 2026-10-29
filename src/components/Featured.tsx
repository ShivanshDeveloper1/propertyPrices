"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const getAbsoluteUrl = (path: string) => {
  const baseUrl = "https://www.saharanpurprice.in";
  if (!path) return `${baseUrl}/main.png`;
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith(".") ? path.substring(1) : path;
  const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${baseUrl}${finalPath}`;
};

interface FeaturedProps {
  initialBlogs: any[];
}

export const Featured = ({ initialBlogs = [] }: FeaturedProps) => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [skip, setSkip] = useState(8);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBlogs.length >= 8);

  const loadMoreBlogs = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?limit=8&skip=${skip}`);
      const newBlogs = await res.json();
      // FIX: old code threw away the last partial page; now we always append
      setBlogs((prev) => [...prev, ...newBlogs]);
      setSkip((prev) => prev + 8);
      if (newBlogs.length < 8) setHasMore(false);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

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
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Featured Posts
          </h1>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Hand-picked insights and guides to boost your real estate journey
          </p>
        </div>

        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.map((cur) => (
            <motion.div
              key={cur.slug}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-full"
            >
              <Link
                href={`/Blogs/${encodeURIComponent(cur.slug)}`}
                className="group block h-full bg-[#111827] border border-gray-800/60 rounded-2xl overflow-hidden hover:border-cyan-400/40 shadow-md hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <div className="overflow-hidden">
                  {cur.coverSvg ? (
                    <div
                      className="w-full h-48 sm:h-56 lg:h-64 [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: cur.coverSvg }}
                    />
                  ) : (
                    <img
                      src={getAbsoluteUrl(cur.imageUrl)}
                      alt={cur.title}
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                  )}
                </div>

                <div className="p-6 flex flex-col gap-2">
                  <p className="text-cyan-400 font-medium text-sm">{cur.niche}</p>
                  <h2 className="text-xl font-bold text-white hover:text-cyan-400 transition-colors duration-300 leading-snug">
                    {cur.title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {cur.publishDate} &bull; {cur.readTimeMinutes} min read
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.section>

        <div className="mt-16 text-center">
          {hasMore && (
            <button
              onClick={loadMoreBlogs}
              disabled={loading}
              className="text-white font-semibold py-3 px-8 bg-transparent border border-gray-700 rounded-lg hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 text-base"
            >
              {loading ? "Loading..." : "Explore More Articles"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default Featured;