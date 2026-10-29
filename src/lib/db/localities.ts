import { connectDB } from "@/lib/mongodb";
import { LocalityModel } from "@/models/Locality";

// Direct DB access for server components (avoids fetching our own API during render/build,
// which returned a false 404 whenever the API was unreachable).
export async function getLocalityBySlug(slug: string) {
  await connectDB();
  const doc = await LocalityModel.findOne({ slug }).lean();
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

export async function getAllLocalitySummaries() {
  await connectDB();
  const docs = await LocalityModel.find({})
    .select("name slug district tehsil sro_date last_updated")
    .lean();
  return JSON.parse(JSON.stringify(docs)) as Array<{
    name?: string;
    slug: string;
    district?: string;
    tehsil?: string;
    sro_date?: string;
    last_updated?: string;
  }>;
}

export async function getLocalitiesPage({
  page = 1,
  limit = 20,
  city = "Saharanpur",
}: {
  page?: number;
  limit?: number;
  city?: string;
} = {}) {
  await connectDB();

  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit));
  const skip = (safePage - 1) * safeLimit;

  const queryFilter: any = {};
  if (city === "Noida") {
    queryFilter.district = { $regex: /gautam buddha nagar|noida/i };
  } else if (city === "Saharanpur") {
    queryFilter.district = { $regex: /saharanpur/i };
  }

  const [rawLocalities, total] = await Promise.all([
    LocalityModel.find(queryFilter)
      .sort({ last_updated: -1, _id: -1 })
      .skip(skip)
      .limit(safeLimit)
      .select(
        "name name1 slug tehsil district residential_plot_govt residential_plot_market last_updated",
      )
      .lean(),
    LocalityModel.countDocuments(queryFilter),
  ]);

  const localities = rawLocalities.map((doc: any) => ({
    _id: doc._id?.toString() || "",
    slug: doc.slug || "",
    name: doc.name || "Unknown Locality",
    name1: doc.name1 || "",
    tehsil: doc.tehsil || "",
    district: doc.district || "",
    residential_plot_govt: doc.residential_plot_govt || 0,
    residential_plot_market: doc.residential_plot_market || 0,
    last_updated: doc.last_updated
      ? new Date(doc.last_updated).toISOString()
      : null,
  }));

  return {
    data: localities,
    pagination: {
      total,
      page: safePage,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}
