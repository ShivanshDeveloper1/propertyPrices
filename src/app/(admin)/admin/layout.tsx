"use client";
import Navbar from "@/components/(admin)/Navbar";
import SideBar from "@/components/(admin)/SideBar";
import React, { useState } from "react";
import { Menu } from "lucide-react";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      
      {/* Mobile Overlay Background - clicking it closes the sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideBar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative w-full">
        
        {/* Mobile Header with Hamburger Menu (Hidden on Desktop) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800 text-lg">Admin Panel</span>
          <div className="w-8" /> {/* Spacer to center the title */}
        </div>

        {/* Existing Navbar (You might want to hide this on mobile if your Navbar isn't responsive yet: `hidden md:block`) */}
        <div className="hidden md:block">
           <Navbar />
        </div>
        
        {/* Children Content */}
        <div className="w-full p-4 md:p-6">
          {children}
        </div>
      </div>
      
    </main>
  );
};

export default AdminLayout;