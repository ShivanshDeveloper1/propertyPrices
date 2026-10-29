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
    .select("slug district tehsil sro_date last_updated")
    .lean();
  return JSON.parse(JSON.stringify(docs)) as Array<{
    slug: string;
    district?: string;
    tehsil?: string;
    sro_date?: string;
    last_updated?: string;
  }>;
}
