"use client"
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter()
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6 bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        
        {/* Highlight the main selling point immediately */}
        <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
          Start Getting Leads Today
        </span>

        {/* Clear, bold headline */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Grow Your Property Portfolio
        </h1>

        {/* Combined the remaining text for a natural read */}
        <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">
          Click below to list your properties. We are rolling out more features in the coming weeks, but your listings will start generating leads from day one.
        </p>

        {/* A clear, unmissable button */}
        <button className="bg-black text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-800 transition-all w-full sm:w-auto shadow-sm" onClick={()=> router.push('/admin/UploadProp')}>
          + Add Property
        </button>
         
        
      </div>
    </div>
  );
};

export default Page;