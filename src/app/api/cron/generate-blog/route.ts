import { NextResponse } from "next/server";
import { blogGraph } from "@/lib/bloggraph/graph";
import { connectDB } from "@/lib/mongodb"
import Blog from "@/models/Blog";

// Automatic Generation ke liye target niches
const TARGET_NICHES = [
   "Saharanpur Real Estate Market",
  "Property Investment in Saharanpur",
  "Residential Property in Saharanpur",
  "Best Areas to Buy Property in Saharanpur",
  "Saharanpur Property Prices",
  "Real Estate Growth in Saharanpur",
  "Land Investment in Saharanpur",
  "House Buying in Saharanpur",
  "Commercial Property in Saharanpur",
  "Property Investment Opportunities in Saharanpur",
];

// Slug generator helper
function createSlug(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now()}`
  );
}

// ------------------------------------------------------------------
// GET: Cron Job trigger (Automatically runs every 24 hours)
// ------------------------------------------------------------------
export async function GET(req) {
  try {
    // 1. Cron Secret Authorization Security
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectDB();

    // 2. Select a Random Topic / Niche
    const randomTopic = TARGET_NICHES[Math.floor(Math.random() * TARGET_NICHES.length)];

    console.log("🚀 Starting LangGraph Cron Workflow...");
    console.log("Topic:", randomTopic);

    // 3. Run YOUR exact LangGraph Workflow
    const result = await blogGraph.invoke({ topic: randomTopic });
    console.log("🎉 LangGraph Workflow completed successfully");

    const blogData = result.blog || {};
    const slug = createSlug(blogData.title || randomTopic);

    // 4. Save directly into MongoDB
    const newBlog = await Blog.create({
      title: blogData.title,
      slug,
      niche: randomTopic,
      whyItMatters: blogData.whyItMatters,
      comparison: blogData.comparison,
      consequences: blogData.consequences,
      realWorldExample: blogData.realWorldExample,
      callToAction: blogData.callToAction,
      imageUrl: blogData.imageUrl || null,
      coverSvg: result.coverSvg || null, // Satori SVG generated cover
      isPublished: true,
    });

    return NextResponse.json({
      success: true,
      message: "Blog generated via LangGraph & published to MongoDB successfully!",
      blogId: newBlog._id,
      slug: newBlog.slug,
      title: newBlog.title,
    });
  } catch (error) {
    console.error("❌ Cron Workflow Error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog", details: error.message },
      { status: 500 }
    );
  }
}

// ------------------------------------------------------------------
// POST: Manual Trigger (Testing or API Call)
// ------------------------------------------------------------------
export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Blog topic is required" }, { status: 400 });
    }

    await connectDB();

    console.log("🚀 Starting manual LangGraph workflow for topic:", prompt);
    const result = await blogGraph.invoke({ topic: prompt });

    const blogData = result.blog || {};
    const slug = createSlug(blogData.title || prompt);

    const newBlog = await Blog.create({
      title: blogData.title,
      slug,
      niche: prompt,
      whyItMatters: blogData.whyItMatters,
      comparison: blogData.comparison,
      consequences: blogData.consequences,
      realWorldExample: blogData.realWorldExample,
      callToAction: blogData.callToAction,
      imageUrl: blogData.imageUrl || null,
      coverSvg: result.coverSvg || null,
      isPublished: true,
    });

    return NextResponse.json({
      success: true,
      blog: newBlog,
    });
  } catch (error) {
    console.error("❌ Manual Workflow Error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog", details: error.message },
      { status: 500 }
    );
  }
}