// app/locality/[slug]/page.jsx
import LocalityClient from "@/components/locality/LocalityClient";
import { notFound } from "next/navigation";
import Link from "next/link";

// 1. DATA FETCHING (Cached for 1 hour)
async function getLocality(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/localities/${slug}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

// 2. STATIC PARAMS
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/localities`
    );
    const localities = await res.json();
    return localities.map((loc) => ({ slug: loc.slug }));
  } catch (error) {
    console.error("Error generating params:", error);
    return [];
  }
}

// 3. METADATA
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const locality = await getLocality(slug);
  if (!locality) return { title: "Locality Not Found" };

  const priceText = locality.residential_plot_govt
    ? `Govt Rate: ₹${locality.residential_plot_govt}/sqm`
    : "Check Rates";

  const locationText = locality.tehsil
    ? `${locality.name}, ${locality.tehsil}, Saharanpur`
    : `${locality.name}, Saharanpur`;

  return {
    title: `Property Rates in ${locationText}, Saharanpur | Govt & Market Price`,
    description: `Official Government Circle Rates and Market Value for ${locality.name}, Saharanpur. ${priceText}. Residential & Commercial land prices updated.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/locality/${locality.slug}`,
    },
  };
}

// 4. MAIN PAGE COMPONENT
export default async function LocalityPage({ params }) {
  const { slug } = await params;

  const locality = await getLocality(slug);

  if (!locality) return notFound();

  const currentYear = new Date().getFullYear();
  const govtRate = locality.residential_plot_govt || "N/A";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: process.env.NEXT_PUBLIC_APP_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: locality.name,
            item: `${process.env.NEXT_PUBLIC_APP_URL}/locality/${locality.slug}`,
          },
        ],
      },
      {
        "@type": "Place",
        name: locality.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: locality.tehsil || "Saharanpur",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: locality.lat || "29.9640",
          longitude: locality.lng || "77.5460",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the government circle rate in ${locality.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `As of ${currentYear}, the government circle rate for residential land in ${locality.name} is ₹${govtRate} per square meter.`,
            },
          },
          {
            "@type": "Question",
            name: `Is property in ${locality.name} expensive?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Properties in ${locality.name} vary by location. While the government rate is ₹${govtRate}, market rates can be higher depending on proximity to main roads.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Added 'text-center' to main container */}
      <main className="container mx-auto px-4 py-8 max-w-5xl text-center">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4">
            Property Rates & Plots in{" "}
            <span className="text-blue-600">{locality.name}</span>
          </h1>

          {/* ✅ FIXED: Added 'mx-auto' to center the paragraph block */}
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto text-center">
            Find the latest{" "}
            <strong>{currentYear} official government circle rates</strong>{" "}
            (IGRS UP) compared with real-time <strong>market prices</strong> for{" "}
            {locality.name},{locality.tehsil ? `${locality.tehsil}, ` : ""}{" "}
            {locality.district}. Whether you are looking for residential plots
            or commercial shops, this directory helps you calculate the correct
            stamp duty.
          </p>

          <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-2 inline-block rounded">
            Source: Data derived from{" "}
            <a
              href="https://igrsup.gov.in"
              target="_blank"
              rel="nofollow noopener"
              className="text-blue-600 hover:underline"
            >
              IGRS UP Official Website
            </a>{" "}
            and local market surveys.
          </div>
        </div>

        <LocalityClient slug={slug} initialData={locality} />
      </main>
    </>
  );
}
