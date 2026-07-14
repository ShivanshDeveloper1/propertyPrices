import mongoose, { Schema, model, models } from "mongoose";
import { connectDB } from "@/lib/mongodb"; // Adjust path if your mongodb.ts is somewhere else!

// 1. Schema Definition
const blogSchema = new Schema(
  {
    // Changed 'post' to 'blog' to perfectly match your frontend fetch target
    blog: {
      metadata: {
        slug: { type: String, required: true, index: true, unique: true },
        title: { type: String, required: true },
        category: String,
        tags: { type: [String], default: [] },
        publishDate: String,
        readTimeMinutes: Number,
        featuredImage: {
          url: String,
          altText: String,
        },
        summary: String,
        author: {
          name: { type: String, default: "Shivansh" },
          url: { type: String, default: "https://www.saharanpurprice.in/about" },
        },
      },
      body: { type: Array, default: [] }, // Retains nested layouts safely
    },
  },
  { timestamps: true, strict: false },
);

const BlogModel = models.Blog || model("Blog", blogSchema);

// Here how my blog is workign and going to work okay in this eapplication
// UI → API Route → Blog Service → MongoDB    This eis the weay
export class Blog {
  static async save(blogData: any) {
    await connectDB();
    if (Array.isArray(blogData)) {
      await BlogModel.insertMany(blogData);
    } else {
      await BlogModel.create(blogData);
    }
    return { success: true };
  }

  static async list(limit = 8, skip = 0) {
    await connectDB();
    const results = await BlogModel.find({})
      .sort({ "blog.metadata.publishDate": -1 }) // updated target
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return results.map(serializeDoc);
  }

  static async getBySlug(slug: string) {
    await connectDB();
    const result = await BlogModel.findOne({
      "blog.metadata.slug": slug, // updated target
    })
      .lean()
      .exec();

    if (!result) return null;
    return serializeDoc(result);
  }

  static async deleteBySlug(slug: string) {
    await connectDB();
    return await BlogModel.findOneAndDelete({
      "blog.metadata.slug": slug, // updated target
    });
  }
}

function serializeDoc(doc: any) {
  return {
    ...doc,
    _id: doc._id.toString(),
    slug: doc.blog?.metadata?.slug || null, // updated serialization
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}