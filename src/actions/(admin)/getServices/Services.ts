// @/actions/(dealer)/service.actions.js
"use server";

import { connectDB } from "@/lib/mongodb";
import services from "@/models/Services/services";


// ... your existing ServiceUpload function ...

export async function getAllServices() {
  try {
    await connectDB();

    // Fetch all services from the database and sort by newest first.
    // .lean() strips the heavy Mongoose methods, returning pure Javascript objects.
    const allServices = await services.find({}).sort({ createdAt: -1 }).lean();

    // We stringify and parse the data to guarantee there are no hidden 
    // MongoDB ObjectIds or Date objects that Next.js Client Components can't handle.
    return JSON.parse(JSON.stringify(allServices));

  } catch (error) {
    console.error("Failed to fetch services:", error);
    // Return an empty array so your frontend doesn't crash if the database fails
    return []; 
  }
}