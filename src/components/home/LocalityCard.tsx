"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function LocalityCard({ locality }) {
  // 1. Calculate Raw Numbers
  const avgGovtRate = Math.round(
    (locality.residential_plot_govt + locality.commercial_shop_local_govt) / 2
  );

  const avgMarketRate = Math.round(
    ((locality.residential_plot_market ?? 0) +
      (locality.commercial_shop_local_market ?? 0)) /
      2
  );

  const percentageDiff =
    avgMarketRate && avgGovtRate
      ? Math.round(((avgMarketRate - avgGovtRate) / avgGovtRate) * 100)
      : 0;

  // 2. State for Display Strings (Initialize with placeholders or raw values)
  const [displayData, setDisplayData] = useState({
    govt: avgGovtRate, // Start as number
    market: "N/A", // Start as N/A
    date: null,
  });

  // 3. Format Everything in One Place (Client Side Only)
  useEffect(() => {
    setDisplayData({
      govt: avgGovtRate.toLocaleString("en-IN"),
      market: avgMarketRate > 0 ? avgMarketRate.toLocaleString("en-IN") : "N/A",
      date: locality.last_updated
        ? format(new Date(locality.last_updated), "MMM yyyy")
        : null,
    });
  }, [locality, avgGovtRate, avgMarketRate]);

  return (
    <Link href={`/locality/${locality.slug}`}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-slate-700 transition-colors">
              {locality.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {locality.tehsil
                  ? `${locality.tehsil}, ${locality.district}`
                  : locality.district}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {locality.zones?.map((zone) => (
              <Badge key={zone} variant="outline" className="text-xs">
                {zone}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price Display (Now much cleaner!) */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Govt Rate (avg)</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{displayData.govt}
            </div>
            <div className="text-xs text-gray-500">per sqm</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Market Avg</div>
            <div className="text-2xl font-bold text-slate-700">
              {displayData.market !== "N/A" ? `₹${displayData.market}` : "N/A"}
            </div>
            <div className="text-xs text-gray-500">per sqm</div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-semibold">
              {percentageDiff > 0 ? `+${percentageDiff}%` : "N/A"}
            </span>
            <span className="text-gray-500 text-sm">difference</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Calendar className="w-3 h-3" />
            {displayData.date}
          </div>
        </div>
      </div>
    </Link>
  );
}
