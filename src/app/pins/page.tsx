"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import pinsData from "@/data/pins.json";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="double-bezel-wrapper" style={{ width: "100%", marginBottom: "3rem" }}>
      <div className="double-bezel-inner" style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.01)", borderRadius: "16px" }}>
        <h4 style={{ color: "var(--text-muted)" }}>Loading Interactive Map...</h4>
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
      (p) => clientId ? (p.clientId || "generic-tenant") === clientId : true
    )
  );
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMapPin, setActiveMapPin] = useState<PinType | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

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
    setVisibleCount(12);
  }, [selectedLocation, selectedService, searchQuery]);

  const paginatedPins = useMemo(() => {
    return filteredPins.slice(0, visibleCount);
  }, [filteredPins, visibleCount]);

  return (
    <>
      {/* Hero */}
      <section className="pins-hero">
        <div className="container pins-hero-inner scroll-reveal">
          <span className="eyebrow" style={{ color: "var(--secondary)" }}>Live Job Feed</span>
          <h1>Local Project Pins</h1>
          <p className="hero-subtext">
            Real jobs, real photos, real locations. See our quality work at properties near you.
          </p>
        </div>
      </section>

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
              <div className="pins-grid-2col">
                {paginatedPins.map((pin) => (
                  <div key={pin.id} className="double-bezel-wrapper">
                    <div className="double-bezel-inner pin-feed-card">
                      
                      {/* Header */}
                      <div className="pin-feed-header">
                        <div className="pin-feed-author">
                          <h4>{pin.author}</h4>
                          <span className="pin-feed-date">{pin.date}</span>
                        </div>
                        <span className="pin-service-tag">
                          {pin.service.length > 15 ? pin.service.substring(0, 15) : pin.service}
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
                              alt={pin.service}
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
                                    alt="thumbnail"
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
                        <Link href={`/pin-page/?id=${pin.id}${clientId ? `&clientId=${clientId}` : ""}`} className="btn btn-outline pin-btn">
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
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="btn btn-outline"
                    style={{ padding: "0.9rem 2.2rem", fontSize: "0.9rem", fontWeight: 700 }}
                  >
                    Load More Projects
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
          background-image: linear-gradient(rgba(10, 12, 16, 0.90), rgba(10, 12, 16, 0.95));
          background-size: cover;
          background-position: center;
          color: #ffffff;
          padding: 8.5rem 0 6.5rem;
          text-align: center;
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

        .pin-feed-author h4 {
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
            padding: 6rem 0 2.5rem;
          }

          .pins-hero h1 {
            font-size: 1.8rem;
          }

          .hero-subtext {
            font-size: 1rem;
          }

          .filter-section {
            padding: 1.5rem 0;
          }

          .filter-container {
            gap: 1rem;
          }

          .filter-inputs {
            flex-direction: column;
            gap: 0.75rem;
          }

          .filter-group-item {
            min-width: 100%;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .pins-grid-section {
            overflow-x: hidden;
          }

          .pins-grid-section .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .pins-grid-2col {
            gap: 1.5rem;
          }

          .pins-grid-2col .double-bezel-wrapper {
            max-width: 100%;
            overflow: hidden;
          }

          .pin-feed-card {
            padding: 1.25rem !important;
            overflow: hidden;
            max-width: 100%;
          }

          .pin-feed-header {
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .pin-feed-author {
            min-width: 0;
            flex: 1;
          }

          .pin-feed-author h4 {
            font-size: 1rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .pin-service-tag {
            font-size: 0.65rem;
            padding: 3px 8px;
            white-space: nowrap;
            flex-shrink: 0;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .pin-feed-desc {
            font-size: 0.9rem;
            margin: 0 0 1.25rem;
            word-wrap: break-word;
            overflow-wrap: break-word;
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
    <Suspense fallback={
      <div style={{ padding: "6rem 0", textAlign: "center", color: "var(--text-muted)" }}>
        <h4>Loading Project Pins...</h4>
      </div>
    }>
      <PinsPageContent />
    </Suspense>
  );
}
