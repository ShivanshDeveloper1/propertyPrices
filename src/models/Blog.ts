// models/Blog.js

import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    niche: { type: String, required: true },
    whyItMatters: { type: String, required: true },
    comparison: [
      {
        factor: String,
        withInvestment: String,
        withoutInvestment: String,
      },
    ],
    consequences: [String],
    realWorldExample: { type: String, required: true },
    callToAction: { type: String, required: true },
    imageUrl: { type: String },
    coverSvg: { type: String },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Blog =
  mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;