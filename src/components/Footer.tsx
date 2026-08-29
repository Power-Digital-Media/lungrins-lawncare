"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCompanyConfig } from "@/hooks/useCompanyConfig";

function FooterContent() {
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get("clientId") || undefined;
  const { config } = useCompanyConfig(clientIdParam);

  const getQueryStr = (path: string) => {
    return clientIdParam ? `${path}?clientId=${encodeURIComponent(clientIdParam)}` : path;
  };

  return (
    <footer className="footer" style={{ padding: "3rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="container">
        
        <div className="footer-top-grid" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between", marginBottom: "2rem" }}>
          
          {/* Brand Info */}
          <div className="footer-brand" style={{ maxWidth: "400px" }}>
            <Link href={getQueryStr("/")} className="footer-logo" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "1rem" }}>
              {config.brand?.logoImg ? (
                <img src={config.brand.logoImg} alt={`${config.companyName} Logo`} className="footer-logo-img" style={{ maxHeight: "32px" }} />
              ) : (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--secondary, #e2b047)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "bold", fontSize: "0.85rem" }}>
                  {(config.brand?.logoText || config.companyName || "P").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="logo-text-wrapper">
                <span className="logo-title" style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff" }}>
                  {config.brand?.logoText || config.companyName || "PDM PinDrop"}
                </span>
              </div>
            </Link>
            <p className="footer-description" style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.5", margin: "0 0 1rem 0" }}>
              {config.brand?.tagline || "Real-time Field Pin Drop & Local SEO Mapping Portal. Instantly demonstrate verification of completed local services."}
            </p>
            {config.brand?.phone && (
              <div className="footer-phone" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Call: <a href={`tel:${config.brand.phone.replace(/[^0-9]/g, "")}`} className="phone-highlight" style={{ color: "var(--secondary, #e2b047)", fontWeight: "600" }}>{config.brand.phone}</a>
              </div>
            )}
            {config.brand?.email && (
              <div className="footer-email" style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Email: <a href={`mailto:${config.brand.email}`} style={{ color: "var(--secondary, #e2b047)" }}>{config.brand.email}</a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-heading" style={{ fontSize: "0.9rem", color: "#fff", fontWeight: "600", marginBottom: "1rem" }}>Links</h4>
            <ul className="footer-links" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem" }}>
              <li><Link href={getQueryStr("/pins")} style={{ color: "var(--text-muted)", textDecoration: "none" }}>Interactive Map</Link></li>
              <li><Link href={getQueryStr("/admin/drop-pin")} style={{ color: "var(--text-muted)", textDecoration: "none" }}>Admin Portal</Link></li>
              <li><Link href={getQueryStr("/privacy-policy")} style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</Link></li>
              <li><Link href={getQueryStr("/terms-and-conditions")} style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms and Conditions</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem", flexWrap: "wrap", gap: "12px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <p>© {new Date().getFullYear()} {config.companyName || "PDM PinDrop"}. All Rights Reserved.</p>
          <div className="footer-legal" style={{ display: "flex", gap: "16px" }}>
            <Link href={getQueryStr("/privacy-policy")} style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy Policy</Link>
            <Link href={getQueryStr("/terms-and-conditions")} style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <Suspense fallback={
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} PDM PinDrop. All Rights Reserved.</p>
        </div>
      </footer>
    }>
      <FooterContent />
    </Suspense>
  );
}
