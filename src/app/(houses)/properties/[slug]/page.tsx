import { TiTick } from "react-icons/ti";
import React from "react";
import Image from "next/image";
import { FaLocationDot, FaBath, FaBed, FaRulerCombined } from "react-icons/fa6";
import Link from "next/link";
import { getParticularData } from "@/actions/(admin)/getPropertie/properties";
import { notFound } from "next/navigation";

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const prop = await getParticularData(slug);

  if (!prop) {
    return { title: "Property Not Found | Real Estate" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://saharanpurprice.in";
  const displayTitle = `${prop.title} for ${prop.type || "Sale"} in ${prop.locality}, ${prop.city}`;
  const displayDesc = prop.description?.slice(0, 155) || `Premium real estate opportunity in ${prop.locality}, ${prop.city}. View pricing, images, and amenities.`;

  return {
    title: displayTitle,
    description: displayDesc,
    alternates: {
      canonical: `${siteUrl}/properties/${slug}`,
    },
    openGraph: {
      title: displayTitle,
      description: displayDesc,
      url: `${siteUrl}/properties/${slug}`,
      images: prop.images?.[0] ? [{ url: prop.images[0] }] : [],
      type: "website",
    },
  };
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  // 1. Fetch data
  const prop = await getParticularData(slug);

  // 2. Handle 404
  if (!prop) {
    notFound();
  }

  // Helper for image paths
  const getImgSrc = (img: string) =>
    img?.startsWith("http") ? img : `/${img}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": prop.title,
    "description": prop.description || "",
    "image": prop.images?.map((img: string) => getImgSrc(img)) || [],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": prop.locality,
      "addressRegion": prop.city,
      "streetAddress": prop.address
    },
    "offers": {
      "@type": "Offer",
      "price": prop.price,
      "priceCurrency": "INR"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto w-full space-y-6">
          {/* Header Section */}
          <section className="p-6 rounded-2xl border border-gray-100 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                {prop.type && (
                  <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full px-4 py-1.5">
                    {prop.type}
                  </span>
                )}
                <h1 className="text-2xl md:text-4xl font-bold mt-4 text-gray-900">
                  {prop.title}
                </h1>
                <p className="text-gray-500 flex items-center gap-1 mt-2">
                  <FaLocationDot className="text-blue-600" />
                  {prop.locality}, {prop.city}
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-extrabold text-blue-600">
                  ₹{(prop.price / 100000).toFixed(1)}L
                </p>
                <p className="text-sm text-gray-400">Total Price</p>
              </div>
            </div>

            {/* Feature Icons - Render only if value exists */}
            <div className="flex flex-wrap gap-6 text-gray-600 mt-8 pt-6 border-t border-gray-100">
              {prop.bathrooms && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FaBath className="text-blue-600" />
                  </div>
                  <span className="font-medium text-sm md:text-base">
                    {prop.bathrooms} Bathrooms
                  </span>
                </div>
              )}

              {prop.bedrooms && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FaBed className="text-blue-600" />
                  </div>
                  <span className="font-medium text-sm md:text-base">
                    {prop.bedrooms} Bedrooms
                  </span>
                </div>
              )}

              {prop.area && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FaRulerCombined className="text-blue-600" />
                  </div>
                  <span className="font-medium text-sm md:text-base">
                    {prop.area} sq.ft
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Hero Image Section */}
          {prop.images?.[0] && (
            <section className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg border-4 border-white">
              <Image
                src={getImgSrc(prop.images[0])}
                alt={prop.title || "Property"}
                fill
                priority
                className="object-cover"
              />
            </section>
          )}

          {/* Description Section - Optional */}
          {prop.description && (
            <section className="p-6 rounded-2xl border border-gray-100 bg-white">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{prop.description}</p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition">
                Book Now
              </button>
            </section>
          )}

          {/* Property Details Table */}
          <section className="flex flex-col space-y-4 divide-y p-4 bg-white rounded-2xl border border-gray-100">
            {prop.area && (
              <div className="flex items-center justify-between p-2">
                <p className="text-gray-500">Size</p>
                <p className="font-semibold">{prop.area} sq.ft</p>
              </div>
            )}
            {prop.builtYear && (
              <div className="flex items-center justify-between p-2">
                <p className="text-gray-500">Built Year</p>
                <p className="font-semibold">{prop.builtYear}</p>
              </div>
            )}
            <div className="flex items-center justify-between p-2">
              <p className="text-gray-500">Status</p>
              <p className="font-semibold uppercase text-green-600">
                {prop.status || "Available"}
              </p>
            </div>
            {prop.address && (
              <div className="flex items-center justify-between p-2">
                <p className="text-gray-500">Address</p>
                <p className="font-semibold">{prop.address}</p>
              </div>
            )}
          </section>

          {/* Image Collection - Optional */}
          {prop.images && prop.images.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prop.images.map((img: string, idx: number) => (
                <div key={idx} className="relative h-80 w-full">
                  <Image
                    src={getImgSrc(img)}
                    alt={`${prop.title} ${idx}`}
                    className="object-cover rounded-xl object-center"
                    fill
                  />
                </div>
              ))}
            </section>
          )}

          {/* Amenities Section - Optional */}
          {prop.amenities && prop.amenities.length > 0 && (
            <section className="flex flex-col md:flex-row max-w-5xl bg-white rounded-2xl border border-gray-100 justify-between p-8 mt-12">
              <p className="text-2xl font-bold tracking-wide mb-6 md:mb-0">
                Amenities Included
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                {prop.amenities.map((item: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 font-semibold text-lg text-gray-700"
                  >
                    <TiTick className="text-blue-600 text-2xl" /> {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* CTA Section */}
          <section className="rounded-2xl shadow-md flex flex-col space-y-6 bg-blue-600 w-full px-6 py-16 items-center justify-center text-white">
            <p className="text-xl font-medium opacity-90">Want to Book a Call?</p>
            <p className="text-3xl md:text-4xl tracking-wide text-center font-bold leading-tight">
              Ready to make your step in real <br /> estate? Book Now.
            </p>
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </main>
    </>
  );
};

export default Page;