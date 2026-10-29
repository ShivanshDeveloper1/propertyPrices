import Blog from "@/models/Blog";
import { connectDB } from "./mongodb";

// Add to your existing lib/blogs file (connectDB and Blog are already imported there)
export async function getPublishedBlogCards({ limit = 8, skip = 0 } = {}) {
  await connectDB();

  const docs = await Blog.find({ isPublished: true })
    .select("title slug niche whyItMatters realWorldExample coverSvg imageUrl createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return docs.map((b: any) => {
    const words = `${b.whyItMatters || ""} ${b.realWorldExample || ""}`
      .split(/\s+/).filter(Boolean).length;
    return {
      slug: b.slug,
      title: b.title,
      niche: b.niche,
      imageUrl: b.imageUrl || "",
      coverSvg: b.coverSvg || "",
      publishDate: new Date(b.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      }),
      readTimeMinutes: Math.max(1, Math.ceil(words / 200)),
    };
  });
}