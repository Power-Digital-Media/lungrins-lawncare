"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCompanyConfig } from "@/hooks/useCompanyConfig";

interface Pin {
  id: string;
  location: string;
  service: string;
  author: string;
  date: string;
  description: string;
  detailedExplanation: string;
  images: string[];
  latitude?: number;
  longitude?: number;
}

interface MapModalProps {
  pin: Pin;
  onClose: () => void;
  clientId?: string;
}

export default function MapModal({ pin, onClose, clientId }: MapModalProps) {
  const { config } = useCompanyConfig(clientId);
  const { cityCoords, mapCenter } = config;
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const modalMapRef = useRef<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state on client-side to prevent hydration mismatch with React Portal
  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(handle);
      setMounted(false);
    };
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!mounted || !modalContainerRef.current) return;

    let pinCoords: [number, number];
    if (pin.latitude && pin.longitude) {
      pinCoords = [pin.latitude, pin.longitude];
    } else {
      const baseCoords = cityCoords[pin.location] || mapCenter;
      const seed = parseInt(pin.id, 10) || 1;
      const latJitter = Math.sin(seed) * 0.016;
      const lngJitter = Math.cos(seed) * 0.016;
      pinCoords = [baseCoords[0] + latJitter, baseCoords[1] + lngJitter];
    }

    const map = L.map(modalContainerRef.current, {
      center: pinCoords,
      zoom: 17,
      zoomControl: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      boxZoom: true,
      keyboard: true,
      attributionControl: true
    });

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }).addTo(map);

    const goldIcon = L.divIcon({
      html: `
        <div class="mini-gold-pin">
          <div class="mini-pulse"></div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:28px; height:28px; color:#e2b047; filter: drop-shadow(0 3px 5px rgba(0,0,0,0.5))">
            <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
      `,
      className: "custom-leaflet-mini-marker",
      iconSize: [28, 38],
      iconAnchor: [14, 38]
    });

    L.marker(pinCoords, { icon: goldIcon }).addTo(map);
    modalMapRef.current = map;

    return () => {
      if (modalMapRef.current) {
        modalMapRef.current.remove();
        modalMapRef.current = null;
      }
    };
  }, [mounted, pin, cityCoords, mapCenter]);

  // Dynamic Bento Grid classes helper
  const displayImages = pin.images ? pin.images.slice(0, 4) : [];
  const getBentoClass = (index: number, total: number) => {
    if (total === 1) return "bento-full";
    if (total === 2) {
      return index === 0 ? "bento-hero-half" : "bento-sub-half";
    }
    if (total === 3) {
      if (index === 0) return "bento-hero-3";
      return "bento-sub-3";
    }
    // total >= 4
    if (index === 0) return "bento-hero-4";
    if (index === 1) return "bento-sub-4-top";
    if (index === 2) return "bento-sub-4-bottom";
    return "bento-sub-4-wide";
  };

  // Only render on the client side
  if (!mounted) return null;

  const modalJSX = (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="double-bezel-wrapper modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="double-bezel-inner modal-inner">
          
          {/* Modal Header */}
          <div className="modal-header">
            <div>
              <span className="modal-eyebrow">Interactive Satellite View</span>
              <h4 className="modal-title">{pin.service}</h4>
              <span className="modal-location">{pin.location}</span>
            </div>
            <button className="modal-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>

          {/* Modal Map Container */}
          <div className="modal-map-container">
            <div ref={modalContainerRef} style={{ width: "100%", height: "100%" }} />
          </div>

          {/* Job Details Section */}
          <div className="modal-details">
            <p className="modal-desc">
              <strong>Job Description: </strong>
              {"\""}{pin.description}{"\""}
            </p>
            {pin.detailedExplanation && (
              <p className="modal-explanation">
                <strong>Project Details: </strong>
                {pin.detailedExplanation}
              </p>
            )}
            <div className="modal-footer">
              <span className="modal-completed-by">
                Completed by <strong>{pin.author}</strong> on {pin.date}
              </span>
              <a href={`/pin-page/?id=${pin.id}`} className="modal-cta-btn">
                View Full Case Study &rarr;
              </a>
            </div>
          </div>

          {/* Project Images Bento Gallery Section */}
          {displayImages.length > 0 && (
            <div className="modal-gallery">
              <h5 className="modal-gallery-title">Project Photographs</h5>
              <div className="modal-gallery-grid">
                {displayImages.map((img, idx) => {
                  const bentoClass = getBentoClass(idx, displayImages.length);
                  return (
                    <div key={idx} className={`modal-gallery-item ${bentoClass}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={img} 
                        alt={`Project check-in photo ${idx + 1}`} 
                        className="modal-gallery-img"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx global>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(5, 6, 8, 0.92);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 999999; /* Higher z-index to stay above everything */
          overflow-y: auto;
          padding: 2.5rem 0;
        }

        .modal-wrapper {
          width: 90%;
          max-width: 850px;
          padding: 0 !important;
          animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          margin-bottom: 2rem;
        }

        .modal-inner {
          padding: 1.5rem !important;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border);
          padding-bottom: 0.75rem;
        }

        .modal-eyebrow {
          color: var(--secondary);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
          margin: 2px 0;
        }

        .modal-location {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.8rem;
          line-height: 1;
          cursor: pointer;
          transition: color var(--transition-fast);
          padding: 0 0.5rem;
        }

        .modal-close-btn:hover {
          color: #ffffff;
        }

        .modal-map-container {
          width: 100%;
          height: 380px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--border);
        }

        /* Modal Details Styling */
        .modal-details {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          border-top: 1px solid var(--border);
          padding-top: 0.75rem;
        }

        .modal-desc {
          color: var(--text);
          font-size: 0.92rem;
          line-height: 1.5;
          font-style: italic;
          margin: 0;
        }

        .modal-explanation {
          color: var(--text-muted);
          font-size: 0.84rem;
          line-height: 1.5;
          margin: 0;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .modal-completed-by {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .modal-completed-by strong {
          color: #ffffff;
        }

        .modal-cta-btn {
          display: inline-block;
          background: var(--secondary);
          color: var(--primary-dark) !important;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 6px 14px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s ease-in-out;
          border: 1px solid var(--secondary);
        }

        .modal-cta-btn:hover {
          background: transparent;
          color: var(--secondary) !important;
          box-shadow: 0 0 12px rgba(226, 176, 71, 0.25);
        }

        /* Modal Gallery Styling */
        .modal-gallery {
          margin-top: 0.5rem;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .modal-gallery-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--secondary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0;
        }

        /* Bento Grid Core */
        .modal-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          width: 100%;
        }

        .modal-gallery-item {
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--border);
          position: relative;
          background: rgba(255, 255, 255, 0.01);
          transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out;
        }

        .modal-gallery-item:hover {
          transform: translateY(-2px);
          border-color: var(--secondary);
          z-index: 10;
        }

        .modal-gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease-in-out;
        }

        .modal-gallery-item:hover .modal-gallery-img {
          transform: scale(1.06);
        }

        /* Bento Sizes */
        .bento-full {
          grid-column: span 3;
          height: 320px;
        }

        .bento-hero-half {
          grid-column: span 2;
          height: 260px;
        }

        .bento-sub-half {
          grid-column: span 1;
          height: 260px;
        }

        .bento-hero-3 {
          grid-column: span 2;
          grid-row: span 2;
          height: 280px;
        }

        .bento-sub-3 {
          grid-column: span 1;
          height: 136px;
        }

        .bento-hero-4 {
          grid-column: span 2;
          grid-row: span 2;
          height: 300px;
        }

        .bento-sub-4-top {
          grid-column: span 1;
          grid-row: span 1;
          height: 146px;
        }

        .bento-sub-4-bottom {
          grid-column: span 1;
          grid-row: span 1;
          height: 146px;
        }

        .bento-sub-4-wide {
          grid-column: span 3;
          height: 140px;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 600px) {
          .modal-gallery-grid {
            display: flex;
            flex-direction: column;
          }
          .bento-full,
          .bento-hero-half,
          .bento-sub-half,
          .bento-hero-3,
          .bento-sub-3,
          .bento-hero-4,
          .bento-sub-4-top,
          .bento-sub-4-bottom,
          .bento-sub-4-wide {
            width: 100% !important;
            height: 180px !important;
          }
        }

        @media (max-height: 800px) {
          .modal-map-container {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
