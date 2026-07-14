"use client";

import React, { useState, useEffect } from "react";

export default function TestBlogPage() {
  const [blogData, setBlogData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false);

  const fetchTestBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-blog");

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const data = await res.json();

      console.log("API Response", data);


      if (data && data.blog) {
        setBlogData(data.blog);
      } else {
        throw new Error("Invalid response format. Expected { blog: ... }");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestBlog();
  }, []);

  // Inline Block Renderer
  const renderBlock = (block: any, index: string | number) => {
    if (!block) return null;

    switch (block.type) {
      case "heading":
        const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag key={index} className="text-2xl font-bold text-cyan-400 mt-8 mb-4">
            {block.content}
          </HeadingTag>
        );
      
      case "paragraph":
        return (
          <p key={index} className="text-gray-300 text-lg leading-relaxed mb-4">
            {block.content}
          </p>
        );
      
      case "list":
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-gray-300 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            {block.items?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      
      case "html":
      case "embed":
        return (
          <div 
            key={index} 
            className="my-6 p-4 bg-white/5 rounded-lg border border-gray-700"
            dangerouslySetInnerHTML={{ __html: block.content }} 
          />
        );
      
      case "pdf":
        return (
          <div key={index} className="my-6">
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition"
            >
              📄 View PDF: {block.title}
            </a>
          </div>
        );
      
      case "section":
        return (
          <section key={index} className="my-10 p-6 lg:p-8 bg-gray-900 border border-gray-800 rounded-2xl">
            {block.heading && (
              <h2 className="text-3xl font-extrabold text-white mb-6 border-b border-gray-800 pb-4">
                {block.heading}
              </h2>
            )}
            {block.content?.map((innerBlock: any, i: number) => 
              renderBlock(innerBlock, `${index}-${i}`)
            )}
          </section>
        );
      
      default:
        return (
          <div key={index} className="p-4 mb-4 bg-red-900/30 text-red-400 border border-red-800 rounded-lg text-sm font-mono">
            Unrecognized block type: {block.type}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium animate-pulse">
          Generating standalone test preview...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white px-4">
        <div className="p-6 max-w-md bg-red-950/40 border border-red-500/30 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Generation Failed</h2>
          <p className="text-gray-300 text-sm mb-6">{error}</p>
          <button
            onClick={fetchTestBlog}
            className="px-6 py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const metadata = blogData?.metadata || {};
  const bodyBlocks = blogData?.body || [];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pt-16 pb-32">
      {/* Dev Control Bar */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-lg shadow-lg border border-gray-700 transition"
        >
          {showDebug ? "Hide JSON" : "Show JSON Data"}
        </button>
        <button
          onClick={fetchTestBlog}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-lg shadow-lg transition"
        >
          Regenerate Blog
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        
        {/* Metadata Header */}
        <header className="mb-12 text-center">
          <span className="text-cyan-400 font-bold uppercase tracking-wider text-sm bg-cyan-500/10 px-3 py-1 rounded-full">
            {metadata.category || "Uncategorized"}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-6 mb-4">
            {metadata.title || "Untitled Blog"}
          </h1>
          <p className="text-gray-500 text-sm">
            By {metadata.author?.name || "Unknown"} • {metadata.publishDate} • {metadata.readTimeMinutes} min read
          </p>
        </header>

        {/* Featured Image Fallback */}
        {metadata.featuredImage?.url && (
          <div className="w-full aspect-video bg-gray-900 border border-gray-800 rounded-2xl mb-12 flex items-center justify-center overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={metadata.featuredImage.url} 
              alt={metadata.featuredImage.altText || "Featured"} 
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Rendered Body */}
        <article className="prose prose-invert max-w-none">
          {bodyBlocks.length > 0 ? (
            bodyBlocks.map((block: any, index: number) => renderBlock(block, index))
          ) : (
            <div className="p-8 border border-dashed border-red-500/50 bg-red-900/10 rounded-2xl text-center">
              <h3 className="text-red-400 font-bold text-xl mb-2">Warning: Body is empty</h3>
              <p className="text-gray-400 text-sm mb-4">
                The UI component is working, but the AI API returned zero blocks in the <code className="bg-black px-1 rounded">body</code> array.
              </p>
              <button onClick={() => setShowDebug(true)} className="text-cyan-400 underline text-sm">
                Open JSON Debugger to verify
              </button>
            </div>
          )}
        </article>

        {/* Raw Data Debugger Overlay */}
        {showDebug && (
          <div className="mt-16 p-6 bg-black border border-gray-800 rounded-2xl overflow-x-auto">
            <h3 className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest border-b border-gray-800 pb-2">
              Raw API Payload Response
            </h3>
            <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
              {JSON.stringify(blogData, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}