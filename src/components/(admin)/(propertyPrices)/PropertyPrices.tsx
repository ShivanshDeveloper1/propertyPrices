"use client";

import React, { useState, useEffect } from "react";
import { searchLocalities, updateLocalityPrices } from "@/actions/(admin)/(PropertyPrices)/propPrice";

const PropertyPrices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // DEBOUNCING LOGIC: This is the secret to low server load
  useEffect(() => {
    // Start a timer when the user types
    const delayDebounceFn = setTimeout(async () => {
      // Only search if they typed at least 3 characters
      if (searchTerm.length >= 3) {
        setIsLoading(true);
        const data = await searchLocalities(searchTerm);
        setResults(data);
        setIsLoading(false);
      } else {
        setResults([]); // Clear results if input is cleared
      }
    }, 500); // Wait 500ms after the user stops typing before searching

    // Cleanup function cancels the timer if they type again before 500ms
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <main className="mt-6 w-full max-w-4xl mx-auto">
      <input
        type="text"
        placeholder="Search locality name (e.g., typed at least 3 letters)..."
        className="w-full p-4 rounded-xl border border-black mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isLoading && <p className="text-gray-500 mb-4">Searching database...</p>}

      <div className="flex flex-col gap-4">
        {results.length === 0 && searchTerm.length >= 3 && !isLoading && (
          <p className="text-red-500">No properties found.</p>
        )}
        
        {results.map((loc) => (
          <PropertyEditCard key={loc._id} property={loc} />
        ))}
      </div>
    </main>
  );
};

// Sub-component to isolate the state of each property row
const PropertyEditCard = ({ property }) => {
  const [govtPrice, setGovtPrice] = useState(property.residential_plot_govt || 0);
  const [marketPrice, setMarketPrice] = useState(property.residential_plot_market || 0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateLocalityPrices(property._id, govtPrice, marketPrice);
    setIsSaving(false);

    if (result.success) {
      alert(`Updated prices for ${property.name}`);
    } else {
      alert("Failed to update prices. Check console.");
    }
  };

  return (
    <div className="border border-gray-300 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 bg-white shadow-sm">
      {/* Read-Only Info */}
      <div className="flex-1 min-w-[200px]">
        <h3 className="text-lg font-bold">{property.name}</h3>
        <p className="text-sm text-gray-500 flex gap-2">
          <span>Dist: <b className="text-black">{property.district || "N/A"}</b></span> | 
          <span>Tehsil: <b className="text-black">{property.tehsil || "N/A"}</b></span>
        </p>
      </div>

      {/* Editable Fields */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">Govt Price</label>
          <input
            type="number"
            className="p-2 border border-gray-300 rounded-lg w-32"
            value={govtPrice}
            onChange={(e) => setGovtPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">Market Price</label>
          <input
            type="number"
            className="p-2 border border-gray-300 rounded-lg w-32"
            value={marketPrice}
            onChange={(e) => setMarketPrice(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-5 p-2 px-6 rounded-lg text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 font-semibold"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default PropertyPrices;