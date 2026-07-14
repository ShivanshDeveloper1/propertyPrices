"use client";

import PropertyPrices from "@/components/(admin)/(propertyPrices)/PropertyPrices";
import React, { useState } from "react";

const Page = () => {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (password === "12345") {
      setSuccess(true);
    } else {
      alert("Wrong Password");
    }
  };

  return (
    <main>
      {!success ? (
        <div className="flex items-center justify-center p-4">
          <input
            type="password"
            placeholder="Enter the password first"
            className="rounded-xl placeholder:text-gray-700 p-2 border border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="p-4 rounded-xl text-white bg-blue-400 ml-8"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold">
         Search and   Edit the property Prices
          </h1>
          <PropertyPrices />
        </div>
      )}
    </main>
  );
};

export default Page;