// src/app/properties/page.tsx

import { getAllProperties } from "@/actions/(admin)/getPropertie/properties";
import ClientPropertySearch from "@/components/(properties)/ClientPropertySearch";

// 🔥 1. CACHING: This caches the page and data for 1 hour (3600 seconds)
export const revalidate = 3600; 

// 🚀 2. SEO OPTIMIZATION: This metadata helps you rank in your target regions
export const metadata = {
  title: "Properties in Saharanpur | Buy & Rent",
  description: "Find the best residential and commercial properties for sale and rent in Saharanpur. Connect with verified agents.",
  keywords: ["Real estate Saharanpur", "buy house Saharanpur", "properties for rent", "dealer Saharanpur"],
};

export default async function Page() {
  // 3. FETCH ON SERVER: We fetch the data here before the page even loads
  const dbProperties = await getAllProperties();

  return (
    // 4. PASS DATA TO CLIENT: Send the cached data to your interactive UI
    <ClientPropertySearch initialProperties={dbProperties} />
  );
}