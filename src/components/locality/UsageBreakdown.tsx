import React, { useState } from "react";
import { ChevronDown, ChevronUp, Home, Building2 } from "lucide-react";
import UsageItem from "./UsageItem";

export default function UsageBreakdown({ locality }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const residentialItems = [
    {
      title: "Plot (Non-Agricultural land)",
      subtitle: "भूखंड (गैर-कृषि भूमि)",
      govtRate: locality.residential_plot_govt,
      marketRate: locality.residential_plot_market,
      note: "6m road",
    },
    {
      title: "Constructed House",
      subtitle: "निर्मित भवन",
      govtRate: locality.residential_house_govt,
      marketRate: locality.residential_house_market,
      note: "-15% if >20 years",
    },
  ];

  const commercialItems = [
    {
      title: "Shop on local road (≤6m)",
      subtitle: "स्थानीय सड़क पर दुकान",
      govtRate: locality.commercial_shop_local_govt,
      marketRate: locality.commercial_shop_local_market,
      note: "Local area shops",
    },
    {
      title: "Shop on main road",
      subtitle: "मुख्य सड़क पर दुकान",
      govtRate: locality.commercial_shop_main_govt,
      marketRate: locality.commercial_shop_main_market,
      note: "Main road frontage",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Property Usage Breakdown
      </h2>

      {/* Residential Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection("residential")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                Residential
              </h3>
              <p className="text-gray-600">आवासीय संपत्ति</p>
            </div>
          </div>
          {expandedSections.residential ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.residential && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
            {residentialItems.map((item, index) => (
              <UsageItem key={index} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Commercial Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection("commercial")}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                Commercial
              </h3>
              <p className="text-gray-600">वाणिज्यिक संपत्ति</p>
            </div>
          </div>
          {expandedSections.commercial ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.commercial && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
            {commercialItems.map((item, index) => (
              <UsageItem key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
