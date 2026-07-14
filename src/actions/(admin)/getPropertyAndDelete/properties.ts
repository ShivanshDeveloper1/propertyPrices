"use server";
import { Properties } from "@/models/property/property";
import { connectDB } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

// ... keep your existing getAllProperties code ...



export async function getAllProperties() {
  try {
    await connectDB();

    // Fetch from MongoDB
    const properties = await Properties.find({}).sort({ createdAt: -1 });

    // ✅ Convert Mongoose documents to plain JS objects (fixes Next.js hydration issues)
    return JSON.parse(JSON.stringify(properties));
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array on error so the page doesn't crash
  }
}






export async function deleteProperty(id: string) {
  try {
    await connectDB();
    
    const deleted = await Properties.findByIdAndDelete(id);
    
    if (!deleted) {
      return { success: false, message: "Property not found" };
    }

    // This refreshes the page data without a manual reload
    revalidatePath("/admin/properties"); 
    
    return { success: true, message: "Property deleted successfully" };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Failed to delete property" };
  }
}