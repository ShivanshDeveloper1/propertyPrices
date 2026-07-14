"use client";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const boxes = [
  {
    icons: <Plus size={18} />,
    text: "Add Property", 
    href: "/UploadProp",
  },
  {
    icons: <Plus size={18} />,
    text: "Add Services",
    href: "/addservices",
  },
];

const SideBar = ({ onClose }) => {
  return (
    <main className="h-screen w-64 border-r bg-gray-50 flex flex-col shadow-2xl md:shadow-none">
      
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between md:justify-center bg-white sticky top-0 z-10">
        <Image
          src="/icon.png"
          alt="Logo"
          height={40}
          width={40}
          className="object-cover rounded-md"
        />
        
        {/* Mobile Close Button (Hidden on Desktop) */}
        <button 
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" 
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto">
        {boxes.map((box, index) => (
          <Link
            href={`/admin${box.href}`}
            key={index}
            onClick={onClose} // Closes sidebar on mobile when navigating
            className="flex items-center gap-4 px-4 py-3 rounded-lg border bg-white shadow-sm hover:shadow-md hover:bg-gray-100 hover:scale-[1.02] transition cursor-pointer"
          >
            <span className="rounded-full border border-gray-300 p-2 text-gray-600 bg-gray-50">
              {box.icons}
            </span>

            <p className="text-gray-700 font-medium">{box.text}</p>
          </Link>
        ))}
      </div>
      
    </main>
  );
};

export default SideBar;