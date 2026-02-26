import SearchableLocalities from "@/components/home/SearchableLocalities";
import Link from "next/link";
import React from "react";

// Types remain consistent
export interface Locality {
  _id: string;
  name: string;
  district: string;
  tehsil?: string;
  zones: string[];
  sro_date: string;
  last_updated: string;
  residential_plot_govt: number;
  residential_plot_market?: string | number;
  residential_house_govt: number;
  slug: string;
}

async function getLocalities(): Promise<Locality[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/localities?orderBy=-updated_date`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch localities`);
    return await res.json();
  } catch (error) {
    console.error("Error in getLocalities:", error);
    return [];
  }
}

export default async function Home() {
  const localities = await getLocalities();

  // Dynamic SEO Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Saharanpur & Noida Property Rates Directory 2025",
    description: `Current government circle rates for ${localities.length} localities in Saharanpur and Noida Sectors.`,
    url: "https://saharanpurprice.in",
    hasPart: localities.slice(0, 20).map((loc) => ({
      "@type": "DataCatalog",
      name: loc.name,
      url: `https://saharanpurprice.in/locality/${loc.slug}`,
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* --- CONTENT STARTS HERE (Script moved to bottom) --- */}

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Property Rates Directory
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Comprehensive directory with{" "}
          <span className="font-semibold text-gray-800">
            government circle rates
          </span>{" "}
          and market values for{" "}
          <span className="text-blue-600 font-bold">Saharanpur</span> and{" "}
          <span className="text-blue-600 font-bold">Noida</span>.
        </p>

        <SearchableLocalities localities={localities} />
      </div>

      {/* Trending in Noida Section */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <span className="flex h-3 w-3 rounded-full bg-blue-600 animate-pulse"></span>
          <h2 className="text-2xl font-bold text-gray-900">
            Trending in Noida (Jewar Airport)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/locality/yeida-sector-18-jewar"
            className="p-4 bg-white border border-blue-100 rounded-xl hover:shadow-md transition-shadow flex justify-between items-center group"
          >
            <div>
              <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Sector 18 (YEIDA)
              </p>
              <p className="text-sm text-gray-500">
                Premium Airport Proximity Plots
              </p>
            </div>
            <span className="text-blue-600 font-semibold">View Rates →</span>
          </Link>
          <Link
            href="/locality/yeida-sector-20-jewar"
            className="p-4 bg-white border border-blue-100 rounded-xl hover:shadow-md transition-shadow flex justify-between items-center group"
          >
            <div>
              <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Sector 20 (YEIDA)
              </p>
              <p className="text-sm text-gray-500">
                Fastest Growing Residential Zone
              </p>
            </div>
            <span className="text-blue-600 font-semibold">View Rates →</span>
          </Link>
        </div>
      </section>

      {/* SEO Content Block */}
      <section className="mt-16 border-t pt-10 bg-gray-50 rounded-2xl p-6 md:p-10 shadow-inner">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Property Guidelines for Saharanpur & Noida
        </h2>
        <div className="prose max-w-none text-gray-600 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 underline decoration-blue-500 decoration-2 underline-offset-4">
              Circle Rates (Govt Rate)
            </h3>
            <p className="text-sm leading-relaxed">
              The <strong>Circle Rate</strong> is the official minimum valuation
              set by the district administration (Saharanpur or Gautam Buddha
              Nagar). Stamp duty and registration fees are calculated based on
              these rates, whether you are buying in{" "}
              <strong>Saharanpur Tehsils</strong> or{" "}
              <strong>Noida Authority Sectors</strong>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 underline decoration-blue-500 decoration-2 underline-offset-4">
              2025 Market Trends
            </h3>
            <p className="text-sm leading-relaxed">
              Our directory helps investors compare government circle rates with
              actual market prices. With the <strong>Jewar Airport</strong>{" "}
              development, Noida rates are seeing high volatility, while
              Saharanpur remains a steady market for residential and commercial
              plots.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-20 pt-10 border-t border-gray-200">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">
            Browse All Localities
          </h3>
          <p className="text-sm text-gray-500">
            Direct access to all Saharanpur and Noida area data
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-h-[300px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-300">
          {localities.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locality/${loc.slug}`}
              className="text-xs text-slate-600 bg-slate-100 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium border border-transparent hover:border-blue-200"
            >
              {loc.name} {loc.tehsil ? `(${loc.tehsil})` : ""}
            </Link>
          ))}
        </div>
      </footer>

      {/* ✅ CORRECT POSITION: Script is now at the very bottom */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
