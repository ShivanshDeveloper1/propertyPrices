import { NextResponse } from "next/server";
import { LocalityModel } from "@/models/Locality"; // Ensure this matches the schema export
import { connectDB } from "@/lib/mongodb";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();

    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug parameter is required" },
        { status: 400 },
      );
    }

    // ❌ WRONG: await Locality.filter({ slug });
    // ✅ CORRECT: Use LocalityModel (the imported name) and .find() or .findOne()
    const localities = await LocalityModel.find({ slug }).lean();

    if (!localities || localities.length === 0) {
      return NextResponse.json(
        { message: `Locality with slug '${slug}' not found` },
        { status: 404 },
      );
    }

    // Returning the first match
    return NextResponse.json(localities[0], {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error: any) {
    console.error("API Error fetching locality:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
