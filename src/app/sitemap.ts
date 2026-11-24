import type { MetadataRoute } from "next";
import { SERVICE_AREA_HUBS } from "@/data/serviceAreas";
import {
  YEAR_ROUND_SERVICES,
  getPinSlug,
  getStaticPins,
} from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lungrinslawncare.com";
  const now = new Date();

  const serviceEntries: MetadataRoute.Sitemap = YEAR_ROUND_SERVICES.map(
    (svc) => ({
      url: `${baseUrl}/services/${svc.slug}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    })
  );

  const areaEntries: MetadataRoute.Sitemap = SERVICE_AREA_HUBS.map((area) => ({
    url: `${baseUrl}/service-areas/${area.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const pinEntries: MetadataRoute.Sitemap = getStaticPins()
    .map((pin) => {
      const slug = getPinSlug(pin);
      if (!slug) return null;
      return {
        url: `${baseUrl}/pins/${slug}/`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.78,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    ...serviceEntries,
    ...areaEntries,
    {
      url: `${baseUrl}/pins/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...pinEntries,
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
