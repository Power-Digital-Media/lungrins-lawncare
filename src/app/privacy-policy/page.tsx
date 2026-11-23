import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Privacy Policy | Lungrin's Lawncare Flora, MS",
  },
  description:
    "Read the privacy policy for Lungrin's Lawncare covering how estimate inquiries, phone numbers, and property service addresses are handled and protected.",
  alternates: {
    canonical: "/privacy-policy/",
  },
};

const privacyJsonLd = {
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
        { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://lungrinslawncare.com/privacy-policy/" },
      ],
    },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <div className="ll-page" style={{ padding: "4rem 0 5rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
      />
      <div className="ll-container" style={{ maxWidth: "820px" }}>
        <span className="ll-eyebrow">Legal &amp; Privacy</span>
        <h1 style={{ fontSize: "2.35rem", fontWeight: 900, margin: "0.85rem 0 1rem" }}>Privacy Policy</h1>
        <p style={{ marginBottom: "1.25rem", color: "#475569" }}>
          Last updated: November 2026 • Lungrin&apos;s Lawncare (Flora, MS)
        </p>

        <div className="ll-form-box" style={{ display: "grid", gap: "1.25rem" }}>
          <section>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>1. Information We Collect</h2>
            <p>
              When you request a free lawn care or landscaping estimate through lungrinslawncare.com, we collect only the contact details you voluntarily provide — such as your name, phone number, town or property address, and project notes — so owner Luke Lungrin can prepare an accurate quote and respond to your inquiry.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>2. How We Use Your Information</h2>
            <p>
              Your contact information is used strictly to communicate regarding estimates, route scheduling, service updates, and invoicing. We never sell, rent, or trade customer phone numbers or property addresses to third-party marketers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>3. Project Photography &amp; Map Pins</h2>
            <p>
              To document workmanship across Central Mississippi, Lungrin&apos;s Lawncare shares general neighborhood-level job pins and outdoor project photos without publishing homeowner names or private contact details.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>4. Contact Us</h2>
            <p>
              Questions regarding this policy may be directed to Luke Lungrin at{" "}
              <a href="tel:6019061281" style={{ color: "#15803d", fontWeight: 800 }}>
                (601) 906-1281
              </a>
              .
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
