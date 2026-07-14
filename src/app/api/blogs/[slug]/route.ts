import { NextResponse } from "next/server";
import { Blog } from "@/models/Blog";
import { connectDB } from "@/lib/mongodb"; // ✅ ADD

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB(); // ✅ ADD

    const { slug } = await context.params;

    const blog = await Blog.getBySlug(slug);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
        "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
        "Vercel-CDN-Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}