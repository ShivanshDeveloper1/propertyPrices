// app/locality/[slug]/page.jsx
import LocalityClient from "@/components/locality/LocalityClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import RelatedLocalities from "@/components/locality/(Relatedlocalitie)/RelatedLocalities";

export const dynamicParams = true;

// 1. DATA FETCHING (Cached for 1 hour)
async function getLocality(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/localities/${slug}`,
      // { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

// 2. STATIC PARAMS
// 2. STATIC PARAMS
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/localities?limit=100`, // Added limit to get more slugs
    );
    const response = await res.json();

    // ✅ FIX: Access .data because the API returns an object, not an array
    const localities = response.data || [];

    return localities.map((loc) => ({
      slug: loc.slug,
    }));
  } catch (error) {
    console.error("Error generating params:", error);
    return [];
  }
}
// 3. METADATA
// 3. METADATA
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locality = await getLocality(slug);

  if (!locality) return { title: "Locality Not Found" };

  // FIX: Define baseUrl so the code doesn't crash
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.saharanpurprice.in";

  const locationText = locality.tehsil
    ? `${locality.name}, ${locality.tehsil}`
    : `${locality.name}`;

  const title = `Property Rates in ${locationText}, Saharanpur | Govt & Market Price`;
  const description = `Official Government Circle Rates for ${locality.name}, Saharanpur. Residential & Commercial land prices updated for ${new Date().getFullYear()}. Check ${locality.name} mein zameen ka rate.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/locality/${locality.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/locality/${locality.slug}`,
      siteName: 'https://www.saharanpurprice.in',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          // encodeURIComponent handles spaces in names like "Civil Lines"
          url: `${baseUrl}/api/og?name=${encodeURIComponent(locality.name)}`, 
          width: 1200,
          height: 630,
          alt: `Property rates in ${locality.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/api/og?name=${encodeURIComponent(locality.name)}`],
    },
  };
}



  // openGraph: {
  //   title: `Property Rates in ${locality.name}`,
  //   description: `Check latest govt and market rates for ${locality.name}.`,
  //   images: [`/api/og?name=${locality.name}`], // If you have a dynamic OG image route
  // },

  // what i tell where i place teach me 



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
        areaServed: {
          "@type": "City",
          name: "Saharanpur",
        },
        containedInPlace: {
          "@type": "City",
          name: "Saharanpur",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "p"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the circle rate in ${locality.name} in ${currentYear}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The government circle rate for residential land in ${locality.name}, Saharanpur is ₹${govtRate} per square meter according to official records.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the market price of property in ${locality.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Market prices in ${locality.name} may vary depending on road access, development level, and demand. In many cases market rates are higher than government circle rates.`,
            },
          },
          {
            "@type": "Question",
            name: `Is ${locality.name} a good place to buy property in Saharanpur?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${locality.name} is considered a developing area in Saharanpur with residential and commercial property opportunities depending on location and infrastructure.`,
            },
          },
          {
            "@type": "Question",
            name: `How is stamp duty calculated for property in ${locality.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Stamp duty in Uttar Pradesh is calculated based on the higher of the transaction value or the government circle rate determined for ${locality.name}.`,
            },
          },
          {
            "@type": "Question",
            name: `Saharanpur me property investment ke liye ${locality.name} kaisa area hai?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${locality.name} Saharanpur ka ek developing area hai jahan residential plots aur commercial properties available hain. Infrastructure aur road connectivity ke hisaab se yeh area property investment ke liye consider kiya ja sakta hai.`,
            },
          },
          {
            "@type": "Question",
            name: `Saharanpur me ghar ya plot kharidne ke liye ${locality.name} acha location hai kya?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${locality.name} Saharanpur ke popular residential areas me se ek hai. Yahan plots aur houses available hote hain aur government circle rate ke basis par property registration hota hai.`,
            },
          },
          {
            "@type": "Question",
            name: `${locality.name} Saharanpur me zameen ka rate kya hai?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${currentYear} me ${locality.name}, Saharanpur ka government circle rate residential land ke liye lagbhag ₹${govtRate} per square meter hai. Market rate location aur road connectivity ke hisaab se alag ho sakta hai.`,
            },
          },
        ],
      },
      {
        "@type": "Dataset",
        name: `Property Circle Rates for ${locality.name}`,
        description: `Government and market property valuation data for ${locality.name}, Saharanpur for the year ${currentYear}.`,
        license: "https://igrsup.gov.in",
        variableMeasured: "Price per Square Meter",
      },
    ],
  };

 return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          {/* Visible & Highly Optimized UI Headings instead of sr-only */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Saharanpur Land Registry Data
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-0.5">
                  Property Rates & Plots in {locality.name}
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  Official {currentYear} government circle rates vs market prices for {locality.tehsil ? `${locality.tehsil}, ` : ""}Saharanpur.
                </p>
              </div>

              <div className="flex gap-2 flex-wrap md:self-center">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  Updated {currentYear}
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  Verified Data
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Interactions */}
        <LocalityClient slug={slug} initialData={locality} />

        {/* Related Localities & Internal Property Links */}
        <section className="mt-12 border-t border-gray-100 pt-8 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Explore Nearby Real Estate
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Compare land valuations in adjacent neighborhoods or view available property listings around this area.
          </p>
          
          {/* Passed locality city/tehsil to optimize internal linking relationships */}
          <RelatedLocalities currentSlug={slug} currentCity={locality.tehsil || "Saharanpur"} />
        </section>
      </main>
    </>
  );
}