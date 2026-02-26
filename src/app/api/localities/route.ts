import { NextResponse } from "next/server";
import { Locality } from "@/entities/Locality";
import { connectDB } from "@/lib/mongodb"; // ✅ ADD THIS

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectDB(); // ✅ ADD THIS ONLY

    const { searchParams } = new URL(request.url);
    const orderBy = searchParams.get("orderBy");

    const localities = await Locality.list(orderBy || undefined);

    const liteLocalities = localities.map((loc: any) => ({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      district: loc.district,
      zones: loc.zones,
      last_updated: loc.last_updated,
      residential_plot_govt: loc.residential_plot_govt,
      residential_plot_market: loc.residential_plot_market,
      commercial_shop_local_govt: loc.commercial_shop_local_govt,
      commercial_shop_local_market: loc.commercial_shop_local_market,
    }));

    return NextResponse.json(liteLocalities, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
        "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
        "Vercel-CDN-Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("API Error fetching localities:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}