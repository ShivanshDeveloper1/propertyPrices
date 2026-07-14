import { Schema, model, models } from "mongoose";

const localitySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    last_updated: { type: Date, default: Date.now },
    district: String,
    tehsil: String,
    residential_plot_govt: Number,
    residential_plot_market: Number,
  },
  { timestamps: true, strict: false },
);

// Exporting the model directly
export const LocalityModel =
  models.Locality || model("Locality", localitySchema);
