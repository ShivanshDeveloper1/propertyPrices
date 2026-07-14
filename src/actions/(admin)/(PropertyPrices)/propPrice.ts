"use server"
import { connectDB } from "@/lib/mongodb"
import { LocalityModel } from "@/models/Locality"



export async function searchLocalities(searchTerm){
    
        try {
            await connectDB()

          if (!searchTerm || searchTerm.trim() === "") {
  return [];
}

        // OPTIMIZATION 2: regex search, select only needed fields, lean, and limit
    const localities = await LocalityModel.find({
      name: { $regex: searchTerm, $options: "i" }, // "i" makes it case-insensitive
    })
      .select("_id name district tehsil residential_plot_govt residential_plot_market")
      .lean()
      .limit(10); // Prevent loading hundreds of records at once

   // Next.js client components need standard JSON. 
    // Mongoose ObjectIds must be converted to strings.
    return localities.map((loc) => ({
      ...loc,
      _id: loc._id.toString(),
    })); 
        } catch (error) {
            console.log(error)
            return[]
            
        }
    
}

export async function updateLocalityPrices(id, govtPrice, marketPrice) {
  try {
    await connectDB();
    
    await LocalityModel.findByIdAndUpdate(id, {
      residential_plot_govt: Number(govtPrice),
      residential_plot_market: Number(marketPrice),
      last_updated: Date.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false };
  }
}