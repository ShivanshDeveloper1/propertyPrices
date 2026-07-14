// "use server";
// import { Properties } from "@/models/property/property";
// import { connectDB } from "../mongodb";

// // ✅ Required for Next.js Server Actions

// // Make sure your imports for connectDB and Properties model are here

// export async function getAllProperties() {
//   try {
//     await connectDB();

//     // Fetch from MongoDB
//     const properties = await Properties.find({}).sort({ createdAt: -1 });

//     // ✅ Convert Mongoose documents to plain JS objects (fixes Next.js hydration issues)
//     return JSON.parse(JSON.stringify(properties));
//   } catch (error) {
//     console.error("Failed to fetch properties:", error);
//     return []; // Return an empty array on error so the page doesn't crash
//   }
// }
