"use client";
import PropUpload from "@/actions/(dealer)/prop.actions";
import React, { useState, useEffect } from "react";
import { LuImageUp, LuCheck, LuTriangleAlert } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext"; 

const page = () => {
  const { user } = useAuth(); 

  const amenitiesList = [
    "Swimming Pool",
    "Parking",
    "Garden",
    "North Facing",
    "West Facing",
  ];
  
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  
  // UI States for Popups
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  
  const [dealerName, setDealerName] = useState("");
  const [dealerPhone, setDealerPhone] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("userName");
      const storedPhone = localStorage.getItem("userPhone");

      if (storedName) setDealerName(storedName);
      else if (user?.name) setDealerName(user.name);

      if (storedPhone) setDealerPhone(storedPhone);
      else if (user?.phone) setDealerPhone(user.phone);
    }
  }, [user]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(""); // Reset errors on new submission

    const formdata = new FormData(e.target);

    // Basic frontend check
    if (!formdata.get("title") || !formdata.get("name") || !formdata.get("phone")) {
      setErrorMessage("Please fill in the required Name, Phone, and Title fields.");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await PropUpload(formdata);

      if (response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000); 
        
        e.target.reset();
        setSelectedAmenities([]);
        setSelectedFilesCount(0);
      } else if (response.status === 400) {
        // EXTRACT EXACT ERRORS: Turn Zod's error object into a readable string
        const errorDetails = Object.entries(response.errors)
          .map(([field, msgs]) => `${field.toUpperCase()}: ${msgs[0]}`)
          .join(" | ");
          
        setErrorMessage(`Please fix: ${errorDetails}`);
      } else {
        setErrorMessage(`Server Error: ${response.message || "Something went wrong"}`);
      }
    } catch (err) {
      setErrorMessage(`Connection Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-6 px-4 md:py-10 md:px-6 relative">
      
      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed top-6 right-6 md:top-10 md:right-10 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-fade-in-down transition-all">
          <LuCheck size={24} />
          <div>
            <h4 className="font-bold text-lg leading-tight">Success!</h4>
            <p className="text-green-100 text-sm">Property has been listed.</p>
          </div>
        </div>
      )}

      {/* ERROR POPUP */}
      {errorMessage && (
        <div className="fixed top-6 right-6 md:top-10 md:right-10 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-fade-in-down transition-all max-w-sm">
          <LuTriangleAlert size={28} className="flex-shrink-0" />
          <div>
            <h4 className="font-bold text-lg leading-tight">Upload Failed</h4>
            <p className="text-red-100 text-sm mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-slate-800">
          Add New Property
        </h1>

        <form className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8" onSubmit={handleSubmit}>
          
          <input type="hidden" name="dealerId" value={user?._id || user?.id || ""} />

          {/* LEFT SIDE: Core Details */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-5 md:p-8 space-y-5 md:space-y-6">
            <h2 className="text-lg md:text-xl font-semibold border-b pb-2">
              Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner/Dealer Name <span className="text-red-500">*</span>
                </label>
                <input name="name" type="text" value={dealerName} onChange={(e) => setDealerName(e.target.value)} placeholder="e.g. John Doe" className="p-3 border rounded-lg w-full bg-slate-50" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input name="phone" type="tel" value={dealerPhone} onChange={(e) => setDealerPhone(e.target.value)} placeholder="e.g. 9876543210" className="p-3 border rounded-lg w-full bg-slate-50" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input name="title" type="text" placeholder="e.g. Luxury 3BHK Villa" className="p-3 border rounded-lg w-full" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input name="address" type="text" placeholder="Full Address" className="p-3 border rounded-lg w-full" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select name="city" className="p-3 border rounded-lg w-full" required>
                  <option value="Saharanpur">Saharanpur</option>
                  <option value="Noida">Noida</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input name="price" type="number" placeholder="e.g. 5000000" className="p-3 border rounded-lg w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select name="type" className="p-3 border rounded-lg w-full" required>
                  <option value="for sale">For Sale</option>
                  <option value="for rent">For Rent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (sq.ft) <span className="text-red-500">*</span>
                </label>
                <input name="area" type="number" placeholder="Area" className="p-3 border rounded-lg w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms (Optional)
                </label>
                <input name="bedrooms" type="number" placeholder="Bedrooms" className="p-3 border rounded-lg w-full bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms (Optional)
                </label>
                <input name="bathrooms" type="number" placeholder="Bathrooms" className="p-3 border rounded-lg w-full bg-slate-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Built Year (Optional)
                </label>
                <input name="builtYear" type="number" placeholder="e.g. 2020" className="p-3 border rounded-lg w-full bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Front / Facing (Optional)
                </label>
                <input name="front" type="text" placeholder="e.g. 30 ft or East Facing" className="p-3 border rounded-lg w-full bg-slate-50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Front Road Width (Optional)
              </label>
              <input name="frontRoadWidth" type="text" placeholder="e.g. 20 ft" className="p-3 border rounded-lg w-full bg-slate-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea name="description" rows={4} placeholder="Describe the property..." className="p-3 border rounded-lg w-full bg-slate-50" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-lg disabled:opacity-70 mt-4"
            >
              {isSubmitting ? "Uploading Property..." : "List Property"}
            </button>
          </section>

          {/* RIGHT SIDE: Media & Amenities */}
          <section className="bg-white rounded-2xl shadow-lg p-5 md:p-6 space-y-6 h-fit order-first lg:order-none">
             <h2 className="text-lg md:text-xl font-semibold border-b pb-2">Media & Extras</h2>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Property Images</p>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl h-32 md:h-40 cursor-pointer hover:bg-blue-50 transition p-4 text-center">
                <LuImageUp size={28} className="text-blue-600 mb-2" />
                <p className="text-gray-600 text-sm">
                  {selectedFilesCount > 0 ? `${selectedFilesCount} files selected` : "Tap to Upload Photos"}
                </p>
                <input type="file" name="images" multiple hidden onChange={(e) => setSelectedFilesCount(e.target.files.length)} />
              </label>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl border cursor-pointer transition ${selectedAmenities.includes(amenity) ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 border-gray-200"}`}>
                    <input type="checkbox" name="amenities" value={amenity} className="hidden" checked={selectedAmenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                    <span className="text-xs md:text-sm font-medium">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
};

export default page;