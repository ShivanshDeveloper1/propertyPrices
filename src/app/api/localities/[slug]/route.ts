import { NextResponse } from "next/server";
import { Locality } from "@/entities/Locality";
import { connectDB } from "@/lib/mongodb"; // ✅ ADD THIS

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB(); // ✅ ADD THIS ONLY

    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const localities = await Locality.filter({ slug });

    if (!localities || localities.length === 0) {
      return NextResponse.json(
        { message: `Locality with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(localities[0], {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
        "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
        "Vercel-CDN-Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("API Error fetching locality:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}