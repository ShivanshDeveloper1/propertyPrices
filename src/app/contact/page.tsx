"use client";
import React, { useState } from "react";
import { FaWhatsapp, FaExclamationCircle } from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const whatsappNumber = "917618550475";
  const correctionMessage = encodeURIComponent("Hi, I noticed a discrepancy in the property prices on your website and would like to help correct it.");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Message sent! (connect this to email API later)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-xl w-full bg-white shadow-md rounded-xl p-8">
        
        <h1 className="text-3xl font-bold text-center mb-2">
          Contact Us
        </h1>

        <p className="text-center text-gray-500 mb-6">
          We'd love to hear from you. Send us a message.
        </p>

        {/* NEW: Beautiful Price Correction Alert Box */}
        <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg flex items-start gap-3">
          <FaExclamationCircle className="text-amber-500 mt-1 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-bold text-amber-800">Spot a pricing error?</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              We strive for 100% accuracy. If you find any property rates that seem incorrect, please let us know!
            </p>
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${correctionMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 mt-2 transition-colors"
            >
              <FaWhatsapp /> Message me on WhatsApp for fast correction
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <textarea
            name="message"
            placeholder="Write your message..."
            rows={4}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Send Message
          </button>
        </form>

        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          <p className="mb-1 font-medium text-gray-700">Direct Contact Details:</p>
          <p>Email: shivanshsingh4539@gmail.com</p>
          <p>Phone: +91 7618550475</p>
        </div>

      </div>
    </div>
  );
}