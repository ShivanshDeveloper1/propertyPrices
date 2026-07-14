import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getAllProperties } from '@/actions/(admin)/getPropertie/properties'; 
import Image from "next/image";
import { FaLocationDot, FaBath, FaBed, FaRulerCombined } from "react-icons/fa6";

async function getLocalities() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/localities?limit=12`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function RelatedLocalities({ currentSlug, currentCity }) {
  // Fetch data concurrently using Promise.all for faster load times
  // We pass a limit of 10 to our updated action to save resource consumption
  const [allLocalities, allProperties] = await Promise.all([
    getLocalities(),
    getAllProperties(10) 
  ]);

  // 1. Get 1 related locality (excluding the active page)
  const displayLocalities = allLocalities
    .filter((loc) => loc.slug !== currentSlug)
    .slice(0, 1);

  // 2. Get 2 related properties matching the region context
  const targetCity = currentCity?.toLowerCase() || "saharanpur";
  const filteredProperties = allProperties?.filter(prop => 
    prop.city?.toLowerCase() === targetCity || prop.locality?.toLowerCase() === targetCity
  ) || [];

  // Fallback: If no local context properties found, just grab the latest 2 properties
  const displayProperties = filteredProperties.length >= 2 
    ? filteredProperties.slice(0, 2) 
    : (allProperties?.slice(0, 2) || []);

  return (
    <section className="py-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* RENDER PROPERTIES FIRST (2 CARDS) */}
          {displayProperties.map((prop) => (
            <Link
              href={`/properties/${prop.slug}`}
              key={prop._id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full p-2">
                  <Image
                    src={prop.images?.[0]?.startsWith("http") ? prop.images[0] : `/${prop.images?.[0] || 'placeholder.jpg'}`}
                    alt={`Property for sale in ${prop.city}: ${prop.title}`}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover rounded-xl group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white text-[9px] uppercase font-bold tracking-wider rounded-md px-2 py-0.5 shadow-sm">
                      Featured {prop.type}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 text-gray-400 text-[11px] mb-1">
                    <FaLocationDot className="text-blue-500 shrink-0" />
                    <span className="truncate">{prop.locality || prop.city}, Saharanpur</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-blue-600 font-extrabold text-base mt-0.5">
                    ₹{(prop.price / 100000).toFixed(1)} Lakh
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex items-center justify-between text-gray-500 text-[10px] pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-1"><FaBed/> {prop.bedrooms || 0} BHK</span>
                  <span className="flex items-center gap-1"><FaBath/> {prop.bathrooms || 0} Bath</span>
                  <span className="flex items-center gap-1"><FaRulerCombined/> {prop.area} Sq-Ft</span>
                </div>
              </div>
            </Link>
          ))}

          {/* RENDER RELATED LOCALITY DATA LAST (1 CARD) */}
          {displayLocalities.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locality/${loc.slug}`}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 rounded-full group-hover:scale-120 transition-transform duration-500" />

              <div className="relative z-10 flex flex-col items-start">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-blue-100">
                  <MapPin className="text-white w-5 h-5" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {loc.name}
                  </h3>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {loc.tehsil || "Saharanpur"} Region
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed pt-1">
                    Check official government circle rates, land registration costs, and market trends for plots in {loc.name}.
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                  <Calendar size={12} className="text-blue-400" />
                  <span>Updated {loc.last_updated ? format(new Date(loc.last_updated), "MMM yyyy") : '2026'}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 font-bold text-xs">
                  <span>View Rates</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}