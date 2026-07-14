"use server";
import { Properties } from "@/models/property/property";
import { connectDB } from "@/lib/mongodb";
import { cache } from "react";

// ⚡ OPTIMIZATION: Added an optional limit parameter (defaults to 0, which returns all if needed)
export async function getAllProperties(limit: number = 0) {
  try {
    await connectDB();

    let query = Properties.find({}).select(
      "title slug price locality city type images status bedrooms bathrooms area"
    ).sort({ createdAt: -1 });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const properties = await query.lean();

    return properties.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return [];
  }
}

export const getParticularData = cache(async (slug: string) => {
  try {
    await connectDB();
    const findProperty = await Properties.findOne({ slug }).lean();

    if (!findProperty) {
      console.log("No property found with slug:", slug);
      return null;
    }

    return {
      ...findProperty,
      _id: (findProperty as any)._id.toString(),
    };
  } catch (error) {
    console.error("Error fetching single property:", error);
    return null;
  }
});