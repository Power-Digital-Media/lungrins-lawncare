import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import pinsData from "@/data/pins.json";
import { SERVICE_AREA_HUBS, getServiceAreaBySlug } from "@/data/serviceAreas";
import { YEAR_ROUND_SERVICES, getPinHref, type PinRecord } from "@/data/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_AREA_HUBS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hub = getServiceAreaBySlug(slug);
  if (!hub) return {};

  return {
    title: {
      absolute: hub.seoTitle,
    },
    description: hub.seoDescription,
    alternates: {
      canonical: `/service-areas/${hub.slug}/`,
    },
    openGraph: {
      title: hub.seoTitle,
      description: hub.seoDescription,
      url: `https://lungrinslawncare.com/service-areas/${hub.slug}/`,
      siteName: "Lungrin's Lawncare",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://lungrinslawncare.com/images/branding/og-lungrins-crest-v2.jpg",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `Lungrin's Lawncare — ${hub.town}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: hub.seoTitle,
      description: hub.seoDescription,
      images: ["https://lungrinslawncare.com/images/branding/og-lungrins-crest-v2.jpg"],
    },
  };
}

function toCardWebp(imgPath: string): string {
  return imgPath.endsWith(".webp") && !imgPath.endsWith("-card.webp")
    ? `${imgPath.slice(0, -5)}-card.webp`
    : imgPath;
}

