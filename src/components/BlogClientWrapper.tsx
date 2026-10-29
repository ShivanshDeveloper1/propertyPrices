"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";

const gradientH2 =
  "text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-8 mb-4";

// Handles [Text](URL) and **bold**
const formatText = (text: string) => {
  if (!text) return "";
  const clean = text
    .replace(/<strong>/g, "**").replace(/<\/strong>/g, "**")
    .replace(/<b>/g, "**").replace(/<\/b>/g, "**");

  return clean.split(/(\[.*?\]\(.*?\))/g).map((part, index) => {
    const m = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (m) {
      return (
        <a
          key={index}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold transition-colors"
        >
          {m[1]}
        </a>
      );
    }
    return (
      <span key={index}>
        {part.split(/(\*\*.*?\*\*)/g).map((s, j) =>
          s.startsWith("**") && s.endsWith("**") ? (
            <strong key={j} className="text-cyan-400 font-bold">{s.slice(2, -2)}</strong>
          ) : (
            s
          )
        )}
      </span>
    );
  });
};

const readTime = (b: any) => {
  const words = [b.whyItMatters, b.realWorldExample, ...(b.consequences || [])]
    .join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

export default function BlogClientWrapper({ blog }: { blog: any }) {
  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => setCurrentUrl(window.location.href), []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  const comparison = (blog.comparison || []).filter(
    (i: any) =>
      i?.factor?.trim() &&
      ((i.withInvestment || i.withWebsite || "").trim() ||
        (i.withoutInvestment || i.withoutWebsite || "").trim())
  );
  const consequences = (blog.consequences || []).filter(
    (i: any) => typeof i === "string" && i.trim()
  );

  const date = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0c1a2b] to-[#0a0a0f] text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col items-center text-center gap-4"
        >
          {blog.niche && (
            <motion.p
              variants={fadeUp}
              className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-4 py-1 rounded-full text-sm font-medium shadow-md backdrop-blur"
            >
              {blog.niche}
            </motion.p>
          )}

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-2 max-w-4xl leading-tight"
          >
            {blog.title}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-gray-400 mt-2 text-sm">
            {date} &bull; {readTime(blog)} min read
          </motion.p>

          <motion.div variants={fadeUp} className="w-full max-w-5xl my-10 md:my-12">
            {blog.coverSvg ? (
              <div
                className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-800 shadow-2xl [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: blog.coverSvg }}
              />
            ) : blog.imageUrl ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
          </motion.div>
        </motion.section>

        <section className="w-full flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* ARTICLE */}
          <motion.article
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full lg:w-2/3 flex flex-col gap-2"
          >
            {blog.whyItMatters?.trim() && (
              <div className="mb-8">
                <h2 className={gradientH2}>Why This Matters for Saharanpur Property Buyers</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  {formatText(blog.whyItMatters)}
                </p>
              </div>
            )}

            {comparison.length > 0 && (
              <div className="mb-8">
                <h2 className={gradientH2}>Property Investment Analysis</h2>
                <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/40">
                  <table className="w-full min-w-[560px] text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-900/80">
                        <th className="px-5 py-3 font-semibold text-cyan-400 border-b border-gray-800">Factor</th>
                        <th className="px-5 py-3 font-semibold text-cyan-400 border-b border-gray-800">With Property Investment</th>
                        <th className="px-5 py-3 font-semibold text-cyan-400 border-b border-gray-800">Without Property Investment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((item: any, i: number) => {
                        const w = item.withInvestment || item.withWebsite;
                        const wo = item.withoutInvestment || item.withoutWebsite;
                        return (
                          <tr key={i} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/40">
                            <td className="px-5 py-4 font-medium text-white">{item.factor}</td>
                            <td className="px-5 py-4 text-gray-300">{w?.trim() ? formatText(w) : "N/A"}</td>
                            <td className="px-5 py-4 text-gray-300">{wo?.trim() ? formatText(wo) : "N/A"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {consequences.length > 0 && (
              <div className="mb-8">
                <h2 className={gradientH2}>Key Considerations & Potential Risks</h2>
                <ul className="list-disc list-inside space-y-3 pl-4 bg-gray-900/40 p-6 rounded-xl border border-gray-800 mb-6">
                  {consequences.map((item: string, i: number) => (
                    <li key={i} className="text-gray-300 leading-relaxed">{formatText(item)}</li>
                  ))}
                </ul>
              </div>
            )}

            {blog.realWorldExample?.trim() && (
              <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/30">
                <h2 className="text-xl font-bold text-white mb-3">Real-World Saharanpur Scenario</h2>
                <p className="text-gray-300 leading-relaxed">{formatText(blog.realWorldExample)}</p>
              </div>
            )}

            {blog.callToAction?.trim() && (
              <div className="mt-6 p-8 rounded-xl text-center bg-gray-900/60 border border-gray-800">
                <h2 className="text-2xl font-bold mb-3">Explore Property Listings in Saharanpur</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-6">{formatText(blog.callToAction)}</p>
                <a
                  href="/"
                  className="inline-block px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition"
                >
                  Browse Listings Today
                </a>
              </div>
            )}
          </motion.article>

          {/* SIDEBAR */}
          <motion.aside
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="w-full lg:w-1/3"
          >
            <div className="sticky top-24 space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827] to-[#0d1321] border border-gray-800 shadow-xl backdrop-blur-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Share this article</h3>
                <div className="flex gap-4">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/40 transition"
                  >
                    <FaFacebookF size={20} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blog.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/40 transition"
                  >
                    <FaTwitter size={20} />
                  </a>
                  <button
                    onClick={() => currentUrl && navigator.clipboard.writeText(currentUrl)}
                    className="p-3 rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-600 transition"
                  >
                    <FaLink size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-2">Buying Property?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Don&apos;t trust blindly. Check the official price trends on our platform before you negotiate.
                </p>
                <a
                  href="/"
                  className="block w-full text-center py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition"
                >
                  Check Prices Now
                </a>
              </div>
            </div>
          </motion.aside>
        </section>
      </div>
    </main>
  );
}