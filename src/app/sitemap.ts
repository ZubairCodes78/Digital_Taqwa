import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const canonicalUrl = "https://digitaltaqwa.site";
  const lastModified = new Date();

  return [
    {
      url: `${canonicalUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${canonicalUrl}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${canonicalUrl}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
