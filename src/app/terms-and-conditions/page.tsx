import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Terms & Conditions | Lungrin's Lawncare MS",
  },
  description:
    "Review the service terms, estimate guidelines, scheduling policies, and payment terms for Lungrin's Lawncare in Flora, Madison & Central Mississippi.",
  alternates: {
    canonical: "/terms-and-conditions/",
  },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Lungrin's Lawncare",
      alternateName: "Luke Lungrin's Lawn Care Services",
      url: "https://lungrinslawncare.com/",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://lungrinslawncare.com/" },
        { "@type": "ListItem", position: 2, name: "Terms & Conditions", item: "https://lungrinslawncare.com/terms-and-conditions/" },
      ],
    },
  ],
};

export default function TermsPage() {
  return (
    <div className="ll-page" style={{ padding: "4rem 0 5rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
      />
      <div className="ll-container" style={{ maxWidth: "820px" }}>
        <span className="ll-eyebrow">Service Guidelines</span>
        <h1 style={{ fontSize: "2.35rem", fontWeight: 900, margin: "0.85rem 0 1rem" }}>Terms &amp; Conditions</h1>
        <p style={{ marginBottom: "1.25rem", color: "#475569" }}>
          Last updated: November 2026 • Lungrin&apos;s Lawncare (Flora, MS)
        </p>

        <div className="ll-form-box" style={{ display: "grid", gap: "1.25rem" }}>
          <section>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>1. Online Estimate Calculator</h2>
            <p>
              Prices displayed by our online Instant Estimate Calculator are ballpark estimates based on typical residential yard sizes. Final pricing is confirmed by Luke Lungrin prior to work beginning based on actual lot dimensions, pine straw bale counts, slope, and overgrowth density.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>2. Property Access &amp; Weather Delays</h2>
            <p>
              Please ensure gates are unlocked and pets are secured indoors on scheduled service days. In the event of heavy Mississippi rainstorms, routes are shifted to the next safe dry window to avoid rutting or damaging turf.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>3. Payment Terms</h2>
            <p>
              Payment is due upon completion of service via Venmo, Cash App, Zelle, check, or cash unless recurring billing arrangements have been agreed upon in advance.
            </p>
          </section>

          <div style={{ paddingTop: "0.5rem" }}>
            <Link href="/" className="ll-btn-cta-green">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
