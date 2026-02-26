// src/components/PriceSnapshot.tsx

"use client"; // 1. Add this to use hooks

import React, { useState, useEffect } from "react"; // 2. Import hooks
import { TrendingUp, Home, Building2 } from "lucide-react";

export default function PriceSnapshot({ locality }) {
  // 3. Use nullish coalescing (?? 0) to safely handle missing market data
  const resAvgGovt = Math.round(
    (locality.residential_plot_govt + locality.residential_house_govt) / 2
  );
  const resAvgMarket = Math.round(
    ((locality.residential_plot_market ?? 0) +
      (locality.residential_house_market ?? 0)) /
      2
  );
  // Only calculate difference if market rate exists
  const resDifference =
    resAvgMarket > 0 && resAvgGovt > 0
      ? Math.round(((resAvgMarket - resAvgGovt) / resAvgGovt) * 100)
      : 0;

  const comAvgGovt = Math.round(
    (locality.commercial_shop_local_govt + locality.commercial_shop_main_govt) /
      2
  );
  const comAvgMarket = Math.round(
    ((locality.commercial_shop_local_market ?? 0) +
      (locality.commercial_shop_main_market ?? 0)) /
      2
  );
  // Only calculate difference if market rate exists
  const comDifference =
    comAvgMarket > 0 && comAvgGovt > 0
      ? Math.round(((comAvgMarket - comAvgGovt) / comAvgGovt) * 100)
      : 0;

  // 4. Create state for client-side formatting to prevent hydration errors
  const [clientRates, setClientRates] = useState({
    resGovt: resAvgGovt,
    resMarket: resAvgMarket,
    comGovt: comAvgGovt,
    comMarket: comAvgMarket,
  });

  useEffect(() => {
    setClientRates({
      resGovt: resAvgGovt.toLocaleString("en-IN"),
      resMarket: resAvgMarket.toLocaleString("en-IN"),
      comGovt: comAvgGovt.toLocaleString("en-IN"),
      comMarket: comAvgMarket.toLocaleString("en-IN"),
    });
  }, [resAvgGovt, resAvgMarket, comAvgGovt, comAvgMarket]);

  return (
    <div className="bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Quick Price Snapshot
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Residential */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {/* ... Header is fine ... */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Govt Rate (avg)</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{clientRates.resGovt}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Market Avg</span>
              <span className="text-xl font-bold text-slate-700">
                {resAvgMarket > 0 ? `₹${clientRates.resMarket}` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-gray-600">Difference</span>
              {/* 5. Conditionally render the difference */}
              {resDifference !== 0 ? (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    {resDifference > 0 ? `+${resDifference}` : resDifference}%
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-500">N/A</span>
              )}
            </div>
          </div>
        </div>

        {/* Commercial */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {/* ... Header is fine ... */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Govt Rate (avg)</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{clientRates.comGovt}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Market Avg</span>
              <span className="text-xl font-bold text-slate-700">
                {comAvgMarket > 0 ? `₹${clientRates.comMarket}` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-gray-600">Difference</span>
              {/* 6. Conditionally render the difference */}
              {comDifference !== 0 ? (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    {comDifference > 0 ? `+${comDifference}` : comDifference}%
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-500">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
