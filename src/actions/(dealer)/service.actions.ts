// @/actions/(dealer)/service.actions.js
"use server";

import { uploadCloudinary } from "@/lib/cloudinary/cloudinary";
import { connectDB } from "@/lib/mongodb";
import services from "@/models/Services/services";


export default async function ServiceUpload(formData) {
  try {
    await connectDB();

    const file = formData.get("image");
    const servicesJson = formData.get("services");
    const userId = formData.get("userId");

    if (!userId) {
      return { success: false, error: "Authentication required." };
    }

    // Handle single image file upload
    let imageUrl = "";
    if (file && typeof file === "object" && file.size > 0) {
      imageUrl = await uploadCloudinary(file);
    }

    if (!imageUrl) {
      return { success: false, error: "Image upload failed or image missing." };
    }

    // Parse the stringified services array back to a real array
    const parsedServices = JSON.parse(servicesJson || "[]");

    // Save to MongoDB
    const newServiceListing = await services.create({
      userId,
      imageUrl,
      services: parsedServices,
    });

    return {
      success: true,
      message: "Services registered successfully!",
      data: JSON.parse(JSON.stringify(newServiceListing)),
    };
  } catch (error) {
    console.error("Database Save Error:", error);
    return { success: false, error: error.message || "Internal server error" };
  }
}