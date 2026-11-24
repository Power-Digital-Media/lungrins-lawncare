import type { Metadata } from "next";
import Link from "next/link";
import { YEAR_ROUND_SERVICES } from "@/data/services";
import { SERVICE_AREA_HUBS } from "@/data/serviceAreas";

export const metadata: Metadata = {
  title: {
    absolute:
      "Year-Round Lawn Care, Pine Straw & Winter Cleanups | Lungrin's Lawncare",
  },
  description:
    "Year-round lawn mowing, rolled longleaf pine straw, fall/winter leaf removal, pond & fence clearing, and junk hauling in Flora, Madison & Ridgeland, MS.",
  alternates: {
    canonical: "/services/",
  },
  openGraph: {
    title:
      "Year-Round Lawn Care, Pine Straw & Winter Cleanups | Lungrin's Lawncare",
    description:
      "Summer turf striping to winter pine straw, leaf removal, brush clearing & junk hauling across Central Mississippi. Call Luke: (601) 906-1281.",
    url: "https://lungrinslawncare.com/services/",
    siteName: "Lungrin's Lawncare",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://lungrinslawncare.com/images/branding/og-lungrins-crest-v2.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Lungrin's Lawncare — Year-Round Lawn & Property Services in Central MS",
      },
    ],
  },
};

function toCardWebp(imgPath: string): string {
  return imgPath.endsWith(".webp") && !imgPath.endsWith("-card.webp")
    ? `${imgPath.slice(0, -5)}-card.webp`
    : imgPath;
}

