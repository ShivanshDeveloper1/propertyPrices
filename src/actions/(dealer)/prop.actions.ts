"use server";
import { connectDB } from "@/lib/mongodb";
import { Properties } from "@/models/property/property";
import { z } from "zod";
import { uploadCloudinary } from "@/lib/cloudinary/cloudinary";
import { revalidatePath } from "next/cache";

// Helpers to handle empty spaces or completely missing data robustly
const parseOptionalNumber = (val) => {
  if (!val || String(val).trim() === "") return undefined;
  return Number(val);
};

const parseOptionalString = (val) => {
  if (!val || String(val).trim() === "") return undefined;
  return String(val);
};

const propertySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dealerId: z.string().optional(),
  title: z.string().min(3, "Title is too short"),
  address: z.string().min(5, "Address must be more detailed"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  city: z.string().min(2, "City is required"),

  price: z.coerce.number().positive("Price must be greater than 0"),
  type: z.enum(["for sale", "for rent"]),
  area: z.coerce.number().positive("Area must be greater than 0"),
  
  // Bulletproof optional fields
  bedrooms: z.preprocess(parseOptionalNumber, z.number().optional()),
  bathrooms: z.preprocess(parseOptionalNumber, z.number().optional()),
  builtYear: z.preprocess(parseOptionalNumber, z.number().optional()),
  description: z.preprocess(parseOptionalString, z.string().optional()),
  front: z.preprocess(parseOptionalString, z.string().optional()),
  frontRoadWidth: z.preprocess(parseOptionalString, z.string().optional()),

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

    const rawData = Object.fromEntries(formData.entries());
    const amenities = formData.getAll("amenities");

    const validatedData = propertySchema.safeParse({
      ...rawData,
      amenities,
      images: uploadedImageUrls,
    });

    if (!validatedData.success) {
      // Return the exact field errors to the frontend
      return { status: 400, errors: validatedData.error.flatten().fieldErrors };
    }

    const property = await Properties.create(validatedData.data);

    revalidatePath('/properties');

    return {
      status: 201,
      data: JSON.parse(JSON.stringify(property)),
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { status: 500, message: error.message || "Internal Server Error" };
  }
}