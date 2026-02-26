"use client";

import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16 pb-8">
      <motion.div
        className="max-w-6xl mx-auto px-4 py-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* --- Main Copyright & Disclaimer --- */}
        <p className="text-gray-600 text-sm font-medium">
          © {new Date().getFullYear()} Saharanpur Properties. Property rates
          updated regularly.
        </p>
        <p className="text-gray-500 text-xs mt-2 max-w-lg mx-auto leading-relaxed">
          Government rates as per SRO notifications. Market rates are estimates
          only.
        </p>

        {/* --- SEO LINK (Only About Us) --- */}
        <div className="flex items-center justify-center mt-5">
          <Link
            href="/about"
            className="text-xs font-semibold text-gray-500 hover:text-green-600 transition-colors uppercase tracking-widest border-b border-transparent hover:border-green-600 pb-0.5"
          >
            About Us
          </Link>
        </div>

        {/* --- Contact / Credit Section --- */}
        <motion.div
          className="flex items-center justify-center gap-2 text-gray-700 mt-6 text-sm bg-gray-50 py-2 px-4 rounded-full inline-flex border border-gray-100"
          whileHover={{ scale: 1.05 }}
        >
          <FaPhoneAlt className="text-green-600 text-xs" />
          <span className="font-semibold text-gray-800">
            Made by Shivansh Singh
          </span>
          <span className="text-gray-400">|</span>
          <a
            href="tel:+917618550475"
            className="hover:text-green-600 transition-colors"
          >
            +91 761855 0475
          </a>
        </motion.div>
      </motion.div>
    </footer>
  );
}
