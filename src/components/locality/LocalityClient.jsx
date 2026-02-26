"use client";

import React, { useState, useEffect } from "react";
import PriceSnapshot from "@/components/locality/PriceSnapshot";
import UsageBreakdown from "@/components/locality/UsageBreakdown";
import SpecialFactors from "@/components/locality/SpecialFactors";
import ConstructionCosts from "@/components/locality/ConstructionCosts";
import PriceCalculator from "@/components/locality/PriceCalculator";
import LocalityHeader from "@/components/locality/LocalityHeader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LocalityClient({ slug, initialData }) {
  // ✅ OPTIMIZATION: Initialize state with the data from the server.
  // If initialData exists, 'isLoading' starts as false. Instant load!
  const [locality, setLocality] = useState(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ OPTIMIZATION: Only fetch if we DO NOT have data yet.
    // This prevents double-fetching when you visit the page directly.
    if (initialData) return;

    const loadLocality = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/localities/${slug}`);
        if (!res.ok) {
          setError("Locality not found");
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        setLocality(data);
      } catch (err) {
        console.error("Error loading locality:", err);
        setError("Error loading locality");
      } finally {
        setIsLoading(false);
      }
    };

    loadLocality();
  }, [slug, initialData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Localities
        </Link>

        {isLoading && (
          <div className="text-center py-10">Loading locality data...</div>
        )}

        {error && !isLoading && (
          <div className="text-center py-10 text-red-600">{error}</div>
        )}

        {locality && !isLoading && (
          <>
            <LocalityHeader locality={locality} />
            <PriceSnapshot locality={locality} />
            <UsageBreakdown locality={locality} />
            <SpecialFactors locality={locality} />
            <ConstructionCosts locality={locality} />
            <PriceCalculator locality={locality} />
          </>
        )}
      </div>
    </div>
  );
}
