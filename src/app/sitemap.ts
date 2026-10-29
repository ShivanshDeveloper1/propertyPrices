import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getAllProperties } from "@/actions/(admin)/getPropertie/properties";
import { getAllLocalitySummaries } from "@/lib/db/localities";
import { SITE_URL, isSaharanpur } from "@/lib/seo";

export const revalidate = 43200; // Re-generates the sitemap every 12 hours

const getSafeDate = (dateInput?: string | Date | null) => {
  const date = new Date(dateInput as any);
  return isNaN(date.getTime()) ? undefined : date;
};

export default async function sitemap() {
  const baseUrl = SITE_URL;
  await connectDB();

  const [localities, blogs, properties] = await Promise.all([
    getAllLocalitySummaries(),
    Blog.find({}).select("slug updatedAt createdAt").lean().catch(() => [] as any[]),
    getAllProperties(),
  ]);

  // Only indexable (Saharanpur) localities; matches the page-level robots rule.
  const localityUrls = localities
    .filter((loc) => loc.slug && isSaharanpur(loc.district))
    .map((loc) => ({
      url: `${baseUrl}/locality/${loc.slug}`,
      lastModified: getSafeDate(loc.last_updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: getSafeDate(blog.updatedAt || blog.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const propertyUrls = properties.map((prop) => ({
    url: `${baseUrl}/properties/${prop.slug}`,
    lastModified: getSafeDate(prop.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Only routes that actually exist in the app.
  const staticUrls = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/download-circle-rate`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/guide/saharanpur-circle-rate`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/blogs`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/properties`, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/about`, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return [...staticUrls, ...localityUrls, ...blogUrls, ...propertyUrls];
}
