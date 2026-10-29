// Shared SEO helpers. Single source of truth for the canonical host.
// NOTE: production env uses the non-www host; make sure www -> non-www redirects at hosting level.
export const SITE_URL = "https://saharanpurprice.in";
export const SITE_NAME = "Saharanpur Price";
export const OFFICIAL_PORTAL_URL = "https://igrsup.gov.in";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// District helpers. Names come straight from the stored `district` field.
export function districtShort(district?: string) {
  return (district || "Saharanpur").split(",")[0].trim();
}

const HINDI_DISTRICTS: Record<string, string> = {
  Saharanpur: "सहारनपुर",
  "Gautam Buddha Nagar": "गौतम बुद्ध नगर",
};

export function districtHindi(district?: string) {
  return HINDI_DISTRICTS[districtShort(district)] || "";
}

export function isSaharanpur(district?: string) {
  return /saharanpur/i.test(district || "");
}

export function formatInr(n?: number | null) {
  return typeof n === "number" && n > 0 ? `₹${n.toLocaleString("en-IN")}` : null;
}

export function formatDateIN(d?: string | Date | null) {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
