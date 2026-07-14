// src/app/(dealer)/dealer/[slug]/page.tsx
import { connectDB } from "@/lib/mongodb";
import { Dealers } from "@/models/Dealer/dealer";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Properties } from "@/models/property/property";
import DealIndividualProp from "@/components/(dealer)/DealIndividualProp";

// 1. Expect 'slug' instead of 'id' in params
export default async function SingleAgentPage({ params }: { params: Promise<{ slug: string }> }) {
  await connectDB();

  // 2. Destructure 'slug' from the awaited params
  const { slug } = await params;

  // 3. Search the database by the slug field, not the ID
  const dealer = await Dealers.findOne({ slug: slug }).lean();

  if (!dealer) {
    notFound();
  }

  // 4. Use the dealer's _id to find their properties (since Properties schema likely uses the ObjectId)
  const properties = await Properties.find({ dealerId: dealer._id }).lean();

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Section: Agent Info */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-50">
                <Image 
                  src={dealer.image || "/placeholder-user.jpg"} 
                  alt={dealer.name} 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
            </div>

            <div className="flex-1">
              <span className="px-3 py-1 mb-3 inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 rounded-full">
                Verified Professional Agent
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-2">{dealer.name}</h1>
              <p className="text-gray-500 font-medium mb-6 text-lg">{dealer.city} • {dealer.area}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
                 <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-bold">Email Address</p>
                    <p className="text-gray-900 font-medium">{dealer.email}</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-bold">Phone Number</p>
                    <p className="text-gray-900 font-medium">{dealer.phone}</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About the Expert</h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {dealer.bio || `${dealer.name} is a dedicated real estate professional specializing in the ${dealer.city} market.`}
            </p>
          </div>
        </div>

        {/* Property Section */}
        <div className="max-w-6xl mx-auto">
          <DealIndividualProp properties={properties} />
        </div>

      </div>
    </main>
  );
}