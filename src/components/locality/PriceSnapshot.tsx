"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Home, Building2, Info } from "lucide-react";

export default function PriceSnapshot({ locality }) {
  // Logic remains identical to ensure data integrity
  const resAvgGovt = Math.round(((locality.residential_plot_govt || 0) + (locality.residential_house_govt || 0)) / 2);
  const resAvgMarket = Math.round(((locality.residential_plot_market ?? 0) + (locality.residential_house_market ?? 0)) / 2);
  const resDifference = resAvgMarket > 0 && resAvgGovt > 0 ? Math.round(((resAvgMarket - resAvgGovt) / resAvgGovt) * 100) : 0;

  const comAvgGovt = Math.round(((locality.commercial_shop_local_govt || 0) + (locality.commercial_shop_main_govt || 0)) / 2);
  const comAvgMarket = Math.round(((locality.commercial_shop_local_market ?? 0) + (locality.commercial_shop_main_market ?? 0)) / 2);
  const comDifference = comAvgMarket > 0 && comAvgGovt > 0 ? Math.round(((comAvgMarket - comAvgGovt) / comAvgGovt) * 100) : 0;

  const [clientRates, setClientRates] = useState({
    resGovt: "0",
    resMarket: "0",
    comGovt: "0",
    comMarket: "0",
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
    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-200 shadow-sm">
      {/* Section Heading */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">
            Real Estate Insights
          </p>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Price Snapshot
          </h2>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-slate-400 font-medium italic">Updated for 2026</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Residential Card */}
        <div className="group bg-white rounded-2xl p-5 border border-slate-200 transition-all duration-300 hover:shadow-md hover:border-blue-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center ring-1 ring-blue-100 group-hover:bg-blue-600 transition-colors duration-300">
              <Home className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Residential</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Avg. Plot & House</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">Govt Rate</span>
              <span className="text-lg font-bold text-slate-900">₹{clientRates.resGovt}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">Market Rate</span>
              <span className="text-lg font-bold text-slate-700">
                {resAvgMarket > 0 ? `₹${clientRates.resMarket}` : <span className="text-slate-300">N/A</span>}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-slate-400 text-xs font-bold uppercase">Price Gap</span>
              {resDifference !== 0 ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-600">
                    {resDifference > 0 ? `+${resDifference}%` : `${resDifference}%`}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-300 uppercase">Stable</span>
              )}
            </div>
          </div>
        </div>

        {/* Commercial Card */}
        <div className="group bg-white rounded-2xl p-5 border border-slate-200 transition-all duration-300 hover:shadow-md hover:border-amber-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center ring-1 ring-amber-100 group-hover:bg-amber-500 transition-colors duration-300">
              <Building2 className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Commercial</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Shop & Main Road</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">Govt Rate</span>
              <span className="text-lg font-bold text-slate-900">₹{clientRates.comGovt}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm font-medium">Market Rate</span>
              <span className="text-lg font-bold text-slate-700">
                {comAvgMarket > 0 ? `₹${clientRates.comMarket}` : <span className="text-slate-300">N/A</span>}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-slate-400 text-xs font-bold uppercase">Price Gap</span>
              {comDifference !== 0 ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-600">
                    {comDifference > 0 ? `+${comDifference}%` : `${comDifference}%`}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-300 uppercase">Stable</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-6 flex gap-3 p-4 bg-slate-100/50 rounded-xl border border-slate-200/60">
        <Info className="w-5 h-5 text-slate-400 shrink-0" />
        <p className="text-xs text-slate-500 leading-normal">
          Market prices typically exceed government valuations due to local infrastructure development, 
          road connectivity, and rising commercial demand in this sector.
        </p>
      </div>
    </div>
  );
}