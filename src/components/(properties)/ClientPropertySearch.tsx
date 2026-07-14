// src/app/properties/ClientPropertySearch.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Properties from "@/components/(properties)/Properties";
import { useState, useEffect } from "react";

// Accept both properties and services passed from the Server Component
export default function ClientPropertySearch({ 
  initialProperties, 
  initialServices = [] 
}: { 
  initialProperties: any[];
  initialServices?: any[];
}) {
  const [searchValue, setSearchValue] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  const [selectedType, setSelectedType] = useState("Types");
  const [selectedPrice, setSelectedPrice] = useState("Price");
  const [selectedLocation, setSelectedLocation] = useState("Location");

  const typeOptions = ["For Sale", "For Rent"];
  const priceOptions = ["₹10L - ₹20L", "₹20L - ₹50L", "₹50L+"];
  const locationOptions = ["Noida", "Saharanpur"];

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 relative bg-slate-50/50">
      {/* Hero Section */}
      <section className="md:max-w-6xl w-full px-4 mx-auto bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl h-[65vh] sm:h-[80vh] flex items-center justify-center flex-col space-y-6 md:space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        <span className="z-10 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full px-6 py-1.5 text-xs sm:text-sm font-medium tracking-wide">
          Premium Properties
        </span>
        <div className="z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
            Find the right home in <br />
            <span className="font-black uppercase bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-200 to-green-400">
              Saharanpur
            </span>
          </h1>
        </div>
        <Link
          href="/#"
          className="z-10 bg-white text-blue-700 font-bold py-3.5 px-8 md:px-12 rounded-xl shadow-xl hover:bg-blue-50 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95"
        >
          Book Now
        </Link>
      </section>

      {/* Search Bar Section */}
      <section className="px-2 sm:px-4">
        <div className="relative rounded-2xl flex flex-col md:flex-row max-w-4xl mx-auto gap-3 md:gap-4 -mt-12 md:-mt-8 bg-white z-40 py-5 px-5 md:py-4 md:px-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] items-center border border-slate-100">
          <div className="flex flex-col sm:flex-row w-full gap-3 md:w-auto">
            {/* Type Dropdown */}
            <div className="relative w-full md:w-40">
              <div
                onClick={() => toggleDropdown("type")}
                className="cursor-pointer px-4 py-3 md:py-2.5 bg-slate-50 rounded-xl flex justify-between items-center hover:bg-slate-100 transition border border-slate-200/60"
              >
                <span className="text-slate-700 text-sm md:text-base font-medium">
                  {selectedType}
                </span>
                <span className={`text-[10px] text-slate-400 transition-transform ${openDropdown === "type" ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </div>
              <AnimatePresence>
                {openDropdown === "type" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden z-[60] border border-slate-100"
                  >
                    {typeOptions.map((item) => (
                      <div
                        key={item}
                        onClick={() => {
                          setSelectedType(item);
                          setOpenDropdown(null);
                        }}
                        className="px-4 py-3 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition text-sm font-medium"
                      >
                        {item}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price Dropdown */}
            <div className="relative w-full md:w-40">
              <div
                onClick={() => toggleDropdown("price")}
                className="cursor-pointer px-4 py-3 md:py-2.5 bg-slate-50 rounded-xl flex justify-between items-center hover:bg-slate-100 transition border border-slate-200/60"
              >
                <span className="text-slate-700 text-sm md:text-base font-medium">
                  {selectedPrice}
                </span>
                <span className={`text-[10px] text-slate-400 transition-transform ${openDropdown === "price" ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </div>
              <AnimatePresence>
                {openDropdown === "price" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden z-[60] border border-slate-100"
                  >
                    {priceOptions.map((item) => (
                      <div
                        key={item}
                        onClick={() => {
                          setSelectedPrice(item);
                          setOpenDropdown(null);
                        }}
                        className="px-4 py-3 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition text-sm font-medium"
                      >
                        {item}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Location Dropdown */}
            <div className="relative w-full md:w-40">
              <div
                onClick={() => toggleDropdown("location")}
                className="cursor-pointer px-4 py-3 md:py-2.5 bg-slate-50 rounded-xl flex justify-between items-center hover:bg-slate-100 transition border border-slate-200/60"
              >
                <span className="text-slate-700 text-sm md:text-base font-medium">
                  {selectedLocation}
                </span>
                <span className={`text-[10px] text-slate-400 transition-transform ${openDropdown === "location" ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </div>
              <AnimatePresence>
                {openDropdown === "location" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden z-[60] border border-slate-100"
                  >
                    {locationOptions.map((item) => (
                      <div
                        key={item}
                        onClick={() => {
                          setSelectedLocation(item);
                          setOpenDropdown(null);
                        }}
                        className="px-4 py-3 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition text-sm font-medium"
                      >
                        {item}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full flex-1">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by locality..."
              className="w-full px-4 py-3 pr-16 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm md:text-base"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              Go
            </button>
          </div>
        </div>
      </section>

      {/* Passing DB Data to Component */}
      <div className="mt-8">
        <Properties
          dbData={initialProperties}
          values={{
            selectedType,
            selectedPrice,
            selectedLocation,
            searchValue: debouncedSearch,
          }}
        />
      </div>

      {/* NEW: Services Display Section */}
      {initialServices && initialServices.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16 mt-8 border-t border-slate-200/60">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Verified Dealer Services
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              Partner with local experts to maximize your real estate investments. From financing to construction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialServices.map((serviceGroup: any, idx: number) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_4px_25px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                {serviceGroup.imageUrl && (
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                    <img 
                      src={serviceGroup.imageUrl} 
                      alt="Service category" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  {serviceGroup.services?.map((svc: any, sIdx: number) => (
                    <div key={sIdx} className="mb-4 last:mb-0">
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{svc.service}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{svc.details}</p>
                    </div>
                  ))}
                  <button className="mt-4 w-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                    Contact Provider
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}