"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function LocalityCard({ locality }) {
  // 1. Safety Checks: Use || 0 so we don't get NaN
  const govtRate = locality.residential_plot_govt || 0;
  const marketRate = locality.residential_plot_market || 0;

  // Use the rates available. If you don't have commercial rates in the API,
  // don't try to average them or you will get NaN.
  const avgGovtRate = Math.round(govtRate);
  const avgMarketRate = Math.round(marketRate);

  const percentageDiff =
    avgMarketRate && avgGovtRate
      ? Math.round(((avgMarketRate - avgGovtRate) / avgGovtRate) * 100)
      : 0;

  // 2. State for Display
  const [displayData, setDisplayData] = useState({
    govt: avgGovtRate.toLocaleString("en-IN"),
    market: avgMarketRate > 0 ? avgMarketRate.toLocaleString("en-IN") : "N/A",
    date: "---",
  });

  // 3. Client-side formatting to prevent hydration mismatch
  useEffect(() => {
    setDisplayData({
      govt: avgGovtRate.toLocaleString("en-IN"),
      market: avgMarketRate > 0 ? avgMarketRate.toLocaleString("en-IN") : "N/A",
      date: locality.last_updated
        ? format(new Date(locality.last_updated), "MMM yyyy")
        : "N/A",
    });
  }, [locality, avgGovtRate, avgMarketRate]);

  return (
    <Link href={`/locality/${locality.slug}`}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
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
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Govt Rate</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{displayData.govt}
            </div>
            <div className="text-xs text-gray-500">per sqm</div>
          </div>
          <div className="bg-blue-50/50 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Market Avg</div>
            <div className="text-2xl font-bold text-blue-700">
              {displayData.market !== "N/A" ? `₹${displayData.market}` : "N/A"}
            </div>
            <div className="text-xs text-gray-500">per sqm</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-semibold">
              {percentageDiff > 0 ? `+${percentageDiff}%` : "N/A"}
            </span>
            <span className="text-gray-500 text-sm">premium</span>
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
