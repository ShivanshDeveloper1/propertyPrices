import { Locality } from "../entities/Locality";
import { Blog } from "../entities/Blog";

export default async function sitemap() {
  // 1. BASE URL NORMALIZATION
  const baseUrl = "https://saharanpurprice.in";

  // 2. FETCH DATA (Direct DB call)
  const [localities, blogs] = await Promise.all([Locality.list(), Blog.list()]);

  // 3. DATE SAFETY HELPER
  const getSafeDate = (dateInput) => {
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  // 4. LOCALITY URLS
  const localityUrls = localities.map((loc) => ({
    url: `${baseUrl}/locality/${loc.slug}`,
    lastModified: getSafeDate(loc.last_updated),
    changeFrequency: "weekly",
    priority: loc.district.includes("Noida") ? 0.9 : 0.8,
  }));

  // 5. BLOG URLS (UPDATED to Capital 'B')
  const blogUrls = blogs.map((blog) => ({
    // ✅ CHANGED: /blogs -> /Blogs
    url: `${baseUrl}/Blogs/${blog.slug}`,
    lastModified: getSafeDate(blog.updatedAt || blog.createdAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 6. STATIC PAGES
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    // ✅ CHANGED: /blogs -> /Blogs
    {
      url: `${baseUrl}/Blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  return [...staticUrls, ...localityUrls, ...blogUrls];
}
