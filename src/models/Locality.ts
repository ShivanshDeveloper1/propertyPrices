import { Schema, model, models, Model } from "mongoose";

const localitySchema = new Schema(
  {
    name: { type: String, required: true },
    name1: { type: String, index: true },
    slug: { type: String, required: true, index: true },
    last_updated: { type: Date, default: Date.now },
    district: String,
    tehsil: String,
    residential_plot_govt: Number,
    residential_plot_market: Number,
  },
  { timestamps: true, strict: false },
);

// Exporting the model directly with typed Model to avoid union type errors
export const LocalityModel: Model<any> =
  (models.Locality as Model<any>) || model("Locality", localitySchema);
