import React from "react";
import { Building, Hammer, Calendar } from "lucide-react";

export default function ConstructionCosts({ locality }) {
  const depreciationRates = [
    { years: "0-20 years", factor: 100 },
    { years: "20-40 years", factor: 80 },
    { years: "40+ years", factor: 60 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Construction Costs
      </h2>

      {/* Construction Types */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                First-class Construction
              </h3>
              <p className="text-sm text-gray-600">RCC, premium materials</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-700">
            ₹{locality.construction_first_class?.toLocaleString() || "15,000"}
          </div>
          <div className="text-gray-600">per sqm</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Hammer className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Second-class Construction
              </h3>
              <p className="text-sm text-gray-600">
                Basic materials, tin roofing
              </p>
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-700">
            ₹{locality.construction_second_class?.toLocaleString() || "8,500"}
          </div>
          <div className="text-gray-600">per sqm</div>
        </div>
      </div>

      {/* Depreciation Table */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">
            Depreciation Schedule
          </h3>
        </div>

        <div className="space-y-3">
          {depreciationRates.map((rate, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="text-gray-700">{rate.years}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {rate.factor}%
                </span>
                <span className="text-sm text-gray-600">of original value</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <strong>Note:</strong> Depreciation applies to constructed properties
          only. Land value doesn't depreciate.
        </div>
      </div>
    </div>
  );
}
