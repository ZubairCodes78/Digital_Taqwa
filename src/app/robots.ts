import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const canonicalUrl = "https://digitaltaqwa.site";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms"],
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/_next/*",
          "/private/*",
        ],
      },
    ],
    sitemap: `${canonicalUrl}/sitemap.xml`,
    host: canonicalUrl,
  };
}
