"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
// NEW: Added 'Shield' to the lucide-react imports for the admin icon
import { MapPin, Home, Menu, X, Building2, Shield } from "lucide-react";
import { FaBlogger } from "react-icons/fa";
import { useState, useEffect } from "react";
// NEW: Import your Auth Hook (Adjust this path to where your context is actually located!)
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const homeLink = "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // NEW: Get the logged-in user from your AuthContext
  const { user } = useAuth();
   
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  return (
    <motion.header
      className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo - Added flex-shrink-0 to prevent squishing */}
          <Link
            href={homeLink}
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
          >
            <motion.div
              className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-700 to-teal-600 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>

            <div className="min-w-0">
              {" "}
              {/* min-w-0 helps with text truncation if needed */}
              <div className="text-base sm:text-xl font-bold text-gray-900 leading-tight">
                Saharanpur Properties
              </div>
              <p className="text-[10px] sm:text-sm text-gray-500">
                Property Price Directory
              </p>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Navigation */}
            <nav
              aria-label="Main Navigation"
              className="hidden md:flex items-center gap-4 lg:gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/blogs"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                >
                  <FaBlogger className="w-4 h-4" /> Blogs
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/properties"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                >
                  <Building2 className="w-4 h-4" /> Properties
                </Link>
              </motion.div>
                <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dealer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                >
                  <Building2 className="w-4 h-4" /> Dealers
                </Link>
              </motion.div>

              {/* NEW: Admin Link for Desktop - Only shows if user exists */}
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
      href="/admin"
      className="
        flex items-center gap-2
        px-5 py-2.5
        rounded-full
        bg-gradient-to-r from-teal-500 to-blue-500
        text-white
        font-semibold
        shadow-md shadow-teal-200
        hover:shadow-lg hover:shadow-teal-300
        transition-all duration-300
      "
    >
      <Shield className="w-4 h-4" />
      Post Property
    </Link>
                </motion.div>
              ) : (
                 <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                 <Link
      href="/AgentUpload"
      className="
        flex items-center gap-2
        px-5 py-2.5
        rounded-full
        bg-gradient-to-r from-teal-500 to-blue-500
        text-white
        font-semibold
        shadow-md shadow-teal-200
        hover:shadow-lg hover:shadow-teal-300
        transition-all duration-300
      "
    >
      <Shield className="w-4 h-4" />
      Post Property
    </Link>
                </motion.div>
              ) }

            </nav>

            {/* Desktop Contact Button */}
            {/* <Link
              href="/contact"
              className="hidden md:inline-block   rounded-md py-2 px-4 text-sm font-medium text-black transition-colors"
            >
              Contact Us
            </Link> */}

            {/* Mobile Hamburger - Increased hit area for better UX */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="p-2 -mr-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                aria-label="Toggle Menu"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              aria-label="Mobile Navigation"
              className="md:hidden mt-3 flex flex-col gap-1 bg-gray-50 p-3 rounded-xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/blogs"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-teal-600 transition-all"
              >
                <FaBlogger className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Blogs</span>
              </Link>
            
              <Link
                href="/properties"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-teal-600 transition-all"
              >
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Properties</span>
              </Link>

              {/* Added Dealers link to mobile for full desktop parity */}
              <Link
                href="/dealer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-teal-600 transition-all"
              >
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Dealers</span>
              </Link>

              {/* UPDATED: Dynamic Post Property option for mobile view */}
        {/* Mobile Post Property */}
{user ? (
<motion.div whileTap={{ scale: 0.97 }}>
<Link
href="/admin"
onClick={() => setMobileOpen(false)}
className="
mt-2
flex items-center justify-center gap-3
w-full
px-4 py-4
rounded-2xl
bg-gradient-to-r from-teal-500 to-blue-500
text-white
font-semibold
shadow-lg shadow-teal-200
active:scale-[0.98]
transition-all
"
> <Shield className="w-5 h-5" /> <span>Post Property</span>

```
  <span
    className="
      ml-auto
      text-[10px]
      px-2 py-1
      rounded-full
      bg-white/20
    "
  >
    FREE
  </span>
</Link>
```

</motion.div>
) : (
<motion.div whileTap={{ scale: 0.97 }}>
<Link
href="/AgentUpload"
onClick={() => setMobileOpen(false)}
className="
mt-2
flex items-center justify-center gap-3
w-full
px-4 py-4
rounded-2xl
bg-gradient-to-r from-teal-500 to-blue-500
text-white
font-semibold
shadow-lg shadow-teal-200
active:scale-[0.98]
transition-all
"
> <Shield className="w-5 h-5" /> <span>Post Property</span>

  <span
    className="
      ml-auto
      text-[10px]
      px-2 py-1
      rounded-full
      bg-white/20
    "
  >
    FREE
  </span>
</Link>

</motion.div>
)}

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
              className="
    mt-2
    w-full
    px-4
    py-3
    rounded-xl
    border
    border-gray-200
    text-center
    font-semibold
    text-gray-800
    hover:bg-white
    transition
  "
              >
                Contact Us
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}