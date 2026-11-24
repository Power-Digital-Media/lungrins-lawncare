"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname.startsWith("/embed")) {
    return null;
  }

  const isHome = pathname === "/";
  const sec = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="ll-chrome-topbar">
        <div className="ll-topbar-inner">
          <div className="ll-topbar-left">
            <span className="ll-topbar-badge">Now Booking</span>
            <span className="ll-topbar-areas-mobile">Flora, Madison &amp; Central MS</span>
            <span className="ll-topbar-areas ll-topbar-desktop-only">
              Flora • Madison • Gluckstadt • Ridgeland • Jackson • Bentonia • Pocahontas
            </span>
          </div>
          <div className="ll-topbar-links">
            <a href="tel:6019061281" className="ll-topbar-link" aria-label="Call primary phone 601-906-1281">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
              (601) 906-1281
            </a>
            <span className="ll-topbar-desktop-only" style={{ opacity: 0.4 }}>|</span>
            <a href="tel:6019061282" className="ll-topbar-link ll-topbar-desktop-only" aria-label="Call secondary phone 601-906-1282">
              (601) 906-1282
            </a>
            <span className="ll-topbar-desktop-only" style={{ opacity: 0.4 }}>•</span>
            <a
              href="https://www.facebook.com/LungrinsLawncare"
              target="_blank"
              rel="noopener noreferrer"
              className="ll-topbar-link ll-topbar-desktop-only"
              aria-label="Visit Lungrin's Lawncare on Facebook"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="ll-header">
        <div className="ll-header-inner">
          <Link href="/" className="ll-brand-link" onClick={() => setMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logos/lungrins-logo.webp"
              alt="Lungrin's Lawncare logo"
              width={48}
              height={48}
              className="ll-brand-logo"
            />
            <div>
              <div className="ll-brand-title">
                Lungrin&apos;s <span>Lawncare</span>
              </div>
              <div className="ll-brand-sub">Flora &amp; Central MS</div>
            </div>
          </Link>

          <nav className="ll-nav-desktop" aria-label="Primary Navigation">
            <Link href="/services/" className="ll-nav-item">Services</Link>
            <a href={sec("#calculator")} className="ll-nav-item">Estimate</a>
            <a href={sec("#gallery")} className="ll-nav-item">Before &amp; After</a>
            <Link href="/pins/" className="ll-nav-item ll-nav-pins-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
              </svg>
              32 Pins
            </Link>
            <a href={sec("#reviews")} className="ll-nav-item">Reviews</a>
            <a href={sec("#service-areas")} className="ll-nav-item">Areas</a>
            <a href={sec("#contact")} className="ll-nav-item">Contact</a>
          </nav>

          <div className="ll-header-ctas">
            <a href="tel:6019061281" className="ll-btn-phone-outline">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#15803d" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
              (601) 906-1281
            </a>
            <a href={sec("#calculator")} className="ll-btn-cta-green">
              Free Estimate
            </a>
          </div>

          <div className="ll-mobile-actions">
            <a href="tel:6019061281" className="ll-icon-btn" aria-label="Call Luke Lungrin at 601-906-1281">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#15803d" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
            </a>
            <button
              type="button"
              className="ll-icon-btn"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="ll-mobile-drawer">
            <div className="ll-mobile-drawer-links">
              <Link href="/services/" className="ll-mobile-drawer-link" onClick={() => setMenuOpen(false)}>
                <span>Year-Round Lawn &amp; Winter Services</span>
                <span>→</span>
              </Link>
              <a href={sec("#calculator")} className="ll-mobile-drawer-link" onClick={() => setMenuOpen(false)}>
                <span>Instant Estimate Calculator</span>
                <span>→</span>
              </a>
              <a href={sec("#gallery")} className="ll-mobile-drawer-link" onClick={() => setMenuOpen(false)}>
                <span>Before &amp; After Transformations</span>
                <span>→</span>
              </a>
              <Link href="/pins/" className="ll-mobile-drawer-link" onClick={() => setMenuOpen(false)}>
                <span>📍 Interactive Project Pins Map (32)</span>
                <span>→</span>
              </Link>
              <a href={sec("#reviews")} className="ll-mobile-drawer-link" onClick={() => setMenuOpen(false)}>
                <span>Verified Google &amp; Facebook Reviews</span>
                <span>→</span>
              </a>
              <a href={sec("#service-areas")} className="ll-mobile-drawer-link" onClick={() => setMenuOpen(false)}>
                <span>Service Areas &amp; Route Checker</span>
                <span>→</span>
              </a>
              <a href={sec("#contact")} className="ll-mobile-drawer-link" onClick={() => setMenuOpen(false)}>
                <span>Request Free Estimate</span>
                <span>→</span>
              </a>
            </div>

            <div className="ll-mobile-drawer-ctas">
              <a href="tel:6019061281" className="ll-btn-phone-outline" style={{ justifyContent: "center" }}>
                Call (601) 906-1281
              </a>
              <a
                href="sms:6019061281?body=Hi%20Luke,%20I%27d%20like%20a%20free%20estimate%20for%20lawn%20care!"
                className="ll-btn-cta-green"
              >
                Text Luke Now
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/embed")) {
    return null;
  }

  const isHome = pathname === "/";
  const sec = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <>
      <footer className="ll-footer">
        <div className="ll-container">
          <div className="ll-footer-grid">
            {/* Brand Column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logos/lungrins-logo.webp"
                  alt="Lungrin's Lawncare crest"
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  style={{ borderRadius: "10px", objectFit: "cover" }}
                />
                <div>
                  <div style={{ color: "#ffffff", fontWeight: 900, fontSize: "1.15rem" }}>
                    Lungrin&apos;s <span style={{ color: "#4ade80" }}>Lawncare</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>
                    Locally Owned &amp; Operated • Flora, MS
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.65, marginBottom: "1.1rem" }}>
                Premium, meticulous lawn maintenance, rolled longleaf pine straw, fall &amp; winter leaf cleanups, bush trimming, flowerbed makeovers, pond &amp; fence clearing, and junk/debris hauling without the inflated price.
              </p>
              <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
                <a
                  href="https://www.facebook.com/LungrinsLawncare"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Lungrin's Lawncare on Facebook"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </a>
                <a
                  href="https://www.google.com/maps/place/?q=place_id:ChIJvYxgYy-ipy0ReT6NyUfsbCM"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Lungrin's Lawncare on Google Maps"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
                  </svg>
                </a>
                <a
                  href="tel:6019061281"
                  aria-label="Call Luke Lungrin at 601-906-1281"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "rgba(34,197,94,0.2)",
                    color: "#4ade80",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Services Column */}
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.86rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.95rem" }}>
                Year-Round Services
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.52rem" }}>
                <li><Link href="/services/pine-straw-mulch-installation/" className="ll-footer-link">Rolled Longleaf Pine Straw &amp; Mulch</Link></li>
                <li><Link href="/services/leaf-removal-winter-yard-cleanup/" className="ll-footer-link">Fall &amp; Winter Leaf Removal</Link></li>
                <li><Link href="/services/pond-bank-fence-line-bush-hogging/" className="ll-footer-link">Pond Bank, Fence &amp; Bush Hogging</Link></li>
                <li><Link href="/services/junk-removal-yard-debris-hauling/" className="ll-footer-link">Junk &amp; Yard Debris Haul-Away</Link></li>
                <li><Link href="/services/flowerbed-cleanup-shrub-tree-planting/" className="ll-footer-link">Flowerbed Cleanups &amp; Planting</Link></li>
                <li><Link href="/services/bush-hedge-trimming/" className="ll-footer-link">Bush &amp; Hedge Trimming</Link></li>
                <li><Link href="/services/lawn-mowing-edging-striping/" className="ll-footer-link">Residential Lawn Mowing &amp; Striping</Link></li>
                <li><Link href="/services/acreage-mowing-overgrowth-recovery/" className="ll-footer-link">Acreage &amp; Overgrowth Recovery</Link></li>
              </ul>
            </div>

            {/* Service Areas Column */}
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.86rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.95rem" }}>
                Service Areas
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.52rem" }}>
                <li><Link href="/service-areas/flora-ms/" className="ll-footer-link">Flora, MS (39071)</Link></li>
                <li><Link href="/service-areas/madison-ms/" className="ll-footer-link">Madison &amp; Annandale, MS</Link></li>
                <li><Link href="/service-areas/gluckstadt-ms/" className="ll-footer-link">Gluckstadt, MS</Link></li>
                <li><Link href="/service-areas/ridgeland-ms/" className="ll-footer-link">Ridgeland, MS</Link></li>
                <li><Link href="/service-areas/jackson-ms/" className="ll-footer-link">North Jackson, MS</Link></li>
                <li><Link href="/service-areas/pocahontas-ms/" className="ll-footer-link">Pocahontas, MS</Link></li>
                <li><Link href="/service-areas/bentonia-ms/" className="ll-footer-link">Bentonia, MS</Link></li>
                <li><Link href="/service-areas/yazoo-county-ms/" className="ll-footer-link">Yazoo County &amp; Bee Lake, MS</Link></li>
              </ul>
            </div>

            {/* Direct Contact Column */}
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.86rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.95rem" }}>
                Direct Contact
              </div>
              <div style={{ display: "grid", gap: "0.65rem", fontSize: "0.86rem" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Owner / Operator</div>
                  <div style={{ color: "#ffffff", fontWeight: 700 }}>Luke Lungrin</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Call or Text</div>
                  <a href="tel:6019061281" className="ll-footer-link" style={{ color: "#4ade80", fontWeight: 800, fontSize: "0.98rem" }}>
                    (601) 906-1281
                  </a>
                  <span style={{ margin: "0 0.4rem", color: "#475569" }}>•</span>
                  <a href="tel:6019061282" className="ll-footer-link" style={{ fontWeight: 700 }}>
                    (601) 906-1282
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Hours</div>
                  <div style={{ color: "#cbd5e1" }}>Mon – Sat: 7:00 AM – 6:30 PM</div>
                </div>
                <div style={{ paddingTop: "0.25rem" }}>
                  <a href={sec("#calculator")} className="ll-btn-cta-green" style={{ width: "100%" }}>
                    Calculate Instant Estimate
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.75rem 1.5rem",
              fontSize: "0.78rem",
              color: "#94a3b8",
            }}
          >
            <div>
              © {new Date().getFullYear()} Lungrin&apos;s Lawncare. All Rights Reserved.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <Link href="/privacy-policy/" className="ll-footer-link" style={{ fontSize: "0.78rem" }}>Privacy Policy</Link>
              <Link href="/terms-and-conditions/" className="ll-footer-link" style={{ fontSize: "0.78rem" }}>Terms &amp; Conditions</Link>
              <Link href="/admin/drop-pin/" className="ll-footer-link" style={{ fontSize: "0.78rem" }}>Field Crew Login</Link>
              <span>•</span>
              <span>
                Built by{" "}
                <a
                  href="https://powerdigitalmedia.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ll-footer-link"
                  style={{ color: "#4ade80", fontWeight: 700, fontSize: "0.78rem" }}
                >
                  Power Digital Media
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Bar */}
      <div className="ll-mobile-sticky-bar">
        <a
          href="tel:6019061281"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.35rem",
            padding: "0.65rem 0.5rem",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.1)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "0.78rem",
            textDecoration: "none",
          }}
        >
          📞 Call Luke
        </a>
        <a
          href="sms:6019061281?body=Hi%20Luke,%20I%27d%20like%20a%20free%20lawn%20care%20estimate!"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.35rem",
            padding: "0.65rem 0.5rem",
            borderRadius: "10px",
            background: "rgba(34,197,94,0.18)",
            border: "1px solid rgba(74,222,128,0.4)",
            color: "#86efac",
            fontWeight: 800,
            fontSize: "0.78rem",
            textDecoration: "none",
          }}
        >
          💬 Text Quote
        </a>
        <a
          href={sec("#calculator")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.65rem 0.5rem",
            borderRadius: "10px",
            background: "#4ade80",
            color: "#052e16",
            fontWeight: 900,
            fontSize: "0.78rem",
            textDecoration: "none",
          }}
        >
          ⚡ Estimate
        </a>
      </div>
    </>
  );
}
