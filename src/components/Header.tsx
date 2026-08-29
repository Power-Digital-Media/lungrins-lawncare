"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCompanyConfig } from "@/hooks/useCompanyConfig";

function HeaderContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get("clientId") || undefined;
  const { config } = useCompanyConfig(clientIdParam);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "unset";
    }
  };

  const getQueryStr = (path: string) => {
    return clientIdParam ? `${path}?clientId=${encodeURIComponent(clientIdParam)}` : path;
  };

  return (
    <header className="glass header-container">
      <div className="container header-inner">
        
        {/* Logo / Brand */}
        <Link href={getQueryStr("/")} className="logo-link" onClick={closeMenu}>
          {config.brand?.logoImg ? (
            <img src={config.brand.logoImg} alt={`${config.companyName} Logo`} className="logo-img" />
          ) : (
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--secondary, #e2b047)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "bold", fontSize: "0.85rem" }}>
              {(config.brand?.logoText || config.companyName || "P").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="logo-text-wrapper">
            <span className="logo-title">{config.brand?.logoText || config.companyName || "PDM PinDrop"}</span>
            {config.brand?.logoSubtext && (
              <span className="logo-subtitle">{config.brand.logoSubtext}</span>
            )}
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          <Link href={getQueryStr("/pins")} className="nav-link">Interactive Map</Link>
          <Link href={getQueryStr("/admin/drop-pin")} className="nav-link">Admin Portal</Link>
          {config.brand?.phone && (
            <a href={`tel:${config.brand.phone.replace(/[^0-9]/g, "")}`} className="btn btn-primary btn-island">
              Call: {config.brand.phone}
            </a>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            if (typeof document !== "undefined") {
              document.body.style.overflow = !mobileMenuOpen ? "hidden" : "unset";
            }
          }}
          className={`mobile-toggle ${mobileMenuOpen ? "open" : ""}`}
          aria-label="Toggle Menu"
        >
          <span className="line line-1"></span>
          <span className="line line-2"></span>
        </button>

      </div>

      {/* Mobile nav drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-links">
          <Link href={getQueryStr("/pins")} className="mobile-nav-link" onClick={closeMenu}>Interactive Map</Link>
          <Link href={getQueryStr("/admin/drop-pin")} className="mobile-nav-link" onClick={closeMenu}>Admin Portal</Link>
          {config.brand?.phone && (
            <div className="mobile-nav-phone mobile-nav-link">
              <a href={`tel:${config.brand.phone.replace(/[^0-9]/g, "")}`} onClick={closeMenu}>
                Call: {config.brand.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="glass header-container">
        <div className="container header-inner">
          <div className="logo-text-wrapper">
            <span className="logo-title">PDM PinDrop</span>
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  );
}
