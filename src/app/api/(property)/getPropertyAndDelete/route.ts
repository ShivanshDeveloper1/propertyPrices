// import { connectDB } from "@/lib/mongodb"
// import { Properties } from "@/models/property/property"
// import { NextResponse } from "next/server"



// export async function GET() {
//   try {
//     await connectDB();

//     const properties = await Properties.find({})
//       .select("title slug") // 👈 ONLY THESE FIELDS
//       .sort({ createdAt: -1 })
//       .lean();

//     return NextResponse.json(properties);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Error fetching properties" },
//       { status: 500 }
//     );
//   }
// }



// export async function 