import { NextResponse } from "next/server";
import { Blog } from "@/models/Blog";
import { connectDB } from "@/lib/mongodb"; // ✅ ADD

export async function POST(request: Request) {
  try {
    await connectDB(); // ✅ ADD

    const data = await request.json();

    if (!data) {
      return NextResponse.json(
        { message: "No blog data provided" },
        { status: 400 },
      );
    }

    await Blog.save(data);

    return NextResponse.json(
      { message: "Blogs saved successfully" },
      { status: 201 },
    );
  } catch (error) {
    // console.error("Error saving blogs:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit")) || 8;
  const skip = Number(searchParams.get("skip")) || 0;

  const blogs = await Blog.list(limit, skip);

  return NextResponse.json(blogs);
}

export async function DELETE(req) {
  try {
    await connectDB();

    const { slug } = await req.json();

    const deletedPost = await Blog.deleteBySlug(slug);

    if (!deletedPost) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    // console.log(error);

    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
