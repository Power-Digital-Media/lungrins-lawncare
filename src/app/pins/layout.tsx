import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Local Project Pins Map | Lungrin's Lawncare",
  },
  description:
    "Explore 32 verified lawn care, pine straw, flowerbed, fence clearing, and pond cleanup job pins by Luke Lungrin across Flora, Madison & Central MS.",
  alternates: {
    canonical: "/pins/",
  },
};

const pinsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://lungrinslawncare.com/#website",
      name: "Lungrin's Lawncare",
      alternateName: "Luke Lungrin's Lawn Care Services",
      url: "https://lungrinslawncare.com/",
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://lungrinslawncare.com/#business",
      name: "Lungrin's Lawncare",
      url: "https://lungrinslawncare.com/",
      telephone: "+1-601-906-1281",
      image: "https://lungrinslawncare.com/images/branding/og-lungrins-2026.jpg",
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
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "07:00",
          closes: "18:30",
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://lungrinslawncare.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Local Project Pins",
          item: "https://lungrinslawncare.com/pins/",
        },
      ],
    },
  ],
};

export default function PinsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pinsJsonLd) }}
      />
      {children}
    </>
  );
}
