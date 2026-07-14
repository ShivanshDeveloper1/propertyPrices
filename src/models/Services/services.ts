// @/models/Service.js
import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      required: true 
    },
    imageUrl: { 
      type: String, 
      required: true 
    },
    services: [
      {
        service: { type: String, required: true },
        details: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);