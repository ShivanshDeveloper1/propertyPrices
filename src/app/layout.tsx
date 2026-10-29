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
import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import AdPopup from "@/components/AdPopup";
import FooterWrapper from "@/components/FooterWrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- GOOGLE ANALYTICS MEASUREMENT ID ---
const GA_MEASUREMENT_ID = "G-DG77CVN1ZL";

// --- SEO & Metadata ---
export const metadata = {
  title: "Saharanpur Property Rates | Government Circle Rate List by Locality (सर्किल रेट)",
  description:
    "Locality-wise government circle rates for Saharanpur, Uttar Pradesh – residential and commercial land rates per sq m, with source and how to verify. सहारनपुर सर्किल रेट लिस्ट।",

  verification: {
    google: "8znMG7RQBuQbkN2jM-G-NWUm009imkfy6cFdNNpFsig",
  },

  // ✅ ADDED: AdSense Meta Tag Verification


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
    "saharanpur circle rate list 2026",
    "saharanpur circle rate 2025 pdf download",
    "सर्किल रेट लिस्ट सहारनपुर 2025",
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
  alternates: { canonical: "/" },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Saharanpur Property Rates | Government Circle Rates by Locality",
    description:
      "Locality-wise government circle rates for Saharanpur, Uttar Pradesh.",

    url: "https://saharanpurprice.in/",


    type: "website",


    locale: "en_IN",


    siteName: "Saharanpur Price" ,
    images:    [
      {
        url: "/main.png",
        width: 1200,
        height: 630,
        alt: "Saharanpur property circle rates directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saharanpur Property Rates | Government Circle Rates by Locality",
    description:
      "Locality-wise government circle rates for Saharanpur, Uttar Pradesh.",
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
    name: "Saharanpur Price",
    url: "https://saharanpurprice.in",
    inLanguage: "en-IN",
  };

  return (
    <html lang="en">
      <AuthProvider>
      <head>
        <link
          rel="sitemap"
          type="application/xml"
          href="https://saharanpurprice.in/sitemap.xml"
        />
        <link rel="icon" href="/icon.png" />

     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5062053966154652"
     crossorigin="anonymous"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ✅ FIXED: Script moved to body to prevent hydration errors */}
       

        <NavbarWrapper />
        <main className="flex-1">{children}</main>
        {/* ADD THE POPUP HERE */}
        {/* <AdPopup /> */}
        <FooterWrapper />
        <WhatsAppButton phoneNumber="917618550475" />
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
      </AuthProvider>
    </html>
  );
           }
