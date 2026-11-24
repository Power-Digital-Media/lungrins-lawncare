"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import pinsData from "@/data/pins.json";
import { getPinHref } from "@/data/services";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="double-bezel-wrapper" style={{ width: "100%", marginBottom: "3rem" }}>
      <div className="double-bezel-inner" style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.01)", borderRadius: "16px" }}>
        <div style={{ color: "var(--text-muted)", fontWeight: 700 }}>Loading Interactive Map...</div>
      </div>
    </div>
  )
});

const IndividualProjectMap = dynamic(() => import("@/components/IndividualProjectMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#0f172a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255, 255, 255, 0.2)", fontSize: "0.75rem" }}>
      Loading Satellite...
    </div>
  )
});

const MapModal = dynamic(() => import("@/components/MapModal"), {
  ssr: false
});

interface PinType {
  id: string;
  location: string;
  service: string;
  author: string;
  date: string;
  description: string;
  detailedExplanation: string;
  images: string[];
  title?: string;
  latitude?: number;
  longitude?: number;
  clientId?: string;
}

function PinsPageContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") || undefined;

  const [pins, setPins] = useState<PinType[]>(
    (pinsData as PinType[]).filter(
      (p) => clientId ? (p.clientId || "lungrins-lawncare") === clientId : true
    )
  );
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMapPin, setActiveMapPin] = useState<PinType | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const params = clientId ? `?clientId=${clientId}&t=${Date.now()}` : `?t=${Date.now()}`;
    fetch(`/api/pins/${params}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch live pins");
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPins(data);
        }
      })
      .catch((err) => console.error("Error fetching dynamic pins:", err));
  }, [clientId]);

  const locationsList = useMemo(() => {
    const locs = pins.map((pin) => pin.location);
    return Array.from(new Set(locs)).sort();
  }, [pins]);

  const servicesList = useMemo(() => {
    const svcs = pins.map((pin) => pin.service);
    return Array.from(new Set(svcs)).sort();
  }, [pins]);

  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      const matchLocation = selectedLocation ? pin.location === selectedLocation : true;
      const matchService = selectedService ? pin.service === selectedService : true;
      const matchSearch = searchQuery
        ? pin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pin.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (pin.detailedExplanation || "").toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchLocation && matchService && matchSearch;
    });
  }, [pins, selectedLocation, selectedService, searchQuery]);

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedLocation, selectedService, searchQuery]);

  const paginatedPins = useMemo(() => {
    return filteredPins.slice(0, visibleCount);
  }, [filteredPins, visibleCount]);

  return (
    <>
      {/* Filtering Section */}
      <section className="filter-section">
        <div className="container filter-container">
          
          <div className="filter-inputs">
            {/* Search Input */}
            <div className="filter-group-item search-wrapper">
              <input
                type="text"
                placeholder="Search jobs..."
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Location Select */}
            <div className="filter-group-item">
              <select
                className="form-input"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Service Select */}
            <div className="filter-group-item">
              <select
                className="form-input"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">All Services</option>
                {servicesList.map((svc) => (
                  <option key={svc} value={svc}>{svc}</option>
                ))}
              </select>
            </div>
          </div>

          {(selectedLocation || selectedService || searchQuery) && (
            <button
              onClick={() => {
                setSelectedLocation("");
                setSelectedService("");
                setSearchQuery("");
              }}
              className="btn btn-outline filter-clear-btn"
            >
              Clear Filters
            </button>
          )}

        </div>
      </section>

      {/* Grid List of Pins */}
      <section className="section pins-grid-section">
        <div className="container">
          <h2 style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" }}>
            Verified Central Mississippi Field Projects &amp; Satellite Map
          </h2>
          
          {/* Interactive Leaflet Map showing current pins */}
          <InteractiveMap pins={filteredPins} />

          
          {filteredPins.length === 0 ? (
            <div className="empty-pins">
              <span className="empty-pins-icon">🔍</span>
              <h3>No projects found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="pins-mobile-swipe-hint">
                ← Swipe project cards ({paginatedPins.length} shown) or tap any green map pin above →
              </div>
              <div className="pins-grid-2col">
                {paginatedPins.map((pin) => (
                  <div key={pin.id} className="double-bezel-wrapper">
                    <div className="double-bezel-inner pin-feed-card">
                      
                      {/* Header */}
                      <div className="pin-feed-header">
                        <div className="pin-feed-author">
                          <h3>{pin.author}</h3>
                          <span className="pin-feed-date">{pin.date}</span>
                        </div>
                        <span className="pin-service-tag">
                          {pin.service}
                        </span>
                      </div>

                      {/* Job Description (Italicized) */}
                      <p className="pin-feed-desc">
                        {"\""}{pin.description}{"\""}
                      </p>

                      {/* Media Row (Map on Left, Photo on Right) */}
                      <div className="pin-feed-media-row">
                        
                        {/* Satellite Project Map */}
                        <div className="local-job-map" style={{ padding: 0, border: "none", overflow: "hidden" }}>
                          <IndividualProjectMap pin={pin} onEnlarge={() => setActiveMapPin(pin)} />
                        </div>

                        {/* Photo Column */}
                        {pin.images && pin.images.length > 0 && (
                          <div className="pin-feed-photo-col">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={pin.images[0]}
                              alt={`${pin.service} in ${pin.location} by Lungrin's Lawncare`}
                              width={590}
                              height={443}
                              loading="lazy"
                              className="pin-feed-main-img"
                            />
                            {/* Secondary Preview Thumbnails */}
                            {pin.images.length > 1 && (
                              <div className="pin-feed-thumbs-row">
                                {pin.images.slice(1, 4).map((img, idx) => (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`${pin.service} photo ${idx + 2}`}
                                    width={100}
                                    height={80}
                                    loading="lazy"
                                    className="pin-feed-thumb"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                      {/* View Details Button */}
                      <div className="pin-feed-footer-btn">
                        <Link href={getPinHref(pin.id, clientId)} className="btn btn-outline pin-btn">
                          View Full Details
                        </Link>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {filteredPins.length > visibleCount && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "3.5rem" }}>
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="btn btn-outline"
                    style={{ padding: "0.9rem 2.2rem", fontSize: "0.9rem", fontWeight: 700 }}
                  >
                    Load More Projects ({filteredPins.length - visibleCount} more)
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Immersive Fullscreen Interactive Map Modal */}
      {activeMapPin && (
        <MapModal pin={activeMapPin} onClose={() => setActiveMapPin(null)} />
      )}
      
      <style jsx>{`
        .pins-hero {
          background-image: linear-gradient(155deg, #061b0e 0%, #0d311b 55%, #06180d 100%);
          background-size: cover;
          background-position: center;
          color: #ffffff;
          padding: 4rem 0 3.5rem;
          text-align: center;
          border-bottom: 1px solid rgba(74, 222, 128, 0.22);
        }

        .pins-mobile-swipe-hint {
          display: none;
          text-align: center;
          font-size: 0.78rem;
          font-weight: 700;
          color: #86efac;
          margin: -1.25rem 0 1rem;
        }

        .pins-hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pins-hero h1 {
          color: #ffffff;
          margin: 0.5rem 0 1rem;
        }

        .hero-subtext {
          color: #94a3b8;
          font-size: 1.15rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .filter-section {
          background: rgba(var(--primary-rgb), 0.02);
          border-bottom: 1px solid var(--border);
          padding: 2.5rem 0;
        }

        .filter-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          align-items: center;
          justify-content: space-between;
        }

        .filter-inputs {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          flex-grow: 1;
        }

        .filter-group-item {
          min-width: 180px;
        }

        .search-wrapper {
          min-width: 260px;
          flex-grow: 1;
        }

        .filter-clear-btn {
          padding: 0.8rem 1.5rem !important;
          font-size: 0.88rem;
        }

        .pins-grid-section {
          background: var(--bg);
        }

        .empty-pins {
          text-align: center;
          padding: 6rem 0;
        }

        .empty-pins-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .empty-pins h3 {
          font-size: 1.5rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .empty-pins p {
          color: var(--text-muted);
          margin: 0 auto;
        }

        .pin-feed-card {
          padding: 2.5rem !important;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .pin-feed-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }

        .pin-feed-author h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary);
          margin: 0;
        }

        .pin-feed-date {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
          display: block;
          margin-top: 2px;
        }

        .pin-feed-desc {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--text-muted);
          font-style: italic;
          font-family: Georgia, serif;
          margin: 0 0 2rem;
          flex-grow: 1;
        }

        .pin-feed-media-row {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          height: 200px;
        }

        @media (max-width: 580px) {
          .pin-feed-media-row {
            grid-template-columns: 1fr;
            height: auto;
          }
        }

        .local-job-map {
          position: relative;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border);
          border-radius: 12px;
          height: 100%;
          min-height: 180px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pin-feed-photo-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 100%;
        }

        .pin-feed-main-img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .pin-feed-thumbs-row {
          display: flex;
          gap: 8px;
          height: 40px;
        }

        .pin-feed-thumb {
          width: 50px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid var(--border);
          opacity: 0.7;
        }

        .pin-feed-footer-btn {
          margin-top: auto;
        }

        .pins-grid-2col {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
        }

        @media (max-width: 900px) {
          .pins-grid-2col {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        .pin-service-tag {
          display: inline-block;
          background: rgba(var(--secondary-rgb), 0.08);
          color: var(--secondary);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 100px;
          align-self: flex-start;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .pin-btn {
          width: 100%;
          font-size: 0.85rem;
          padding: 0.6rem !important;
          margin-top: auto;
        }

        @keyframes pinBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes pinPulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        @media (max-width: 768px) {
          .pins-hero {
            padding: 2.35rem 0 1.85rem;
          }

          .pins-mobile-swipe-hint {
            display: block;
          }

          .pins-hero h1 {
            font-size: 1.8rem;
          }

          .hero-subtext {
            font-size: 0.96rem;
          }

          .filter-section {
            padding: 1.25rem 0;
          }

          .filter-container {
            gap: 1rem;
          }

          .filter-inputs {
            flex-direction: column;
            gap: 0.65rem;
          }

          .filter-group-item {
            min-width: 100%;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .pins-grid-section {
            overflow-x: clip;
          }

          .pins-grid-section .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .pins-grid-2col {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-padding-inline: 1rem;
            gap: 1rem;
            margin: 0 -1rem;
            padding: 0.25rem 1rem 0.75rem;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .pins-grid-2col::-webkit-scrollbar {
            display: none;
          }

          .pins-grid-2col .double-bezel-wrapper {
            flex: 0 0 86%;
            max-width: 340px;
            scroll-snap-align: start;
            overflow: hidden;
          }

          .pin-feed-card {
            padding: 1.15rem !important;
            overflow: hidden;
            max-width: 100%;
          }

          .pin-feed-header {
            margin-bottom: 0.85rem;
            padding-bottom: 0.7rem;
            flex-wrap: wrap;
            gap: 0.45rem;
          }

          .pin-feed-author {
            min-width: 0;
            flex: 1;
          }

          .pin-feed-author h3 {
            font-size: 0.98rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .pin-service-tag {
            font-size: 0.64rem;
            padding: 3px 9px;
            white-space: nowrap;
            flex-shrink: 0;
            max-width: none;
          }

          .pin-feed-desc {
            font-size: 0.86rem;
            margin: 0 0 1rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .pin-feed-media-row {
            grid-template-columns: 1fr;
            height: auto;
            gap: 0.75rem;
            margin-bottom: 1.25rem;
          }

          .local-job-map {
            min-height: 160px;
            border-radius: 8px;
          }

          .pin-feed-main-img {
            height: 180px;
          }

          .pin-feed-footer-btn {
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default function PinsPage() {
  return (
    <>
      <section
        style={{
          backgroundImage: "linear-gradient(155deg, #061b0e 0%, #0d311b 55%, #06180d 100%)",
          color: "#ffffff",
          padding: "clamp(2.35rem, 5vw, 4rem) 0 clamp(1.85rem, 4vw, 3.5rem)",
          textAlign: "center",
          borderBottom: "1px solid rgba(74, 222, 128, 0.22)",
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span className="eyebrow" style={{ color: "var(--secondary)" }}>Live Job Feed</span>
          <h1 style={{ color: "#ffffff", margin: "0.5rem 0 0.85rem", fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}>
            Local Project Pins
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "clamp(0.96rem, 2vw, 1.12rem)", maxWidth: "600px", margin: "0 auto" }}>
            Real jobs, real photos, real locations across Flora, Madison, Gluckstadt, Ridgeland, Jackson, Bentonia &amp; Pocahontas.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />

      <Suspense
        fallback={
          <div style={{ padding: "4rem 0", textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>
            Loading Project Pins...
          </div>
        }
      >
        <PinsPageContent />
      </Suspense>
    </>
  );
}
