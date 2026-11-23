import type { MetadataRoute } from "next";
import { SERVICE_AREA_HUBS } from "@/data/serviceAreas";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lungrinslawncare.com";
  const now = new Date();

  const areaEntries: MetadataRoute.Sitemap = SERVICE_AREA_HUBS.map((area) => ({
    url: `${baseUrl}/service-areas/${area.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pins/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...areaEntries,
    {
      url: `${baseUrl}/privacy-policy/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-and-conditions/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
