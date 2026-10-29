import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin / dealer-login / upload areas and internal APIs are not for search results.
      disallow: ["/api/", "/admin/", "/allProperty", "/AgentLogin", "/AgentUpload", "/test-blog"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
