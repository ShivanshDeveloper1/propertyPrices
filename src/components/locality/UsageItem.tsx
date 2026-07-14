import React from "react";
import { TrendingUp } from "lucide-react";

export default function UsageItem({ item }) {
  const percentageDiff = Math.round(
    ((item.marketRate - item.govtRate) / item.govtRate) * 100
  );

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.subtitle}</p>
          {item.note && (
            <p className="text-xs text-amber-600 mt-1">{item.note}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 min-w-0">
          <div className="text-center md:text-right">
            <div className="text-sm text-gray-600">Govt Rate</div>
            <div className="text-lg font-bold text-gray-900">
              ₹{item.govtRate?.toLocaleString() || "N/A"}
            </div>
            <div className="text-xs text-gray-500">per sqm</div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-sm text-gray-600">Market Avg</div>
            <div className="text-lg font-bold text-slate-700">
              ₹{item.marketRate?.toLocaleString() || "N/A"}
            </div>
            <div className="text-xs text-gray-500">per sqm</div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-sm text-gray-600">Difference</div>
            <div className="flex items-center justify-center md:justify-end gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                +{percentageDiff}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
