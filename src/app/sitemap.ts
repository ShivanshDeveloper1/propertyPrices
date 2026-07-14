import { connectDB } from "@/lib/mongodb";
import { LocalityModel } from "@/models/Locality"; // ✅ Match the export name
import { Blog } from "@/models/Blog"; // ✅ Blog is a class, so .list() works
import { getAllProperties} from "@/actions/(admin)/getPropertie/properties";

export const revalidate = 43200; // Re-generates the sitemap every 12 hours

export default async function sitemap() {
  const baseUrl = "https://www.saharanpurprice.in";

  // 1. Connect to DB first
  await connectDB();

  // 2. Fetch Data
  // LocalityModel uses .find() because it's a raw Mongoose model
  // Blog uses .list() because you built a class for it
  const [localities, blogs,properties] = await Promise.all([
    LocalityModel.find({}).lean(),
    Blog.list(),
    getAllProperties(),
  ]);

  const getSafeDate = (dateInput) => {
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? new Date() : date;
  };

    // 4. Map Properties (Crucial for Real Estate SEO)
  const propertyUrls = properties.map((prop) => ({
    url: `${baseUrl}/properties/${prop.slug}`,
    lastModified: getSafeDate(prop.updatedAt),
    changeFrequency: "daily",
    priority: 0.9, // Higher priority for property listings
  }));

  // 3. Localities
  const localityUrls = localities.map((loc) => ({
    url: `${baseUrl}/locality/${loc.slug}`,
    lastModified: getSafeDate(loc.last_updated),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 4. Blogs
  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: getSafeDate(blog.updatedAt || blog.createdAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));







const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/oldbooks`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 }, // 👈 Super high priority for your book platform
    { url: `${baseUrl}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

return [...staticUrls, ...localityUrls, ...blogUrls, ...propertyUrls];
}
