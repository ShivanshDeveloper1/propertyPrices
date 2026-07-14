"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-center p-6 selection:bg-blue-500 selection:text-white">
      <div className="max-w-md w-full space-y-6">
        {/* Giant Hero 404 */}
        <h1 className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          404
        </h1>

        {/* Messaging */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
            Page not found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {"Sorry for the inconvenience. We are currently working on this page or it has been moved."}
          </p>
        </div>

        {/* Call to Action Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}