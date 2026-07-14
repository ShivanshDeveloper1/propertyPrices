"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useRef, useState } from "react";
import ServiceUpload from "@/actions/(dealer)/service.actions";

const AddServices = () => {
  const { user } = useAuth();
  const Inputref = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [services, setServices] = useState([
    { service: "", details: "" },
  ]);

  // Handle Image Selection
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  // Handle Dynamic Input Fields
  const handleChange = (index: number, field: "service" | "details", value: string) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  // Add More Field Rows
  const addMoreService = () => {
    setServices([...services, { service: "", details: "" }]);
  };

  // Remove Field Rows
  const removeService = (index: number) => {
    const filtered = services.filter((_, i) => i !== index);
    setServices(filtered);
  };

  // Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please upload a cover image for your services.");
      return;
    }
    if (!user?._id) {
      setErrorMessage("You must be logged in to register services.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("services", JSON.stringify(services));
      formData.append("userId", user._id);

      const response = await ServiceUpload(formData);

      if (response?.success) {
        setShowSuccessModal(true);
        // Reset Form states
        setServices([{ service: "", details: "" }]);
        setFile(null);
        setPreviewImage(null);
      } else {
        setErrorMessage(response?.error || "Something went wrong.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-xl w-full bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 relative">
        
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Register Your Services
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Showcase what you offer with an appealing cover image
          </p>
        </header>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Circular Image Upload Circle */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              onClick={() => Inputref.current?.click()}
              className="h-28 w-28 rounded-full border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 overflow-hidden cursor-pointer flex flex-col items-center justify-center transition-colors group relative"
            >
              {previewImage ? (
                <>
                  <img src={previewImage} alt="preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-medium">Change</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-2">
                  <span className="text-xs font-semibold text-slate-600 block">Upload Image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={Inputref}
              className="hidden"
              accept="image/*"
              onChange={handleImage}
            />
          </div>

          {/* Dynamic Forms Stack */}
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 subtle-scrollbar">
            {services.map((item, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 relative space-y-3 group">
                <div>
                  <label className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                    Service Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Luxury Architecture, Legal Consultation"
                    value={item.service}
                    onChange={(e) => handleChange(index, "service", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                    Service Details
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide deep specifications or performance records..."
                    value={item.details}
                    onChange={(e) => handleChange(index, "details", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline pt-1 block"
                  >
                    Remove Listing
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={addMoreService}
              className="w-full border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl p-3 font-semibold text-sm text-slate-700 hover:text-blue-600 transition-all"
            >
              + Add Another Service Block
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white p-3 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading Assets...
                </>
              ) : (
                "Submit Configurations"
              )}
            </button>
          </div>
        </form>

        {/* Success Modal Overlay */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl space-y-4 animate-scale-up">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Success!</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your services and media assets have been deployed and linked to your profile successfully.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium p-2.5 rounded-xl text-sm transition-all"
              >
                Continue Setup
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default AddServices;