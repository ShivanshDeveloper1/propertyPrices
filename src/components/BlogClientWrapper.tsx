"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";

// --- HELPER: Handles Links [Text](URL) AND Bold **Text** ---
const formatText = (text: string) => {
  if (!text) return "";

  // 1. Clean HTML bold tags (legacy support)
  let cleanText = text
    .replace(/<strong>/g, "**")
    .replace(/<\/strong>/g, "**")
    .replace(/<b>/g, "**")
    .replace(/<\/b>/g, "**");

  // 2. Split by Markdown Links: [Title](URL)
  const parts = cleanText.split(/(\[.*?\]\(.*?\))/g);

  return parts.map((part, index) => {
    // A. Check if this part is a LINK
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      return (
        <a
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-semibold transition-colors"
        >
          {linkText}
        </a>
      );
    }

    // B. If not a link, process for BOLD (**text**)
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={index}>
        {boldParts.map((subPart, j) => {
          if (subPart.startsWith("**") && subPart.endsWith("**")) {
            return (
              <strong key={j} className="text-cyan-400 font-bold">
                {subPart.slice(2, -2)}
              </strong>
            );
          }
          return subPart;
        })}
      </span>
    );
  });
};

// --- GLOBAL DECLARATION FOR INSTAGRAM ---
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default function BlogClientWrapper({
  metadata,
  body,
}: {
  metadata: any;
  body: any[];
}) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);

    // --- EMBED SCRIPT HANDLER (Instagram & Others) ---
    const hasInstagramEmbed = document.querySelector(".instagram-media");

    if (hasInstagramEmbed) {
      if (typeof window !== "undefined" && !window.instgrm) {
        const script = document.createElement("script");
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      } else if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }
  }, [body]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  const renderBlock = (block: any, index: any) => {
    if (block.type === "heading") {
      const level = block.level && block.level > 1 ? block.level : 2;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return (
        <Tag
          key={index}
          className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-8 mb-4"
        >
          {formatText(block.content || block.text)}
        </Tag>
      );
    }

    if (block.type === "paragraph") {
      return (
        <p key={index} className="text-lg text-gray-300 leading-relaxed mb-4">
          {formatText(block.content || block.text)}
        </p>
      );
    }

    if(block.type == "pdf"){
     return (
    <div key={index} className="my-6">
      <a
        href={block.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition"
      >
        {block.title}
      </a>
    </div>
  );
    }

    if (block.type === "list") {
      return (
        <ul
          key={index}
          className="list-disc list-inside space-y-3 pl-4 bg-gray-900/40 p-6 rounded-xl border border-gray-800 mb-6"
        >
          {block.items.map((item: string, i: number) => (
            <li key={i} className="text-gray-300 leading-relaxed">
              {formatText(item)}
            </li>
          ))}
        </ul>
      );
    }

    // --- HTML / EMBED BLOCK ---
    if (block.type === "html" || block.type === "embed") {
      return (
        <div
          key={index}
          className="my-8 flex justify-center w-full"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
    }

    return null;
  };

  const imageUrl = metadata?.featuredImage?.url;
  const isValidUrl =
    imageUrl &&
    (imageUrl.startsWith("http") ||
      imageUrl.startsWith("/") ||
      imageUrl.startsWith("."));

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0c1a2b] to-[#0a0a0f] text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col items-center text-center gap-4"
        >
          <motion.p
            variants={fadeUp}
            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 px-4 py-1 rounded-full text-sm font-medium shadow-md backdrop-blur"
          >
            {metadata.category}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-2 max-w-4xl leading-tight"
          >
            {metadata.title}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-gray-400 mt-2 text-sm">
            {metadata.publishDate} &bull; {metadata.readTimeMinutes} min read
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="w-full max-w-5xl my-10 md:my-12"
          >
            {isValidUrl ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                <Image
                  src={imageUrl}
                  alt={metadata.featuredImage.altText || metadata.title}
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
          <motion.article
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full lg:w-2/3 flex flex-col gap-2"
          >
            {body.map((block, index) => {
              if (block.type === "section") {
                return (
                  <div key={index} className="mb-8">
                    {block.heading && (
                      <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-8 mb-4">
                        {block.heading}
                      </h2>
                    )}
                    {block.content &&
                      block.content.map((innerBlock: any, i: number) =>
                        renderBlock(innerBlock, `${index}-${i}`)
                      )}
                  </div>
                );
              }
              return renderBlock(block, index);
            })}
          </motion.article>

          <motion.aside
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="w-full lg:w-1/3"
          >
            <div className="sticky top-24 space-y-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827] to-[#0d1321] border border-gray-800 shadow-xl backdrop-blur-lg">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Share this article
                </h3>
                <div className="flex gap-4">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      currentUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/40 transition"
                  >
                    <FaFacebookF size={20} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      currentUrl
                    )}&text=${encodeURIComponent(metadata.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/40 transition"
                  >
                    <FaTwitter size={20} />
                  </a>
                  <button
                    onClick={() => {
                      if (currentUrl) navigator.clipboard.writeText(currentUrl);
                    }}
                    className="p-3 rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-600 transition"
                  >
                    <FaLink size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-2">
                  Buying Property?
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Don't trust blindly. Check the official price trends on our
                  platform before you negotiate.
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
