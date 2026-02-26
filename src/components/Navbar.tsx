"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Home, Menu, X } from "lucide-react";
import { FaBlogger } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const homeLink = "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <Link href={homeLink} className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-slate-700 to-teal-600 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MapPin className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              {/* ✅ SEO FIX: Changed <h1> to <div> to prevent "Multiple H1" errors */}
              <div className="text-xl font-bold text-gray-900">
                Saharanpur Properties
              </div>
              <p className="text-sm text-gray-500">Property Price Directory</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={homeLink}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:text-teal-600 hover:bg-teal-50"
              >
                <Home className="w-4 h-4" /> Home
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/Blogs"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:text-teal-600 hover:bg-teal-50"
              >
                <FaBlogger className="w-4 h-4" />
                Market Trends (Blogs)
              </Link>
            </motion.div>
          </nav>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              className="md:hidden mt-4 flex flex-col gap-3 bg-gray-50 p-4 rounded-lg shadow-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={homeLink}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              >
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link
                href="/Blogs"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              >
                <FaBlogger className="w-4 h-4" /> Blogs
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
