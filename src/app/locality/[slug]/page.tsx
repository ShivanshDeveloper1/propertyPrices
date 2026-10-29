// app/locality/[slug]/page.tsx
import LocalityClient from "@/components/locality/LocalityClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import RelatedLocalities from "@/components/locality/(Relatedlocalitie)/RelatedLocalities";
import { getLocalityBySlug, getAllLocalitySummaries } from "@/lib/db/localities";
import {
  absoluteUrl,
  districtShort,
  districtHindi,
  isSaharanpur,
  formatInr,
  formatDateIN,
  OFFICIAL_PORTAL_URL,
  SITE_NAME,
} from "@/lib/seo";

// Unknown slugs get a genuine 404 from the router (root loading.tsx would otherwise stream a 200).
// New localities appear after the next build/revalidation.
export const dynamicParams = false;
export const revalidate = 3600;

// 1. STATIC PARAMS (all localities straight from the DB)
export async function generateStaticParams() {
  // Let DB errors fail the build rather than silently producing zero pages.
  const all = await getAllLocalitySummaries();
  return all.filter((loc) => loc.slug).map((loc) => ({ slug: loc.slug }));
}

// 2. METADATA
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locality = await getLocalityBySlug(slug);

  if (!locality) {
    return { title: "Locality Not Found", robots: { index: false, follow: false } };
  }

  const district = districtShort(locality.district);
  const districtHi = districtHindi(locality.district);
  const hindiName = locality.name1 ? ` (${locality.name1})` : "";
  const locationText = locality.tehsil
    ? `${locality.name}, ${locality.tehsil}, ${district}`
    : `${locality.name}, ${district}`;
  const rate = formatInr(locality.residential_plot_govt);
  const effective = formatDateIN(locality.sro_date);

  const title = `${locality.name} Circle Rate${hindiName} – ${district} Govt Property Rate`;
  const description =
    `${locality.name}${hindiName}, ${locationText}: ` +
    (rate ? `government circle rate for residential plot ${rate} per sq m` : "government circle rates") +
    (effective ? ` (effective ${effective}). ` : ". ") +
    `${locality.name} ${districtHi ? districtHi + " " : ""}सर्किल रेट – circle rate, not market price. Check source and how to verify.`;

  const url = absoluteUrl(`/locality/${locality.slug}`);
  // Only Saharanpur localities are intended for indexing on this site.
  const indexable = isSaharanpur(locality.district);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: absoluteUrl("/main.png"),
          width: 1200,
          height: 630,
          alt: `Circle rate in ${locality.name}, ${district}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/main.png")],
    },
  };
}

// 3. MAIN PAGE COMPONENT
export default async function LocalityPage({ params }) {
  const { slug } = await params;
  const locality = await getLocalityBySlug(slug);

  if (!locality) return notFound();

  const district = districtShort(locality.district);
  const districtHi = districtHindi(locality.district);
  const effective = formatDateIN(locality.sro_date);
  const url = absoluteUrl(`/locality/${locality.slug}`);

  // Only real, positive numeric rates are listed.
  const rateRows = [
    { label: "Residential plot (आवासीय भूखंड)", value: locality.residential_plot_govt },
    { label: "Residential house/building (आवासीय भवन)", value: locality.residential_house_govt },
    { label: "Commercial shop – local road (दुकान)", value: locality.commercial_shop_local_govt },
    { label: "Commercial shop – main road (मुख्य मार्ग दुकान)", value: locality.commercial_shop_main_govt },
  ]
    .map((r) => ({ ...r, formatted: formatInr(r.value) }))
    .filter((r) => r.formatted);

  const plotRate = formatInr(locality.residential_plot_govt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: `${locality.name} circle rate`, item: url },
        ],
      },
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: `${locality.name} circle rate, ${district}`,
        inLanguage: "en-IN",
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
        ...(locality.sro_date ? { dateModified: locality.sro_date } : {}),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{locality.name}</span>
        </nav>

        <div className="mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  {district} Circle Rate Data
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-0.5">
                  Circle Rate in {locality.name}
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  Government circle rate vs market price for{" "}
                  {locality.tehsil ? `${locality.tehsil}, ` : ""}
                  {district}.
                </p>
              </div>

              <div className="flex gap-2 flex-wrap md:self-center">
                {effective && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    Rates effective {effective}
                  </span>
                )}
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  Govt circle rate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Direct answer (server-rendered, crawlable) */}
        <section className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            What is the government rate in {locality.name}, {district}?
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {plotRate ? (
              <>
                The recorded government circle rate for a <strong>residential plot</strong> in{" "}
                {locality.name}
                {locality.tehsil ? ` (${locality.tehsil})` : ""}, {district} is{" "}
                <strong>{plotRate} per square metre</strong>
                {effective ? <>, effective from {effective}</> : null}. This is the
                government circle rate used as a minimum valuation reference, not the actual
                market price.
              </>
            ) : (
              <>Circle rate details for {locality.name} are listed below where available.</>
            )}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mt-2" lang="hi">
            {districtHi || district} के {locality.name1 || locality.name} क्षेत्र में
            {plotRate ? <> आवासीय भूखंड का सर्किल रेट <strong>{plotRate} प्रति वर्ग मीटर</strong> दर्ज है।</> : <> सर्किल रेट नीचे दिए गए हैं।</>}{" "}
            यह सरकारी सर्किल रेट है, बाजार भाव नहीं।
          </p>

          {rateRows.length > 0 && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm text-left border border-gray-100">
                <caption className="sr-only">
                  Government circle rates in {locality.name}, per square metre
                </caption>
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-semibold">Property category</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Govt circle rate (per sq m)</th>
                  </tr>
                </thead>
                <tbody>
                  {rateRows.map((r) => (
                    <tr key={r.label} className="border-t border-gray-100">
                      <th scope="row" className="px-3 py-2 font-medium text-gray-800">{r.label}</th>
                      <td className="px-3 py-2 text-gray-900">{r.formatted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Client Interactions (existing UI) */}
        <LocalityClient slug={slug} initialData={locality} />

        {/* Trust, source and verification */}
        <section className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Source, verification and how to read this rate
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>
              <strong>Circle rate vs market rate:</strong> a circle rate is the minimum
              valuation notified by the government for registration. Actual market prices can
              be higher or lower. Market figures shown on this site, where present, are
              estimates and not official rates.
            </li>
            <li>
              <strong>Rates can vary</strong> within a locality by property category, road
              width or other conditions in the official document. Check the applicable
              category before relying on a figure.
            </li>
            <li>
              <strong>How to verify:</strong> find &quot;{locality.name}
              {locality.name1 ? ` / ${locality.name1}` : ""}&quot; in the official circle-rate
              list for {district} (tehsil{locality.tehsil ? `: ${locality.tehsil}` : ""}), or
              confirm with the local Sub-Registrar office. Official portal:{" "}
              <a
                href={OFFICIAL_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                igrsup.gov.in
              </a>
              .
            </li>
            <li>
              Circle-rate schedule date on record: {effective || "not available"}. Rates are
              shown as stored in this site&apos;s database; confirm against the official
              document before any transaction.
            </li>
          </ul>
          <p className="text-sm mt-4">
            <Link href="/download-circle-rate" className="text-blue-600 underline">
              Download circle rate list (PDF)
            </Link>
            {" · "}
            <Link href="/guide/saharanpur-circle-rate" className="text-blue-600 underline">
              How circle rates work (हिंदी + English)
            </Link>
            {" · "}
            <Link href="/disclaimer" className="text-blue-600 underline">
              Disclaimer
            </Link>
          </p>
        </section>

        {/* Related Localities & Internal Property Links */}
        <section className="mt-12 border-t border-gray-100 pt-8 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Nearby Real Estate</h2>
          <p className="text-sm text-gray-500 mb-6">
            Compare land valuations in adjacent neighborhoods or view available property
            listings around this area.
          </p>
          <RelatedLocalities currentSlug={slug} currentCity={locality.tehsil || "Saharanpur"} />
        </section>
      </main>
    </>
  );
}
