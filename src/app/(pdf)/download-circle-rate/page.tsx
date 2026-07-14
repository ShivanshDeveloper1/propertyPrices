// app/property-rate-list/page.tsx
import RateListForm from '@/components/(Pdf)/RateListForm';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Saharanpur Property Circle Rate List 2025-26 | Most Trusted Dealer',
  description: 'Download the official property circle rate list for Saharanpur and all Uttar Pradesh districts. Provided by Saharanpur’s most trusted property dealer.',
  keywords: ['Saharanpur property rates', 'circle rate Saharanpur', 'UP property rate list PDF', 'Saharanpur real estate'],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://saharanpurprice.in/download-circle-rate',
  }
};

export default function RateListPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Branding Section */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Saharanpur <span className="text-blue-600">Most Trusted</span> Property Dealer
          </h1>
          <p className="text-lg text-slate-600">आधिकारिक संपत्ति दर सूची (Circle Rate) यहाँ से डाउनलोड करें</p>
        </header>

        {/* Client Component for the Form */}
        <RateListForm />
        
        {/* Hidden SEO Content for Crawlers */}
        <div className="mt-20 opacity-50 text-xs leading-relaxed">
          <p>This directory provides detailed land rates for Ganpati Vihar, Saharanpur, and other major localities...</p>
        </div>
      </div>
    </div>
  );
}