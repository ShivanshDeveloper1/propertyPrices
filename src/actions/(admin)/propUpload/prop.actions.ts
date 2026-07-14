"use server";
import { connectDB } from "@/lib/mongodb";
import { Properties } from "@/models/property/property";
import { z } from "zod";
import { uploadCloudinary } from "@/lib/cloudinary/cloudinary";

const propertySchema = z.object({
  name: z.string().min(2),
  title: z.string().min(3),
  address: z.string().min(5),
  city: z.string().min(2),
  locality: z.string().min(2),
  price: z.coerce.number().positive(),
  type: z.enum(["for sale", "for rent"]),
  area: z.coerce.number().positive(),
  status: z.enum(["available", "sold", "offmarket"]),
  
  // Cleanly handle empty strings by converting them to undefined
  // Mongoose will ignore 'undefined' fields and not save them
  bedrooms: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  bathrooms: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  builtYear: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  description: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  front: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),
  frontRoadWidth: z.preprocess((val) => (val === "" ? undefined : val), z.string().optional()),

  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export default async function PropUpload(formData) {
  try {
    await connectDB();

    const files = formData.getAll("images");
    const uploadedImageUrls = [];

    for (const file of files) {
      if (file && typeof file === "object" && file.size > 0) {
        const url = await uploadCloudinary(file);
        if (url) uploadedImageUrls.push(url);
      }
    }

    // Convert FormData to a plain object
    const rawData = Object.fromEntries(formData.entries());
    const amenities = formData.getAll("amenities");

    const validatedData = propertySchema.safeParse({
      ...rawData,
      amenities,
      images: uploadedImageUrls,
    });

    if (!validatedData.success) {
      return { status: 400, errors: validatedData.error.flatten().fieldErrors };
    }

    // validatedData.data now contains 'undefined' for empty fields
    // Mongoose will not try to validate 'undefined' fields if they aren't required
    const property = await Properties.create(validatedData.data);

    return {
      status: 201,
      data: JSON.parse(JSON.stringify(property)),
    };
  } catch (error) {
    console.error("Upload Error:", error); // This helps you see Mongoose errors
    return { status: 500, message: error.message || "Internal Server Error" };
  }
}