export default async function ServiceAreaHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hub = getServiceAreaBySlug(slug);
  if (!hub) notFound();

  const allPins = pinsData as PinRecord[];
  const matchedPins = allPins.filter((pin) => {
    const loc = `${pin.location} ${pin.title || ""} ${pin.description}`.toLowerCase();
    return hub.matchKeywords.some((kw) => loc.includes(kw));
  });
  const displayPins = (
    matchedPins.length >= 3
      ? matchedPins
      : [...matchedPins, ...allPins.filter((p) => !matchedPins.includes(p))]
  ).slice(0, 6);

  const pageUrl = `https://lungrinslawncare.com/service-areas/${hub.slug}/`;
  const areaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://lungrinslawncare.com/#website",
        name: "Lungrin's Lawncare",
        url: "https://lungrinslawncare.com/",
      },
      {
        "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
        "@id": "https://lungrinslawncare.com/#business",
        name: "Lungrin's Lawncare",
        url: pageUrl,
        telephone: "+1-601-906-1281",
        logo: "https://lungrinslawncare.com/images/logos/lungrins-logo.webp",
        image: "https://lungrinslawncare.com/images/jobs/fb-2026/oct30-flora-pinestraw/2.webp",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Flora",
          addressRegion: "MS",
          postalCode: "39071",
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 32.5485,
          longitude: -90.3087,
        },
        areaServed: [
          { "@type": "City", name: hub.cityShort },
          { "@type": "AdministrativeArea", name: hub.county },
        ],
        sameAs: [
          "https://www.facebook.com/LungrinsLawncare",
          "https://www.google.com/maps/place/?q=place_id:ChIJvYxgYy-ipy0ReT6NyUfsbCM",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://lungrinslawncare.com/" },
          {
            "@type": "ListItem",
            position: 2,
            name: `Service Areas (${hub.town})`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(areaJsonLd) }}
      />

      <section
        style={{
          background: "linear-gradient(155deg, #052e16 0%, #064e3b 65%, #022c22 100%)",
          color: "#ffffff",
          padding: "3.2rem 0 3.4rem",
        }}
      >
        <div className="ll-container">
          <span className="ll-eyebrow ll-eyebrow-dark">
            📍 Active Route • {hub.county} ({hub.zipCodes})
          </span>
          <h1
            style={{
              fontSize: "clamp(1.85rem, 4vw, 2.85rem)",
              fontWeight: 900,
              lineHeight: 1.12,
              margin: "0.75rem 0 0.9rem",
              color: "#ffffff",
              maxWidth: "820px",
            }}
          >
            Lawn Care, Rolled Pine Straw &amp; Property Cleanups in{" "}
            <span style={{ color: "#4ade80" }}>{hub.town}</span>
          </h1>
          <p
            style={{
              color: "#dcfce7",
              fontSize: "1.03rem",
              lineHeight: 1.6,
              maxWidth: "740px",
              marginBottom: "1.4rem",
            }}
          >
            {hub.heroIntro}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/#calculator" className="ll-btn ll-btn-primary">
              ⚡ Instant {hub.cityShort} Yard Estimate
            </Link>
            <a href="tel:6019061281" className="ll-btn ll-btn-ghost">
              📞 Call Luke: (601) 906-1281
            </a>
            <a
              href={`sms:6019061281?body=Hi%20Luke%2C%20I%27d%20like%20a%20quote%20for%20my%20property%20in%20${encodeURIComponent(
                hub.town
              )}.`}
              className="ll-btn ll-btn-ghost"
            >
              💬 Text Property Photos
            </a>
          </div>
        </div>
      </section>

      <section className="ll-section">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Verified Field Proof</span>
            <h2>Recent Jobs Near {hub.town}</h2>
            <p>{hub.routeNotes}</p>
          </div>

          <div className="ll-jobs-grid">
            {displayPins.map((job) => {
              const rawImg = job.images[0] || "/images/jobs/fb-2026/oct30-flora-pinestraw/2.webp";
              const cardImg = toCardWebp(rawImg);
              return (
                <article key={job.id} className="ll-job-card">
                  <Link href={getPinHref(job)} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="ll-job-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cardImg}
                        srcSet={cardImg !== rawImg ? `${cardImg} 560w, ${rawImg} 960w` : undefined}
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

      <section className="ll-section ll-section-alt">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Full-Service Exterior Care</span>
            <h2>What We Handle on Every {hub.cityShort} Route</h2>
            <p>
              Owner Luke Lungrin is on-site personally — no rotating subcontractor crews, missed gates, or grass left in your beds.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            <div className="ll-form-box">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Year-Round Services in {hub.cityShort}
              </h3>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#334155", lineHeight: 1.75 }}>
                <li>Weekly &amp; bi-weekly residential &amp; acreage mowing</li>
                <li>Hand-rolled longleaf pine straw &amp; hardwood mulch installs</li>
                <li>Fall &amp; winter oak leaf removal &amp; pre-spring cleanups</li>
                <li>Overgrown flowerbed cleanups, shrub &amp; privacy tree planting</li>
                <li>Pond banks, vine-choked fence lines, bush hogging &amp; junk hauling</li>
              </ul>
            </div>

            <div className="ll-form-box">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                {hub.cityShort} Corridors &amp; Subdivisions Served
              </h3>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#334155", lineHeight: 1.75 }}>
                {hub.neighborhoods.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ll-form-box" style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#15803d", marginBottom: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Summer &amp; Winter Services Available in {hub.town}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.45rem" }}>
              {YEAR_ROUND_SERVICES.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}/`}
                  style={{
                    padding: "0.42rem 0.85rem",
                    borderRadius: "999px",
                    border: "1px solid #bbf7d0",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#14532d",
                    textDecoration: "none",
                    background: "#f0fdf4",
                  }}
                >
                  {svc.shortTitle}
                </Link>
              ))}
            </div>
          </div>

          <div className="ll-form-box" style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 900, marginBottom: "0.5rem" }}>
              Need a Fast Quote in {hub.town}?
            </h2>
            <p style={{ color: "#475569", maxWidth: "620px", margin: "0 auto 1.25rem" }}>
              Use our instant yard calculator or text a quick photo of your yard or flowerbeds directly to Luke at (601) 906-1281 for same-day pricing.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Link href="/#calculator" className="ll-btn ll-btn-primary">
                Calculate Instant Estimate
              </Link>
              <Link href="/#contact" className="ll-btn ll-btn-outline">
                Request Callback
              </Link>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.1rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#64748b", marginBottom: "0.6rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Nearby Central Mississippi Routes
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>
                {SERVICE_AREA_HUBS.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/service-areas/${other.slug}/`}
                    style={{
                      padding: "0.38rem 0.8rem",
                      borderRadius: "999px",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      background: other.slug === hub.slug ? "#15803d" : "#f1f5f9",
                      color: other.slug === hub.slug ? "#ffffff" : "#0f172a",
                    }}
                  >
                    {other.town}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
