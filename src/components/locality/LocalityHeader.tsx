import React from "react";
import { MapPin, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function LocalityHeader({ locality }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {locality.name}
        </h1>
        <div className="flex items-center justify-center gap-1 text-gray-600 mb-4">
          <MapPin className="w-5 h-5" />
          <span className="text-lg">
            {locality.tehsil
              ? `${locality.tehsil}, ${locality.district.split(",")[0]}` // Shows: "Nakur, Saharanpur"
              : locality.district}
          </span>
        </div>

        {/* Zones */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {locality.zones?.map((zone) => (
            <Badge
              key={zone}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {zone} Zone
            </Badge>
          ))}
        </div>

        {/* Source Info */}
        <div className="flex flex-col md:flex-row justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>
              SRO:{" "}
              {locality.sro_date &&
                format(new Date(locality.sro_date), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              Updated:{" "}
              {locality.last_updated &&
                format(new Date(locality.last_updated), "MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
