import React from "react";
import { Trees, Maximize2, Milestone, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SpecialFactors({ locality }) {
  const factors = [
    {
      id: "park",
      name: "Park-facing",
      percentage: locality.park_factor * 100,
      icon: Trees,
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      id: "corner",
      name: "Corner Plot",
      percentage: locality.corner_factor * 100,
      icon: Maximize2,
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      id: "road6to15",
      name: "Road 6-15m",
      percentage: locality.road_6to15_factor * 100,
      icon: Milestone,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: "road15plus",
      name: "Road >15m",
      percentage: locality.road_15plus_factor * 100,
      icon: Milestone,
      color: "bg-slate-100 text-slate-700 border-slate-200",
    },
  ];

  const combinedBonus = (locality.park_factor + locality.corner_factor) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Factors</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {factors.map((factor) => {
          const IconComponent = factor.icon;
          return (
            <div key={factor.id} className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-50 rounded-2xl flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-gray-700" />
              </div>
              <Badge
                className={`${factor.color} border text-sm font-semibold mb-2`}
              >
                +{factor.percentage}%
              </Badge>
              <div className="text-sm font-medium text-gray-900">
                {factor.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Combination Note */}
      <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Combination Bonus</div>
            <div className="text-sm text-gray-600">
              Park-facing + Corner Plot ={" "}
              <span className="font-bold text-green-600">
                +{combinedBonus}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Road Width Explanation */}
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-2">
          Road Width Adjustments
        </h4>
        <div className="text-sm text-gray-700 space-y-1">
          <div>• Up to 6m: Base rate (no adjustment)</div>
          <div>• 6-15m width: +{locality.road_6to15_factor * 100}% premium</div>
          <div>
            • Above 15m width: +{locality.road_15plus_factor * 100}% premium
          </div>
        </div>
      </div>
    </div>
  );
}
