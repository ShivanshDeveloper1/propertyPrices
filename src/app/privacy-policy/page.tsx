import Link from 'next/link';

export default function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white text-black antialiased selection:bg-black selection:text-white">
      <main className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
        
        {/* Header */}
        <header className="border-b border-black pb-8 mb-12">
          <h1 className="text-4xl font-bold tracking-tight uppercase sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm tracking-widest uppercase opacity-60">
            Last Updated: July 2026
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10 text-base leading-relaxed font-normal">
          <section>
            <p>
              At <strong>saharanpurprice.in</strong>, we prioritize the privacy of our visitors. This Privacy Policy document outlines the types of personal information that is received and collected by our platform and how it is used.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              1. Information Collection and Use
            </h2>
            <p>
              We may collect routine log files when you access our website. This includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and the number of clicks. This data is used solely to analyze trends, administer the site, track user movement around the site, and gather demographic information. IP addresses and other such information are not linked to any information that is personally identifiable.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              2. Cookies and Web Beacons
            </h2>
            <p>
              Our website uses cookies to store information about visitors' preferences, to record user-specific information on which pages the user accesses or visits, and to personalize or customize our web page content based upon visitors' browser type or other information that the visitor sends via their browser.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              3. Third-Party Links
            </h2>
            <p>
              Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We, therefore, have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              4. Consent
            </h2>
            <p>
              By using our website, you hereby consent to our privacy policy and agree to its terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              5. Contact Information
            </h2>
            <p>
              If you require any more information or have any questions about our privacy policy, please feel free to contact us via email or our primary contact channels listed on our homepage.
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