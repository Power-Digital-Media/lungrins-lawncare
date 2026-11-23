import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: {
    absolute: "Lungrin's Lawncare | Lawn Care in Flora, Madison & Jackson, MS",
  },
  description:
    "Owner-operated lawn care, rolled pine straw, flowerbed cleanups, hedge trimming & clearing in Flora, Madison & Jackson, MS. Call Luke: (601) 906-1281.",
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://lungrinslawncare.com/#website",
      name: "Lungrin's Lawncare",
      alternateName: "Luke Lungrin's Lawn Care Services",
      url: "https://lungrinslawncare.com/",
      inLanguage: "en-US",
    },
    {
      "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
      "@id": "https://lungrinslawncare.com/#business",
      name: "Lungrin's Lawncare",
      alternateName: "Luke Lungrin's Lawn Care Services",
      url: "https://lungrinslawncare.com/",
      logo: "https://lungrinslawncare.com/images/logos/lungrins-logo.webp",
      image: [
        "https://lungrinslawncare.com/images/branding/og-lungrins-2026.jpg",
        "https://lungrinslawncare.com/images/jobs/fb-2026/oct30-flora-pinestraw/2.webp",
        "https://lungrinslawncare.com/images/jobs/fb-2026/jul29-ridgeland-striping/2.webp",
      ],
      description:
        "Locally owned and operated lawn care and landscaping company based in Flora, MS providing residential and acreage mowing, rolled longleaf pine straw, mulch, flowerbed cleanups, bush trimming, pond bank clearing, fence line clearing, gutter cleaning, and debris hauling.",
      telephone: "+1-601-906-1281",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+1-601-906-1281",
          contactType: "customer service",
          areaServed: "US-MS",
          availableLanguage: "English",
        },
        {
          "@type": "ContactPoint",
          telephone: "+1-601-906-1282",
          contactType: "sales",
          areaServed: "US-MS",
          availableLanguage: "English",
        },
      ],
      founder: {
        "@type": "Person",
        name: "Luke Lungrin",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "101 Mansker Dr",
        addressLocality: "Flora",
        addressRegion: "MS",
        postalCode: "39071",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 32.5432,
        longitude: -89.8013,
      },
      areaServed: [
        { "@type": "City", name: "Flora", addressRegion: "MS" },
        { "@type": "City", name: "Pocahontas", addressRegion: "MS" },
        { "@type": "City", name: "Madison", addressRegion: "MS" },
        { "@type": "City", name: "Gluckstadt", addressRegion: "MS" },
        { "@type": "City", name: "Ridgeland", addressRegion: "MS" },
        { "@type": "City", name: "Jackson", addressRegion: "MS" },
        { "@type": "City", name: "Bentonia", addressRegion: "MS" },
        { "@type": "AdministrativeArea", name: "Madison County", addressRegion: "MS" },
        { "@type": "AdministrativeArea", name: "Yazoo County", addressRegion: "MS" },
      ],
      priceRange: "$$",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "07:00",
          closes: "18:30",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        bestRating: "5",
        worstRating: "1",
        ratingCount: "34",
        reviewCount: "34",
      },
      sameAs: [
        "https://www.facebook.com/LungrinsLawncare",
        "https://www.google.com/maps/place/?q=place_id:ChIJvYxgYy-ipy0ReT6NyUfsbCM",
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://lungrinslawncare.com/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://lungrinslawncare.com/",
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
