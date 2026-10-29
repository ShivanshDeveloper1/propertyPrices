import { Schema, model, models, Model } from "mongoose";

const localitySchema = new Schema(
  {
    name: { type: String, required: true },
    name1: { type: String, index: true },
    slug: { type: String, required: true, index: true },
    last_updated: { type: Date, default: Date.now },
    district: { type: String, index: true },
    tehsil: { type: String, index: true },
    residential_plot_govt: Number,
    residential_plot_market: Number,
  },
  { timestamps: true, strict: false },
);

localitySchema.index({ district: 1, last_updated: -1 });

// Exporting the model directly with typed Model to avoid union type errors
export const LocalityModel: Model<any> =
  (models.Locality as Model<any>) || model("Locality", localitySchema);