export default function ServicesIndexPage() {
  const fallWinterServices = YEAR_ROUND_SERVICES.filter(
    (s) => s.seasonGroup === "fall-winter"
  );
  const springSummerServices = YEAR_ROUND_SERVICES.filter(
    (s) => s.seasonGroup === "spring-summer"
  );

  const hubJsonLd = {
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
        "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
        "@id": "https://lungrinslawncare.com/#business",
        name: "Lungrin's Lawncare",
        url: "https://lungrinslawncare.com/",
        telephone: "+1-601-906-1281",
        image:
          "https://lungrinslawncare.com/images/branding/og-lungrins-crest-v2.jpg",
        address: {
          "@type": "PostalAddress",
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
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "07:00",
            closes: "18:30",
          },
        ],
        sameAs: [
          "https://www.facebook.com/LungrinsLawncare",
          "https://www.google.com/maps/place/?q=place_id:ChIJvYxgYy-ipy0ReT6NyUfsbCM",
        ],
      },
      {
        "@type": "ItemList",
        name: "Lungrin's Lawncare Year-Round Exterior Services",
        itemListElement: YEAR_ROUND_SERVICES.map((svc, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: svc.title,
          url: `https://lungrinslawncare.com/services/${svc.slug}/`,
        })),
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
            name: "Services",
            item: "https://lungrinslawncare.com/services/",
          },
        ],
      },
    ],
  };

  return (
    <div className="ll-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd) }}
      />

      <section
        style={{
          background:
            "linear-gradient(155deg, #052e16 0%, #064e3b 65%, #022c22 100%)",
          color: "#ffffff",
          padding: "3.2rem 0 3.4rem",
        }}
      >
        <div className="ll-container">
          <span className="ll-eyebrow ll-eyebrow-dark">
            12-Month Central Mississippi Property Care
          </span>
          <h1
            style={{
              fontSize: "clamp(1.9rem, 4.2vw, 2.9rem)",
              fontWeight: 900,
              lineHeight: 1.12,
              margin: "0.75rem 0 0.9rem",
              color: "#ffffff",
              maxWidth: "840px",
            }}
          >
            Year-Round Lawn Care, Rolled Pine Straw &amp;{" "}
            <span style={{ color: "#4ade80" }}>Winter Property Cleanups</span>
          </h1>
          <p
            style={{
              color: "#dcfce7",
              fontSize: "1.03rem",
              lineHeight: 1.6,
              maxWidth: "760px",
              marginBottom: "1.4rem",
            }}
          >
            Mississippi properties don&apos;t stop needing care when warm-season
            turf goes dormant. Owner Luke Lungrin pairs spring-and-summer mowing
            routes with fall-and-winter longleaf pine straw, leaf removal,
            dormant fence/pond brush clearing, shrub pruning, and trailer junk
            haul-aways across Flora, Madison, Gluckstadt, Ridgeland, Jackson,
            Bentonia, and Pocahontas.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/#calculator" className="ll-btn ll-btn-primary">
              ⚡ Instant Yard &amp; Project Estimate
            </Link>
            <a href="tel:6019061281" className="ll-btn ll-btn-ghost">
              📞 Call Luke: (601) 906-1281
            </a>
            <a
              href="sms:6019061281?body=Hi%20Luke%2C%20I%27d%20like%20a%20free%20quote%20for%20my%20yard."
              className="ll-btn ll-btn-ghost"
            >
              💬 Text Project Photos
            </a>
          </div>
        </div>
      </section>

      {/* Fall & Winter Services */}
      <section className="ll-section">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Fall, Winter &amp; Pre-Spring Priority</span>
            <h2>Cold-Season Pine Straw, Leaf Cleanups &amp; Heavy Clearing</h2>
            <p>
              From October through March, our crews focus on insulating shrub
              beds, clearing heavy oak leaf drops, reclaiming overgrown fence
              lines and pond banks while brush is dormant, and hauling off debris.
            </p>
          </div>

          <div className="ll-jobs-grid">
            {fallWinterServices.map((svc) => {
              const cardImg = toCardWebp(svc.heroImage);
              return (
                <article key={svc.slug} className="ll-job-card">
                  <Link
                    href={`/services/${svc.slug}/`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="ll-job-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cardImg}
                        srcSet={
                          cardImg !== svc.heroImage
                            ? `${cardImg} 560w, ${svc.heroImage} 960w`
                            : undefined
                        }
                        sizes="(max-width: 767px) 340px, 380px"
                        alt={`${svc.title} in Central Mississippi by Lungrin's Lawncare`}
                        width={560}
                        height={420}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="ll-job-svc-badge">{svc.seasonBadge}</span>
                    </div>
                    <div className="ll-job-body">
                      <h3 className="ll-job-title">{svc.title}</h3>
                      <p className="ll-job-desc">{svc.seoDescription}</p>
                      <div
                        style={{
                          marginTop: "0.75rem",
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          color: "#15803d",
                        }}
                      >
                        View Service Details &amp; Photos →
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Spring & Summer Services */}
      <section className="ll-section ll-section-alt">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Spring, Summer &amp; Year-Round Care</span>
            <h2>Turf Striping, Acreage Mowing, Flowerbeds &amp; Shrub Sculpting</h2>
            <p>
              Consistent owner-operated mowing routes, multi-acre estate cuts,
              custom flowerbed makeovers, privacy tree planting, and crisp hedge
              shaping.
            </p>
          </div>

          <div className="ll-jobs-grid">
            {springSummerServices.map((svc) => {
              const cardImg = toCardWebp(svc.heroImage);
              return (
                <article key={svc.slug} className="ll-job-card">
                  <Link
                    href={`/services/${svc.slug}/`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="ll-job-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cardImg}
                        srcSet={
                          cardImg !== svc.heroImage
                            ? `${cardImg} 560w, ${svc.heroImage} 960w`
                            : undefined
                        }
                        sizes="(max-width: 767px) 340px, 380px"
                        alt={`${svc.title} in Central Mississippi by Lungrin's Lawncare`}
                        width={560}
                        height={420}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="ll-job-svc-badge">{svc.seasonBadge}</span>
                    </div>
                    <div className="ll-job-body">
                      <h3 className="ll-job-title">{svc.title}</h3>
                      <p className="ll-job-desc">{svc.seoDescription}</p>
                      <div
                        style={{
                          marginTop: "0.75rem",
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          color: "#15803d",
                        }}
                      >
                        View Service Details &amp; Photos →
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="ll-form-box" style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, marginBottom: "0.5rem" }}>
              Active Routes Across 8 Central Mississippi Communities
            </h2>
            <p style={{ color: "#475569", maxWidth: "640px", margin: "0 auto 1.15rem" }}>
              Select your town below to see local route details and verified field
              projects near you:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>
              {SERVICE_AREA_HUBS.map((area) => (
                <Link
                  key={area.slug}
                  href={`/service-areas/${area.slug}/`}
                  style={{
                    padding: "0.45rem 0.9rem",
                    borderRadius: "999px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    textDecoration: "none",
                    background: "#f8fafc",
                  }}
                >
                  📍 {area.town}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
