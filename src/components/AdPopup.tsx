// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { X, ExternalLink } from "lucide-react";

// export default function AdPopup() {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // 1. Initial Show: 20 seconds after page load
//     const initialTimer = setTimeout(() => {
//       setIsVisible(true);
//     }, 20000);

//     // 2. Recurring Show: Every 4 minutes
//     const recurringTimer = setInterval(() => {
//       setIsVisible(true);
//     }, 240000);

//     return () => {
//       clearTimeout(initialTimer);
//       clearInterval(recurringTimer);
//     };
//   }, []);

//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

//         {/* Close Button */}
//         <button
//           onClick={() => setIsVisible(false)}
//           className="absolute top-3 right-3 p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
//         >
//           <X size={20} className="text-gray-600" />
//         </button>

//         {/* Ad Image */}
//         <div className="h-48 bg-green-600 flex items-center justify-center">
//           <img
//             src="/main.png"
//             alt="List Your Property"
//             className="object-cover w-full h-full"
//             onError={(e) => {
//               e.currentTarget.src =
//                 "https://via.placeholder.com/400x200?text=List+Your+Property";
//             }}
//           />
//         </div>

//         {/* Content */}
//         <div className="p-6 text-center">
//           <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-green-600 bg-green-50 rounded-full uppercase">
//             Property Listing
//           </span>

//           <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
//             Want To List Your Property?
//           </h2>

//           <p className="text-gray-600 mb-6">
//             Showcase your property on our platform and connect with genuine buyers.
//             Get better visibility, more leads, and awesome sales opportunities.
//           </p>

//           <Link
//             href="https://saharanpurprice.in/contact"
//             target="_blank"
//             className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
//           >
//             List Your Property <ExternalLink size={18} />
//           </Link>

//           <button
//             onClick={() => setIsVisible(false)}
//             className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline"
//           >
//             Ignore this ad
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }