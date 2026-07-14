import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { LocalityModel } from "@/models/Locality";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // console.log("--- 🏁 API START ---");

    await connectDB();
    // console.log("✅ MongoDB Connected");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const city = searchParams.get("city") || "";
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // console.log(`🔎 Params: page=${page}, city=${city}, search=${search}`);

    let queryFilter: any = {};

    if (city === "Noida") {
      queryFilter.district = { $regex: /gautam buddha nagar|noida/i };
    } else if (city === "Saharanpur") {
      queryFilter.district = { $regex: /saharanpur/i };
    }

    if (search) {
      queryFilter.$or = [
        { name: { $regex: search, $options: "i" } },
        { tehsil: { $regex: search, $options: "i" } },
      ];
    }

    // console.log(
    //   "📡 Querying Database with filter:",
    //   JSON.stringify(queryFilter),
    // );

    // Execute query
    const [rawLocalities, total] = await Promise.all([
      LocalityModel.find(queryFilter)
        .sort({ last_updated: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LocalityModel.countDocuments(queryFilter),
    ]);

    // console.log(
    //   `📊 Found ${rawLocalities.length} documents. Total in DB: ${total}`,
    // );

    // Serialize
    const localities = rawLocalities
      .map((doc: any) => {
        try {
          return {
            _id: doc._id?.toString() || "",
            slug: doc.slug || "",
            name: doc.name || "Unknown Locality",
            tehsil: doc.tehsil || "",
            district: doc.district || "",
            residential_plot_govt: doc.residential_plot_govt || 0,
            residential_plot_market: doc.residential_plot_market || 0,
            last_updated: doc.last_updated
              ? new Date(doc.last_updated).toISOString()
              : null,
          };
        } catch (err) {
          // console.error("❌ Mapping error for doc:", doc._id);
          return null;
        }
      })
      .filter(Boolean);

    // console.log("✅ Serialization Complete. Sending Response.");

    return NextResponse.json({
      data: localities,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    // THIS IS THE IMPORTANT LOG
    // console.error("🔥 CRITICAL API ERROR:", error.message);
    // console.error(error.stack);
    return NextResponse.json(
      { message: error.message || "Internal Error" },
      { status: 500 },
    );
  }
}
