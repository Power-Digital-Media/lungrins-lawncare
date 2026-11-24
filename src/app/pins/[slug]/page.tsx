import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPinHref,
  getPinSlug,
  getStaticPinBySlug,
  getStaticPins,
  matchServiceHubForPin,
} from "@/data/services";
import { SERVICE_AREA_HUBS } from "@/data/serviceAreas";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticPins()
    .map((pin) => {
      const slug = getPinSlug(pin);
      return slug ? { slug } : null;
    })
    .filter((item): item is { slug: string } => Boolean(item));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pin = getStaticPinBySlug(slug);
  if (!pin) return {};

  const fullTitle = `${pin.title || `${pin.service} in ${pin.location}`} | Lungrin's Lawncare`;
  const desc = (pin.detailedExplanation || pin.description).slice(0, 158);
  const ogImg = pin.images[0]
    ? `https://lungrinslawncare.com${pin.images[0]}`
    : "https://lungrinslawncare.com/images/branding/og-lungrins-crest-v2.jpg";

  return {
    title: {
      absolute: fullTitle,
    },
    description: desc,
    alternates: {
      canonical: `/pins/${slug}/`,
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: `https://lungrinslawncare.com/pins/${slug}/`,
      siteName: "Lungrin's Lawncare",
      locale: "en_US",
      type: "article",
      images: [
        {
          url: ogImg,
          alt: `${pin.title || pin.service} in ${pin.location}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImg],
    },
  };
}

function toCardWebp(imgPath: string): string {
  return imgPath.endsWith(".webp") && !imgPath.endsWith("-card.webp")
    ? `${imgPath.slice(0, -5)}-card.webp`
    : imgPath;
}

export default async function StaticPinDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pin = getStaticPinBySlug(slug);
  if (!pin) notFound();

  const matchedService = matchServiceHubForPin(pin);
  const matchedArea =
    SERVICE_AREA_HUBS.find((a) =>
      pin.location.toLowerCase().includes(a.cityShort.toLowerCase())
    ) || SERVICE_AREA_HUBS[0];

  const relatedPins = getStaticPins()
    .filter(
      (p) =>
        p.id !== pin.id &&
        (p.location === pin.location || p.service === pin.service)
    )
    .slice(0, 3);

  const pageUrl = `https://lungrinslawncare.com/pins/${slug}/`;
  const graphNodes: Record<string, unknown>[] = [
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
      image: pin.images[0]
        ? `https://lungrinslawncare.com${pin.images[0]}`
        : "https://lungrinslawncare.com/images/branding/og-lungrins-crest-v2.jpg",
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
      "@type": "Service",
      name: pin.title || `${pin.service} in ${pin.location}`,
      serviceType: pin.service,
      description: pin.detailedExplanation || pin.description,
      url: pageUrl,
      provider: { "@id": "https://lungrinslawncare.com/#business" },
      areaServed: {
        "@type": "Place",
        name: pin.location,
        ...(pin.latitude && pin.longitude
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: pin.latitude,
                longitude: pin.longitude,
              },
            }
          : {}),
      },
      image: pin.images.map((img) => `https://lungrinslawncare.com${img}`),
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
          name: "Project Pins",
          item: "https://lungrinslawncare.com/pins/",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: pin.title || `${pin.service} — ${pin.location}`,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <div className="ll-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": graphNodes,
          }),
        }}
      />

      <section
        style={{
          background:
            "linear-gradient(155deg, #052e16 0%, #064e3b 65%, #022c22 100%)",
          color: "#ffffff",
          padding: "3rem 0 3.2rem",
        }}
      >
        <div className="ll-container">
          <nav
            aria-label="Breadcrumb"
            style={{
              fontSize: "0.82rem",
              color: "#bbf7d0",
              marginBottom: "0.85rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.45rem",
              alignItems: "center",
            }}
          >
            <Link href="/" style={{ color: "#bbf7d0", textDecoration: "none" }}>
              Home
            </Link>
            <span>/</span>
            <Link
              href="/pins/"
              style={{ color: "#bbf7d0", textDecoration: "none" }}
            >
              Project Pins
            </Link>
            <span>/</span>
            <Link
              href={`/service-areas/${matchedArea.slug}/`}
              style={{ color: "#bbf7d0", textDecoration: "none" }}
            >
              {matchedArea.town}
            </Link>
          </nav>

          <span className="ll-eyebrow ll-eyebrow-dark">
            📍 Verified PinDrop™ Job • {pin.location} • {pin.date}
          </span>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
              fontWeight: 900,
              lineHeight: 1.13,
              margin: "0.75rem 0 0.85rem",
              color: "#ffffff",
              maxWidth: "850px",
            }}
          >
            {pin.title || `${pin.service} in ${pin.location}`}
          </h1>
          <p
            style={{
              color: "#dcfce7",
              fontSize: "1.03rem",
              lineHeight: 1.62,
              maxWidth: "760px",
              marginBottom: "1.35rem",
            }}
          >
            {pin.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/#calculator" className="ll-btn ll-btn-primary">
              ⚡ Price a Similar Job
            </Link>
            <a href="tel:6019061281" className="ll-btn ll-btn-ghost">
              📞 Call Luke: (601) 906-1281
            </a>
            <Link
              href={`/services/${matchedService.slug}/`}
              className="ll-btn ll-btn-ghost"
            >
              Explore {matchedService.shortTitle} →
            </Link>
          </div>
        </div>
      </section>

      <section className="ll-section">
        <div className="ll-container">
          {/* Photo Gallery Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.1rem",
              marginBottom: "2.2rem",
            }}
          >
            {pin.images.map((rawImg, idx) => {
              const cardImg = toCardWebp(rawImg);
              return (
                <div
                  key={rawImg}
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    background: "#0f172a",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={idx === 0 ? rawImg : cardImg}
                    srcSet={
                      cardImg !== rawImg
                        ? `${cardImg} 560w, ${rawImg} 960w`
                        : undefined
                    }
                    sizes="(max-width: 767px) 100vw, 460px"
                    alt={`${pin.title || pin.service} in ${pin.location} — Photo ${
                      idx + 1
                    }`}
                    width={640}
                    height={480}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Scope & AEO */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.25rem",
            }}
          >
            <div className="ll-form-box">
              <span className="ll-eyebrow">Field Scope Summary</span>
              <h2
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  margin: "0.4rem 0 0.65rem",
                }}
              >
                How Luke Handled This {pin.location} Property
              </h2>
              <p style={{ color: "#334155", lineHeight: 1.7, marginBottom: "1rem" }}>
                {pin.detailedExplanation || pin.description}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  paddingTop: "0.65rem",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <Link
                  href={`/services/${matchedService.slug}/`}
                  style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: "999px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    color: "#14532d",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Service: {matchedService.shortTitle}
                </Link>
                <Link
                  href={`/service-areas/${matchedArea.slug}/`}
                  style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: "999px",
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    color: "#0f172a",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Route: {matchedArea.town}
                </Link>
              </div>
            </div>

            {pin.aeoAnswers && pin.aeoAnswers.length > 0 ? (
              <div className="ll-form-box">
                <span className="ll-eyebrow">Property Care Insight</span>
                {pin.aeoAnswers.map((qa) => (
                  <div key={qa.question} style={{ marginTop: "0.5rem" }}>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        marginBottom: "0.45rem",
                      }}
                    >
                      {qa.question}
                    </h3>
                    <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
                      {qa.answer}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ll-form-box">
                <span className="ll-eyebrow">Same-Day Free Quotes</span>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    margin: "0.4rem 0 0.55rem",
                  }}
                >
                  Have a Property Like This Near {pin.location}?
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.65, marginBottom: "1rem" }}>
                  Text Luke a quick photo of your yard, flowerbeds, pond bank,
                  or brush pile at (601) 906-1281 or calculate an instant
                  ballpark estimate online.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                  <Link href="/#calculator" className="ll-btn ll-btn-primary">
                    Instant Estimate
                  </Link>
                  <a href="tel:6019061281" className="ll-btn ll-btn-outline">
                    (601) 906-1281
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Related Jobs */}
          {relatedPins.length > 0 && (
            <div>
              <div className="ll-section-head">
                <span className="ll-eyebrow">More Verified Field Work</span>
                <h2>Related Projects in Central Mississippi</h2>
              </div>
              <div className="ll-jobs-grid">
                {relatedPins.map((rel) => {
                  const rawImg =
                    rel.images[0] ||
                    "/images/jobs/fb-2026/oct30-flora-pinestraw/2.webp";
                  const cardImg = toCardWebp(rawImg);
                  return (
                    <article key={rel.id} className="ll-job-card">
                      <Link
                        href={getPinHref(rel)}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div className="ll-job-media">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cardImg}
                            alt={`${rel.title || rel.service} in ${rel.location}`}
                            width={560}
                            height={420}
                            loading="lazy"
                            decoding="async"
                          />
                          <span className="ll-job-loc-badge">
                            📍 {rel.location}
                          </span>
                          <span className="ll-job-svc-badge">{rel.service}</span>
                        </div>
                        <div className="ll-job-body">
                          <h3 className="ll-job-title">
                            {rel.title || `${rel.service} — ${rel.location}`}
                          </h3>
                          <p className="ll-job-desc">
                            {rel.description.slice(0, 125)}…
                          </p>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
