import mongoose, { Schema, model, models } from "mongoose";
import { connectDB } from "@/lib/mongodb"; // Adjust path if needed!

// 1. Define Schema
const localitySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    last_updated: { type: Date, default: Date.now },
    district: String,
    residential_plot_govt: Number,
    residential_plot_market: Number,
  },
  { timestamps: true, strict: false }
);

// 2. Singleton Model
const LocalityModel = models.Locality || model("Locality", localitySchema);

// 3. The Class
export class Locality {
  static async list(orderBy?: string) {
    await connectDB();

    // .lean() makes it return plain JSON objects (much faster for SEO/Reading)
    let query = LocalityModel.find({}).lean();

    if (orderBy === "-updated_date") {
      query = query.sort({ last_updated: -1 });
    }

    const results = await query.exec();

    // Transform _id to string to match your old code's output
    return results.map(serializeDoc);
  }

  static async filter(query: { slug?: string }) {
    await connectDB();
    const results = await LocalityModel.find(query).lean().exec();
    return results.map(serializeDoc);
  }
}

// Helper to ensure data format stays consistent for your frontend
function serializeDoc(doc: any) {
  return {
    ...doc,
    _id: doc._id.toString(),
    last_updated: doc.last_updated
      ? new Date(doc.last_updated).toISOString()
      : null,
  };
}