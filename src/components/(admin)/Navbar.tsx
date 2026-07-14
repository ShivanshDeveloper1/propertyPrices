import React from "react";

const Navbar = () => {
  return (
    <main className="h-[10vh] border-b-2 border-gray-600  flex items-center justify-between  px-4 py-4 md:px-12">
      <h1 className="font-bold">Admin Panel</h1>

      <div className="w-10 h-10 rounded-full border border-gray-600"></div>
    </main>
  );
};

export default Navbar;