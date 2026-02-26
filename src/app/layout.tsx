// @ts-nocheck
import Link from "next/link";
import { MapPin, Home } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

// SEO & Accessibility Component Imports
import WhatsAppButton from "@/components/common/WhatsAppButton";
import Footer from "@/components/Footer";
import Header from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- GOOGLE ANALYTICS MEASUREMENT ID ---
const GA_MEASUREMENT_ID = "G-DG77CVN1ZL";

// --- SEO & Metadata ---
export const metadata = {
  title: "Property Rates in Saharanpur & Noida | Official Circle Rates 2025",
  description:
    "Check the latest official government circle rates and market prices for Saharanpur localities and Noida YEIDA sectors. Verified land prices for residential and commercial properties updated for 2025.",

  verification: {
    google: "8znMG7RQBuQbkN2jM-G-NWUm009imkfy6cFdNNpFsig",
  },

  // ✅ ADDED: AdSense Meta Tag Verification
  other: {
    "google-adsense-account": "ca-pub-2875801869279043",
  },

  // ✅ NEW ADDITION FOR GOOGLE DISCOVER
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large", // Crucial for Discover
    "max-snippet": -1,
    "max-video-preview": -1,
  },

  keywords: [
    // Top Performing Saharanpur Keywords
    "Saharanpur property rates",
    "circle rate saharanpur 2025",
    "saharanpur property market",
    "land prices Saharanpur",
    "saharanpur circle rate",
    "circle rate saharanpur",

    // Noida & Jewar Keywords
    "Noida circle rates 2025",
    "YEIDA sector 18 circle rate",
    "Jewar airport land prices",
    "Noida Authority allotted plots",
    "Greater Noida West property rates",
    "UP government circle rates 2025",

    // Broad Keywords
    "government circle rates",
    "market value property",
    "residential plots",
    "commercial shops",
  ],
  metadataBase: new URL("https://saharanpurprice.in"),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Property Rates in Saharanpur & Noida | Govt & Market Prices",
    description:
      "Official government and market property rates in Saharanpur and Noida Sectors.",
    url: "https://saharanpurprice.in",
    type: "website",
    locale: "en_IN",
    siteName: "Saharanpur Price",
    images: [
      {
        url: "/main.png",
        width: 1200,
        height: 630,
        alt: "Saharanpur and Noida Property Rates Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Rates in Saharanpur & Noida | Circle Rates 2025",
    description:
      "Verified directory for government and market property rates in Saharanpur and Noida.",
    images: ["/twitter-image.png"],
  },
};

// ------------------ ROOT LAYOUT ------------------
type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Saharanpur Price Directory",
    url: "https://saharanpurprice.in",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://saharanpurprice.in?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="sitemap"
          type="application/xml"
          href="https://saharanpurprice.in/sitemap.xml"
        />
        <link rel="icon" href="/icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ✅ FIXED: Script moved to body to prevent hydration errors */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2875801869279043"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton phoneNumber="917618550475" />
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
