"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCompanyConfig } from "@/hooks/useCompanyConfig";

interface Pin {
  id: string;
  location: string;
  service: string;
  latitude?: number;
  longitude?: number;
}

interface IndividualProjectMapProps {
  pin: Pin;
  onEnlarge?: () => void;
  clientId?: string;
}

export default function IndividualProjectMap({ pin, onEnlarge, clientId }: IndividualProjectMapProps) {
  const { config } = useCompanyConfig(clientId);
  const { cityCoords, mapCenter } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Setup Intersection Observer to lazy-load the small map
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "250px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize Leaflet Map on Card
  useEffect(() => {
    if (!isVisible || !containerRef.current || mapRef.current) return;

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

    const map = L.map(containerRef.current, {
      center: pinCoords,
      zoom: 15,
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
      attributionControl: false // Remove white attribution box on cards
    });

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}").addTo(map);

    const goldIcon = L.divIcon({
      html: `
        <div class="mini-gold-pin">
          <div class="mini-pulse"></div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:24px; height:24px; color:#e2b047; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
            <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
      `,
      className: "custom-leaflet-mini-marker",
      iconSize: [24, 34],
      iconAnchor: [12, 34]
    });

    L.marker(pinCoords, { icon: goldIcon }).addTo(map);
    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isVisible, pin.id, pin.location, cityCoords, mapCenter]);

  return (
    <>
      <div 
        className="individual-project-map-container"
        onClick={() => onEnlarge && onEnlarge()}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "#0f172a",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid var(--border)",
          cursor: onEnlarge ? "pointer" : "default"
        }}
      >
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

        {!isVisible && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            color: "rgba(255, 255, 255, 0.2)",
            fontSize: "0.75rem",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Satellite Map...
          </div>
        )}

        {/* Hover Overlay indicating map is clickable */}
        {onEnlarge && (
          <div className="map-click-overlay">
            <span className="overlay-text">🔍 View Satellite</span>
          </div>
        )}
        
        {/* City Badge label floating at the bottom center */}
        <span className="map-city-badge">
          {pin.location}
        </span>
      </div>

      <style jsx global>{`
        /* Card Hover Overlay styling */
        .map-click-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 12, 16, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.2s ease-in-out;
          z-index: 1001; /* Sit above Leaflet layers */
        }

        .individual-project-map-container:hover .map-click-overlay {
          background: rgba(10, 12, 16, 0.4);
          opacity: 1;
        }

        .overlay-text {
          background: #0f172a;
          border: 1px solid var(--secondary);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 30px;
          transform: translateY(8px);
          transition: transform 0.2s ease-in-out;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          letter-spacing: 0.02em;
        }

        .individual-project-map-container:hover .overlay-text {
          transform: translateY(0);
        }

        .map-city-badge {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(10, 12, 16, 0.85);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          padding: 3px 10px;
          color: #ffffff;
          fontSize: 0.68rem;
          font-weight: 700;
          white-space: nowrap;
          letter-spacing: 0.02em;
          z-index: 1000;
          transition: opacity 0.2s ease-in-out;
        }

        .individual-project-map-container:hover .map-city-badge {
          opacity: 0;
        }

        /* Marker & Pulse styles */
        .custom-leaflet-mini-marker {
          background: transparent !important;
          border: none !important;
        }

        .mini-gold-pin {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 34px;
        }

        .mini-pulse {
          position: absolute;
          bottom: 1px;
          left: 50%;
          transform: translateX(-50%) scale(1);
          width: 12px;
          height: 6px;
          background: rgba(226, 176, 71, 0.4);
          border-radius: 50%;
          animation: miniMarkerPulse 2.2s infinite ease-out;
          z-index: 1;
        }

        @keyframes miniMarkerPulse {
          0% { transform: translateX(-50%) scale(0.6); opacity: 1; }
          100% { transform: translateX(-50%) scale(2.2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
