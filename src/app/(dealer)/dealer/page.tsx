import { connectDB } from "@/lib/mongodb";
import { Dealers } from "@/models/Dealer/dealer";
import AgentCard from "@/components/(dealer)/AgentCard";
import Accordian from "@/components/home/Accordian";
import { questions } from "@/data/Dealer";
import Script from "next/script";

export const revalidate = 3600;

// Optimized static metadata with OpenGraph support
export const metadata = {
  title: "Top Property Dealers & Real Estate Agents in Saharanpur",
  description: "Connect with the best verified residential and commercial property dealers in Saharanpur. Find houses, plots, and commercial spaces for sale or rent.",
  keywords: [
    "Real estate Saharanpur", 
    "Property dealers in Saharanpur", 
    "Saharnpur real estate agents", 
    "buy house Saharanpur", 
    "properties for rent Saharanpur", 
    "best property dealer Saharanpur"
  ],
  openGraph: {
    title: "Top Property Dealers & Real Estate Agents in Saharanpur",
    description: "Connect with verified residential and commercial property dealers in Saharanpur.",
    type: "website",
    locale: "en_IN",
  }
};

export default async function AgentsPage() {
  await connectDB();

  // Fetch dealers from DB
  const dealers = await Dealers.find({}).lean();

  const formattedDealers = dealers.map((dealer: any) => ({
    ...dealer,
    _id: dealer._id.toString()
  }));

  // Generate Structured Data for Google (Schema.org)
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Local Business / Real Estate Directory Schema
  // Inside your AgentsPage component:
      {
        "@type": "ItemList",
        "name": "Property Dealers in Saharanpur",
        "description": "List of top verified real estate agents and property dealers in Saharanpur.",
        "itemListElement": formattedDealers.map((dealer: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "RealEstateAgent",
            "name": dealer.name || "Real Estate Agent",
            "image": dealer.image || "",
            "telephone": dealer.phone || "",
            "url": `https://yourwebsite.com/dealer/${dealer.slug}`, // <-- ADD THIS LINE
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Saharanpur",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "IN"
            }
          }
        }))
      },
      // 2. FAQ Schema for your Accordion
      {
        "@type": "FAQPage",
        "mainEntity": questions.map((q: any) => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      {/* Injecting Structured Data into the Head */}
      <Script
        id="structured-data-dealers"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

     <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16 flex flex-col items-center">
        <span className="px-4 py-1.5 mb-6 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
          Agents
        </span>

        <h1 className="text-4xl md:text-6xl font-medium text-gray-900 tracking-tight leading-[1.1] max-w-3xl">
          Meet our exceptional agents for a{" "}
          <span className="text-blue-600">seamless</span> experience
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {formattedDealers.map((dealer: any) => (
          <AgentCard
            key={dealer._id}
            agent={dealer}
          />
        ))}
      </div>

      <Accordian questions={questions} className="mt-12" />
    </main>
    </>
  );
}






  