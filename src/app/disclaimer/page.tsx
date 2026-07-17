import Link from 'next/link';

export default function Disclaimer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white text-black antialiased selection:bg-black selection:text-white">
      <main className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
        
        {/* Header */}
        <header className="border-b border-black pb-8 mb-12">
          <h1 className="text-4xl font-bold tracking-tight uppercase sm:text-5xl">
            Disclaimer
          </h1>
          <p className="mt-4 text-sm tracking-widest uppercase opacity-60">
            Legal Notice & Terms of Use
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10 text-base leading-relaxed font-normal">
          
          {/* Important Highlighted Section */}
          <section className="bg-black text-white p-6 my-8 font-medium border border-black">
            <p className="text-sm uppercase tracking-widest mb-2 opacity-80 font-bold">
              Critical Notice Regarding Property Pricing:
            </p>
            <p>
              All property values, circle rates, and pricing data displayed on <strong>saharanpurprice.in</strong> are compiled and extracted directly from official government documents and public records. While we make every attempt to mirror this data accurately, these figures are for informational purposes only. You are strictly advised to independently recheck and verify all pricing with the competent local authorities or registry offices before making financial or legal commitments.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              1. General Information Only
            </h2>
            <p>
              The information contained on this website is for general information purposes only. The information is provided by <strong>saharanpurprice.in</strong> and while we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              2. No Professional Advice
            </h2>
            <p>
              The real estate market is subject to constant regulatory, financial, and legal shifts. Any reliance you place on the information found on this platform is strictly at your own risk. This website does not constitute legal, financial, or professional real estate brokerage advice. 
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              3. Limitation of Liability
            </h2>
            <p>
              In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide border-l-4 border-black pl-3">
              4. External Variations
            </h2>
            <p>
              Through this website, you may be able to link to other websites which are not under the control of saharanpurprice.in. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
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