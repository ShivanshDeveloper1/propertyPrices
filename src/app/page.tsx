import Accordian from "@/components/home/Accordian";
import SearchableLocalities from "@/components/home/SearchableLocalities";
import Link from "next/link";
import React from "react";
import { questions } from "@/data/Accordian";

export interface Locality {
  _id: string;
  name: string;
  district: string;
  tehsil: string;
  slug: string;
  residential_plot_govt: number;
  residential_plot_market: number;
  last_updated: string | null;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const params = await searchParams;
  const cityName =
    (params.city || "Saharanpur").charAt(0).toUpperCase() +
    (params.city || "Saharanpur").slice(1).toLowerCase();

  return {
    title: `Property Rates in ${cityName} | Govt Circle Rates ${new Date().getFullYear()}`,
    description: `Latest government circle rates and market property prices in ${cityName}. Check land registry rates updated for ${new Date().getFullYear()}.`,
    alternates: {
      // ✅ Normalized canonical to prevent duplicate content
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}${
        params.city ? `?city=${params.city.toLowerCase()}` : ""
      }`,
    },
  };
}

async function getLocalities(page: number, city: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000";
  const apiUrl = `${baseUrl}/api/localities?page=${page}&limit=20&city=${city}`;

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return await res.json();
  } catch (error) {
    // console.error("❌ Fetch Error:", error);
    return { data: [], pagination: { totalPages: 1, page: 1 } };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; city?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const currentCity = params.city || "Saharanpur";

  const response = await getLocalities(currentPage, currentCity);
  const localities = response.data || [];
  const pagination = response.pagination || { page: 1, totalPages: 1 };

  // ✅ IMPROVED SCHEMA FOR GOOGLE
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Property Rates in ${currentCity}`,
    description: `Official circle rates and market values for land and plots in ${currentCity}.`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/?city=${currentCity.toLowerCase()}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: localities.map((loc: Locality, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/locality/${loc.slug}`,
        name: loc.name,
      })),
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ⚡ SALE ANNOUNCEMENT BANNER */}
      <div className="bg-red-50 border-2 border-red-500 text-red-800 p-6 rounded-2xl mb-10 text-center shadow-lg">
        <p className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
          Hello everyone I want to sale this site.
        </p>
        <p className="text-xl md:text-2xl font-bold">
          Contact me now at this number:{" "}
          <a
            href="tel:+917618550475"
            className="text-blue-600 underline hover:text-blue-800"
          >
            +91 7618550475
          </a>
        </p>
      </div>

      <div className="text-center mb-12">
        {/* ✅ SEO Tip: H1 must include the City Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Property Rates in <span className="text-blue-600">{currentCity}</span>
        </h1>

        {/* ✅ SEO Tip: Added context paragraph for Google crawlers */}
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Explore the latest{" "}
          <strong>{new Date().getFullYear()} circle rates</strong> and market
          trends for residential plots in {currentCity}. Our directory provides
          transparent pricing data to help buyers and investors make informed
          decisions.
        </p>

        <SearchableLocalities
          localities={localities}
          initialCity={currentCity}
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-12 mb-12">
        {currentPage > 1 ? (
          <Link
            href={`/?page=${currentPage - 1}&city=${currentCity}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-semibold"
          >
            ← Previous
          </Link>
        ) : (
          <div className="px-5 py-2.5 bg-gray-50 border border-gray-100 text-gray-300 rounded-xl cursor-not-allowed font-semibold">
            ← Previous
          </div>
        )}

        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Page
          </span>
          <span className="text-gray-900 font-bold">
            {pagination.page} / {pagination.totalPages}
          </span>
        </div>

        {currentPage < pagination.totalPages ? (
          <Link
            href={`/?page=${currentPage + 1}&city=${currentCity}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-100"
          >
            Next →
          </Link>
        ) : (
          <div className="px-5 py-2.5 bg-gray-50 border border-gray-100 text-gray-300 rounded-xl cursor-not-allowed font-semibold">
            Next →
          </div>
        )}
      </div>

      {/* Accordian */}
      <Accordian questions={questions} />

      {/* Footer / Browse All */}
      <footer className="mt-20 pt-10 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
          Browse All Localities in {currentCity}
        </h3>
        <div className="flex flex-wrap justify-center gap-2 max-h-[300px] overflow-y-auto px-2">
          {localities.map((loc: Locality) => (
            <Link
              key={loc._id}
              href={`/locality/${loc.slug}`}
              className="text-xs text-slate-600 bg-slate-100 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium border border-transparent"
            >
              {loc.name} {loc.tehsil ? `(${loc.tehsil})` : ""}
            </Link>
          ))}

          <div className="max-w-7xl mx-auto px-4 flex justify-between">
            <a
              href="/download-circle-rate"
              className="hover:text-slate-600 transition-colors underline decoration-slate-200 mt-2"
            >
              UP District-wise Property Rate List Directory (PDF)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}