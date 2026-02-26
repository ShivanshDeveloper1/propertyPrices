"use client";

import { useState, useMemo } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import LocalityCard from "@/components/home/LocalityCard";
import Fuse from "fuse.js";

export default function SearchableLocalities({
  localities,
}: {
  localities: any[];
}) {
  const [activeCity, setActiveCity] = useState("Saharanpur");
  const [searchTerm, setSearchTerm] = useState("");

  const safeLocalities = localities || [];

  // --- CITY MAPPING LOGIC ---
  // This ensures the "Noida" button finds "Gautam Buddha Nagar" data
  const cityFiltered = useMemo(() => {
    return safeLocalities.filter((loc) => {
      const district = loc.district?.toLowerCase() || "";

      if (activeCity === "Noida") {
        // Map "Noida" button to "Gautam Buddha Nagar" backend data
        return (
          district.includes("gautam buddha nagar") || district.includes("noida")
        );
      }

      // Default: Match button name to district (Works for Saharanpur and future cities)
      return district.includes(activeCity.toLowerCase());
    });
  }, [safeLocalities, activeCity]);

  const fuse = useMemo(() => {
    return new Fuse(cityFiltered, {
      keys: ["name", "tehsil", "district"],
      threshold: 0.4,
    });
  }, [cityFiltered]);

  const filteredLocalities = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : cityFiltered;

  return (
    <>
      <div className="relative max-w-lg mx-auto mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder={`Search areas or sectors in ${activeCity}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-14 text-lg bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 mb-10">
        {["Saharanpur", "Noida"].map((city) => (
          <button
            key={city}
            onClick={() => {
              setActiveCity(city);
              setSearchTerm("");
            }}
            className={`px-8 py-2 rounded-full text-sm font-bold border-2 transition-all ${
              activeCity === city
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Stats Bar and Results Grid below remain same as your clean design */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Localities in {activeCity}
          </h2>
        </div>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {filteredLocalities.length} Results
        </span>
      </div>

      {filteredLocalities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocalities.map((locality) => (
            <LocalityCard key={locality.slug} locality={locality} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl font-medium text-gray-500">
          No results for "{searchTerm}" in {activeCity}
        </div>
      )}
    </>
  );
}
