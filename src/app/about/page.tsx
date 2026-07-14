import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Saharanpur Price",
  description:
    "Learn about Saharanpur Price, the leading platform for real estate market trends, property rates, and investment insights in Saharanpur.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
            About Saharanpur Price
          </h1>
          <p className="text-lg text-gray-400">
            Decoding the Real Estate Market of Saharanpur, One Insight at a
            Time.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-[#111827] p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            Buying property is one of the biggest financial decisions you will
            ever make. Unfortunately, the real estate market in Saharanpur is
            often opaque, with fluctuating rates and unverified information.
            <br />
            <br />
            <strong>Saharanpur Price</strong> was built to solve this. Our
            mission is to bring{" "}
            <strong>transparency, accuracy, and data-driven insights</strong> to
            the local property market. We help buyers, sellers, and investors
            make informed decisions by tracking daily market trends and official
            government evaluations.
          </p>
        </section>

        {/* Who We Are */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Who We Are</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            We are a team of local real estate enthusiasts and data analysts
            passionate about the development of Saharanpur. We are not brokers;
            we are an <strong>independent information directory</strong>.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>We track official circle rates.</li>
            <li>We analyze market fluctuations (Winter/Summer trends).</li>
            <li>We provide unbiased area reviews.</li>
          </ul>
        </section>

        {/* Disclaimer for YMYL (Important for Google) */}
        <section className="bg-red-900/10 border border-red-900/30 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-red-200 mb-2">
            Editorial Disclaimer
          </h3>
          <p className="text-sm text-red-100/70">
            The information provided on Saharanpur Price is for educational and
            informational purposes only. While we strive for accuracy, real
            estate prices are subject to market volatility. We recommend
            consulting with a certified legal advisor before finalizing any
            financial transaction.
          </p>
        </section>

        {/* Contact Info (Builds Trust) */}
        <section className="text-center pt-8 border-t border-gray-800">
          <h2 className="text-xl font-bold text-white mb-2">Have Questions?</h2>
          <p className="text-gray-400 mb-4">
            Spot an error or want to contribute a local insight? Reach out to
            us.
          </p>
          <a
            href="mailto:contact@saharanpurprice.in"
            className="text-cyan-400 hover:underline"
          >
            shivanshsingh4539@gmail.com
          </a>
        </section>
      </div>
    </main>
  );
}
