import Link from 'next/link';

export default function TermsAndConditions() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white text-black antialiased selection:bg-black selection:text-white">
      <main className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
        
        {/* Header */}
        <header className="border-b border-black pb-8 mb-12">
          <h1 className="text-4xl font-bold tracking-tight uppercase sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-sm tracking-widest uppercase opacity-60">
            Agreement & User Rules
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10 text-base leading-relaxed font-normal">
          <section>
            <p>
              Welcome to <strong>saharanpurprice.in</strong>. By accessing and browsing this website, you agree to comply with and be bound by the following terms and conditions of use, which govern our relationship with you in relation to this website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              1. Permitted Use of Information
            </h2>
            <p>
              The real estate valuation data and circle rates provided on this website are exclusively for your personal, non-commercial informational use. You must not use this website or its data for speculative commercial operations without verifying data independently.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              2. Data Scraping & Automated Access
            </h2>
            <p>
              Automated data extraction—including scraping, crawling, harvesting, or using bots to copy property pricing lists from our platform—is strictly prohibited. You agree not to attempt to disrupt the performance or integrity of our website servers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              3. Verification Requirement
            </h2>
            <p>
              As outlined in our Disclaimer, all data is mirrored from public government documents. You acknowledge that real estate pricing updates might experience lags. By continuing to use the site, you agree that you hold the sole responsibility to cross-verify listed prices with official regional land registries before acting on the information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              4. Intellectual Property
            </h2>
            <p>
              This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, structural compilation of public data, and code graphics. Reproduction is prohibited other than in accordance with standard copyright laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              5. Governing Law
            </h2>
            <p>
              Your use of this website and any dispute arising out of such use of the website is subject to the applicable regional and national laws of India.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <footer className="mt-20 border-t border-black pt-8 flex justify-between text-xs uppercase tracking-wider opacity-60">
          <Link href="/" className="hover:underline">
            ← Back to Home
          </Link>
          <span>© {currentYear} saharanpurprice.in</span>
        </footer>
        
      </main>
    </div>
  );
}