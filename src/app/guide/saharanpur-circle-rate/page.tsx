import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, OFFICIAL_PORTAL_URL } from "@/lib/seo";

const url = absoluteUrl("/guide/saharanpur-circle-rate");

export const metadata: Metadata = {
  title: "How Saharanpur Circle Rates Work & How to Verify Them | सर्किल रेट गाइड",
  description:
    "What a circle rate is, how it differs from market price, and how to find and verify a locality's rate in the official Saharanpur list. सर्किल रेट क्या है और कैसे जांचें।",
  alternates: { canonical: url },
  robots: { index: true, follow: true },
  openGraph: {
    title: "How Saharanpur Circle Rates Work & How to Verify Them",
    url,
    type: "website",
    locale: "en_IN",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Circle rate guide", item: url },
  ],
};

export default function CircleRateGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="container mx-auto px-4 py-8 max-w-3xl text-gray-800">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Circle rate guide</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Saharanpur Circle Rates: What They Are and How to Verify Them
        </h1>
        <p className="mb-6 leading-relaxed">
          A <strong>circle rate</strong> (सर्किल रेट) is the minimum land or property value
          notified by the state government for a locality. It is a reference used for
          property registration. It is not the same as the price at which a property actually
          sells in the market.
        </p>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Circle rate vs market rate</h2>
        <ul className="list-disc pl-5 space-y-2 leading-relaxed">
          <li>
            <strong>Circle rate:</strong> set by the government, differs by locality and by
            category (for example plot, house, shop) and sometimes by road width.
          </li>
          <li>
            <strong>Market rate:</strong> the price buyers and sellers actually agree on. It
            can be higher or lower than the circle rate.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">How to check your locality&apos;s rate</h2>
        <ol className="list-decimal pl-5 space-y-2 leading-relaxed">
          <li>Search for your locality on the <Link href="/" className="text-blue-600 underline">home page</Link> in English or Hindi.</li>
          <li>Open the locality page and note the category, rate, unit and effective date shown.</li>
          <li>
            Compare it with the official circle-rate list for Saharanpur. Find your locality
            (mohalla/village) name and the matching category.
          </li>
          <li>
            If anything differs, treat the official document or the local Sub-Registrar
            office as the final authority. Official portal:{" "}
            <a href={OFFICIAL_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              igrsup.gov.in
            </a>
            .
          </li>
        </ol>

        <section lang="hi" className="mt-10 border-t border-gray-100 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">सर्किल रेट कैसे जांचें</h2>
          <p className="leading-relaxed mb-3">
            सर्किल रेट सरकार द्वारा तय किया गया न्यूनतम मूल्य है, जो रजिस्ट्री के लिए संदर्भ के तौर
            पर इस्तेमाल होता है। यह बाजार भाव से अलग हो सकता है।
          </p>
          <ol className="list-decimal pl-5 space-y-2 leading-relaxed">
            <li>होम पेज पर अपने मोहल्ले या गांव का नाम हिंदी या अंग्रेजी में खोजें।</li>
            <li>उसके पेज पर श्रेणी, रेट, इकाई और लागू होने की तारीख देखें।</li>
            <li>इसे सहारनपुर की आधिकारिक सर्किल रेट सूची से मिलाएं।</li>
            <li>अंतर होने पर आधिकारिक दस्तावेज़ या स्थानीय सब-रजिस्ट्रार कार्यालय की जानकारी ही अंतिम मानें।</li>
          </ol>
        </section>

        <p className="mt-8 text-sm">
          <Link href="/download-circle-rate" className="text-blue-600 underline">Download circle rate list</Link>
          {" · "}
          <Link href="/disclaimer" className="text-blue-600 underline">Disclaimer</Link>
        </p>
      </main>
    </>
  );
}
