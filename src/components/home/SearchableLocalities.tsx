"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
// Removed useRouter because we no longer need to change the URL to swap cities
import { Input } from "@/components/ui/Input";
import LocalityCard from "@/components/home/LocalityCard";

export default function SearchableLocalities({
  localities,
}: {
  localities: any[];
}) {
  // Hardcoded to Saharanpur
  const activeCity = "Saharanpur";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle Search Fetching
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/localities?search=${encodeURIComponent(debouncedSearchTerm)}&city=${activeCity}&limit=50`,
        );
        const json = await res.json();
        setSearchResults(json.data || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchResults();
  }, [debouncedSearchTerm]); // removed activeCity from dependency array since it never changes

  const displayLocalities = useMemo(() => {
    return debouncedSearchTerm ? searchResults : localities;
  }, [debouncedSearchTerm, searchResults, localities]);

  return (
    <>
      <div className="relative max-w-lg mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder={`Search in ${activeCity}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-14 text-lg bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
        )}
      </div>

      {/* THE NOIDA/SAHARANPUR TOGGLE BUTTONS HAVE BEEN COMPLETELY REMOVED */}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {debouncedSearchTerm
              ? `Results in ${activeCity}`
              : `Localities in ${activeCity}`}
          </h2>
        </div>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {displayLocalities.length} Results
        </span>
      </div>

      {displayLocalities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayLocalities.map((locality) => (
            <LocalityCard key={locality.slug} locality={locality} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl text-gray-500">
          {isSearching ? "Searching..." : `No results in ${activeCity}`}
        </div>
      )}
    </>
  );
}