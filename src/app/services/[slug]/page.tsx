import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  YEAR_ROUND_SERVICES,
  getPinHref,
  getServiceHubBySlug,
  getStaticPins,
} from "@/data/services";
import { SERVICE_AREA_HUBS } from "@/data/serviceAreas";

export const dynamicParams = false;

export function generateStaticParams() {
  return YEAR_ROUND_SERVICES.map((svc) => ({ slug: svc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = getServiceHubBySlug(slug);
  if (!svc) return {};

  return {
    title: {
      absolute: svc.seoTitle,
    },
    description: svc.seoDescription,
    alternates: {
      canonical: `/services/${svc.slug}/`,
    },
    openGraph: {
      title: svc.seoTitle,
      description: svc.seoDescription,
      url: `https://lungrinslawncare.com/services/${svc.slug}/`,
      siteName: "Lungrin's Lawncare",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://lungrinslawncare.com/images/branding/og-lungrins-crest-v2.jpg",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${svc.title} — Lungrin's Lawncare`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: svc.seoTitle,
      description: svc.seoDescription,
      images: [
        "https://lungrinslawncare.com/images/branding/og-lungrins-crest-v2.jpg",
      ],
    },
  };
}

function toCardWebp(imgPath: string): string {
  return imgPath.endsWith(".webp") && !imgPath.endsWith("-card.webp")
    ? `${imgPath.slice(0, -5)}-card.webp`
    : imgPath;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = getServiceHubBySlug(slug);
  if (!svc) notFound();

  const allPins = getStaticPins();
  const matchedPins = allPins.filter((pin) => {
    const hay = `${pin.service} ${pin.title || ""} ${pin.description} ${pin.detailedExplanation}`.toLowerCase();
    return svc.matchKeywords.some((kw) => hay.includes(kw));
  });
  const displayPins = (
    matchedPins.length >= 3
      ? matchedPins
      : [...matchedPins, ...allPins.filter((p) => !matchedPins.includes(p))]
  ).slice(0, 6);

  const pageUrl = `https://lungrinslawncare.com/services/${svc.slug}/`;
  const serviceJsonLd = {
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
        logo: "https://lungrinslawncare.com/images/logos/lungrins-logo.webp",
        image: `https://lungrinslawncare.com${svc.heroImage}`,
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
        "@id": `${pageUrl}#service`,
        name: svc.title,
        serviceType: svc.shortTitle,
        description: svc.seoDescription,
        url: pageUrl,
        provider: {
          "@id": "https://lungrinslawncare.com/#business",
        },
        areaServed: SERVICE_AREA_HUBS.map((area) => ({
          "@type": "City",
          name: area.town,
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
          {
            "@type": "ListItem",
            position: 3,
            name: svc.shortTitle,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="ll-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(155deg, #052e16 0%, #064e3b 65%, #022c22 100%)",
          color: "#ffffff",
          padding: "3.2rem 0 3.4rem",
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
              href="/services/"
              style={{ color: "#bbf7d0", textDecoration: "none" }}
            >
              Services
            </Link>
            <span>/</span>
            <span style={{ color: "#ffffff", fontWeight: 700 }}>
              {svc.shortTitle}
            </span>
          </nav>

          <span className="ll-eyebrow ll-eyebrow-dark">{svc.seasonBadge}</span>
          <h1
            style={{
              fontSize: "clamp(1.85rem, 4vw, 2.85rem)",
              fontWeight: 900,
              lineHeight: 1.12,
              margin: "0.75rem 0 0.9rem",
              color: "#ffffff",
              maxWidth: "850px",
            }}
          >
            {svc.heroHeadline}{" "}
            <span style={{ color: "#4ade80" }}>{svc.heroHighlight}</span>
          </h1>
          <p
            style={{
              color: "#dcfce7",
              fontSize: "1.03rem",
              lineHeight: 1.62,
              maxWidth: "760px",
              marginBottom: "1.4rem",
            }}
          >
            {svc.heroIntro}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/#calculator" className="ll-btn ll-btn-primary">
              ⚡ Instant {svc.shortTitle} Estimate
            </Link>
            <a href="tel:6019061281" className="ll-btn ll-btn-ghost">
              📞 Call Luke: (601) 906-1281
            </a>
            <a
              href={`sms:6019061281?body=Hi%20Luke%2C%20I%27d%20like%20a%20quote%20for%20${encodeURIComponent(
                svc.shortTitle
              )}.`}
              className="ll-btn ll-btn-ghost"
            >
              💬 Text Property Photos
            </a>
          </div>
        </div>
      </section>

      {/* Seasonal Context + Checklist */}
      <section className="ll-section">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Owner-Operated Mississippi Craft</span>
            <h2>{svc.whySeasonMattersTitle}</h2>
            <p>{svc.whySeasonMattersBody}</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "1.25rem",
            }}
          >
            <div className="ll-form-box">
              <h3
                style={{
                  fontSize: "1.12rem",
                  fontWeight: 800,
                  marginBottom: "0.65rem",
                }}
              >
                {svc.checklistTitle}
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.2rem",
                  color: "#334155",
                  lineHeight: 1.75,
                }}
              >
                {svc.checklistItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="ll-form-box">
              <h3
                style={{
                  fontSize: "1.12rem",
                  fontWeight: 800,
                  marginBottom: "0.65rem",
                }}
              >
                {svc.idealForTitle}
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.2rem",
                  color: "#334155",
                  lineHeight: 1.75,
                }}
              >
                {svc.idealForItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Matched Real Field Jobs */}
      <section className="ll-section ll-section-alt">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Real Central MS Job Proof</span>
            <h2>Recent {svc.shortTitle} Projects by Luke Lungrin</h2>
            <p>
              Every photo below is a real Central Mississippi property completed
              personally by Lungrin&apos;s Lawncare—never stock photography.
            </p>
          </div>

          <div className="ll-jobs-grid">
            {displayPins.map((job) => {
              const rawImg =
                job.images[0] || "/images/jobs/fb-2026/oct30-flora-pinestraw/2.webp";
              const cardImg = toCardWebp(rawImg);
              return (
                <article key={job.id} className="ll-job-card">
                  <Link
                    href={getPinHref(job)}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="ll-job-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cardImg}
                        srcSet={
                          cardImg !== rawImg
                            ? `${cardImg} 560w, ${rawImg} 960w`
                            : undefined
                        }
                        sizes="(max-width: 767px) 330px, 380px"
                        alt={`${job.title || job.service} in ${job.location} by Lungrin's Lawncare`}
                        width={560}
                        height={420}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="ll-job-loc-badge">📍 {job.location}</span>
                      <span className="ll-job-svc-badge">{job.service}</span>
                    </div>
                    <div className="ll-job-body">
                      <div className="ll-job-meta">
                        <span>By Luke Lungrin</span>
                        <span>{job.date}</span>
                      </div>
                      <h3 className="ll-job-title">
                        {job.title || `${job.service} — ${job.location}`}
                      </h3>
                      <p className="ll-job-desc">
                        {job.description.slice(0, 135)}
                        {job.description.length > 135 ? "…" : ""}
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs + Cross-Links */}
      <section className="ll-section">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Homeowner Questions Answered</span>
            <h2>{svc.shortTitle} FAQs</h2>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              maxWidth: "860px",
              margin: "0 auto 2.5rem",
            }}
          >
            {svc.faqs.map((faq) => (
              <div key={faq.q} className="ll-form-box">
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    marginBottom: "0.45rem",
                    color: "#0f172a",
                  }}
                >
                  {faq.q}
                </h3>
                <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="ll-form-box" style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: "1.45rem",
                fontWeight: 900,
                marginBottom: "0.5rem",
              }}
            >
              Ready to Schedule {svc.shortTitle}?
            </h2>
            <p
              style={{
                color: "#475569",
                maxWidth: "620px",
                margin: "0 auto 1.25rem",
              }}
            >
              Lock in an instant ballpark estimate online or call/text Luke
              directly at (601) 906-1281 for fast scheduling across Madison,
              Hinds, and Yazoo Counties.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <Link href="/#calculator" className="ll-btn ll-btn-primary">
                Calculate Instant Estimate
              </Link>
              <Link href="/#contact" className="ll-btn ll-btn-outline">
                Request Free Callback
              </Link>
            </div>

            <div
              style={{
                borderTop: "1px solid #e2e8f0",
                paddingTop: "1.15rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#64748b",
                  marginBottom: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Communities Served for {svc.shortTitle}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "0.45rem",
                }}
              >
                {SERVICE_AREA_HUBS.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/service-areas/${area.slug}/`}
                    style={{
                      padding: "0.4rem 0.85rem",
                      borderRadius: "999px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      textDecoration: "none",
                      background: "#f8fafc",
                    }}
                  >
                    {area.town}
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.1rem" }}>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#64748b",
                  marginBottom: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Other Year-Round Exterior Services
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "0.45rem",
                }}
              >
                {YEAR_ROUND_SERVICES.filter((o) => o.slug !== svc.slug).map(
                  (other) => (
                    <Link
                      key={other.slug}
                      href={`/services/${other.slug}/`}
                      style={{
                        padding: "0.4rem 0.85rem",
                        borderRadius: "999px",
                        border: "1px solid #bbf7d0",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#14532d",
                        textDecoration: "none",
                        background: "#f0fdf4",
                      }}
                    >
                      {other.shortTitle}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
