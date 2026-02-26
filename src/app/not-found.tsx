"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center text-gray-800 p-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Sorry, this page could not be found.</p>
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 font-medium underline"
      >
        Go back home
      </Link>
    </div>
  );
}
