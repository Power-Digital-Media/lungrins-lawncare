"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import rawPinsData from "@/data/pins.json";

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
  title: string;
  aeoAnswers: { question: string; answer: string; }[];
}

const pinsData = rawPinsData as unknown as PinType[];

interface ProjectsCarouselProps {
  clientId?: string;
}

export default function ProjectsCarousel({ clientId }: ProjectsCarouselProps) {
  const [activeMapPin, setActiveMapPin] = useState<PinType | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile to disable auto-play and infinite scroll
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load the default/fallback featured projects (empty by default for white-label app)
  const defaultFeatured = useMemo(() => {
    return [];
  }, []);

  const [featuredPins, setFeaturedPins] = useState<PinType[]>(defaultFeatured);

  useEffect(() => {
    const url = clientId ? `/api/pins?clientId=${encodeURIComponent(clientId)}&t=${Date.now()}` : `/api/pins?t=${Date.now()}`;
    fetch(url)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch live pins");
      })
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          // Filter database pins (which have long numerical timestamp IDs)
          const dbPins = data
            .filter((pin) => (Number(pin.id) || 0) > 1000000)
            .sort((a, b) => Number(b.id) - Number(a.id));
          
          // Cast database pins to match PinType (adding title parameter if missing)
          const formattedDbPins = dbPins.map(pin => ({
            ...pin,
            title: pin.title || `${pin.service} in ${pin.location}`,
            detailedExplanation: pin.detailedExplanation || "",
            aeoAnswers: pin.aeoAnswers || []
          })) as PinType[];
          
          const combined = [...formattedDbPins, ...defaultFeatured];
          const seen = new Set();
          const unique = combined.filter((p) => {
            const dup = seen.has(p.id);
            seen.add(p.id);
            return !dup;
          });
          
          setFeaturedPins(unique.slice(0, 12));
        }
      })
      .catch((err) => console.error("Error loading dynamic carousel pins:", err));
  }, [defaultFeatured, clientId]);

  // Triple the list to allow infinite scrolling in both directions (desktop only)
  const tripledPins = useMemo(() => {
    if (featuredPins.length <= 1) return featuredPins;
    return [...featuredPins, ...featuredPins, ...featuredPins];
  }, [featuredPins]);

  // Initialize scroll position to the start of the middle set — desktop only
  useEffect(() => {
    if (isMobile) return;
    const deck = deckRef.current;
    if (!deck || featuredPins.length <= 1) return;

    const cardWidth = 334; // 310px card width + 24px gap (1.5rem)
    const totalSetWidth = featuredPins.length * cardWidth;
    deck.scrollLeft = totalSetWidth;
  }, [featuredPins.length, isMobile]);

  // Auto-play timer — desktop only
  useEffect(() => {
    if (isMobile) return;
    if (!deckRef.current || featuredPins.length <= 1) return;

    const interval = setInterval(() => {
      if (isHovered) return;

      const deck = deckRef.current;
      if (!deck) return;

      const cardWidth = 334; // 310px card width + 24px gap (1.5rem)
      const totalSetWidth = featuredPins.length * cardWidth;
      const currentScroll = deck.scrollLeft;
      
      let nextScroll = currentScroll + cardWidth;
      // If next slide would cross beyond Set 2, snap back to Set 1 equivalent first
      if (nextScroll >= totalSetWidth * 2) {
        deck.scrollLeft = currentScroll - totalSetWidth;
        nextScroll = currentScroll - totalSetWidth + cardWidth;
      }

      deck.scrollTo({
        left: nextScroll,
        behavior: "smooth"
      });
    }, 4500); // Auto-slide every 4.5 seconds

    return () => clearInterval(interval);
  }, [featuredPins.length, isHovered, isMobile]);

  // Infinite scroll snap-back — desktop only
  const handleScroll = () => {
    if (isMobile) return;
    const deck = deckRef.current;
    if (!deck || featuredPins.length <= 1) return;

    const cardWidth = 334;
    const totalSetWidth = featuredPins.length * cardWidth;

    // If they drag too far right, subtract one full set width
    if (deck.scrollLeft >= totalSetWidth * 2.2) {
      deck.scrollLeft = deck.scrollLeft - totalSetWidth;
    }
    // If they drag too far left, add one full set width
    else if (deck.scrollLeft <= totalSetWidth * 0.8) {
      deck.scrollLeft = deck.scrollLeft + totalSetWidth;
    }
  };

  // Double the list for seamless CSS marquee loop on mobile
  const doubledPins = useMemo(() => {
    return [...featuredPins, ...featuredPins];
  }, [featuredPins]);

  // Choose which pin list to render
  const displayPins = isMobile ? doubledPins : tripledPins;

  if (featuredPins.length === 0) {
    return null;
  }

  return (
    <section className="marquee-section" style={{ padding: "3rem 0" }}>
      {/* Title Block */}
      <div className="container marquee-header" style={{ marginBottom: "2.5rem" }}>
        <span className="eyebrow" style={{ color: "var(--secondary)" }}>Our Work In Action</span>
        <h2>Recent Projects Showcase</h2>
        <p className="marquee-subheader" style={{ color: "var(--text-muted)", margin: "4px 0 0" }}>
          Browse our latest completed projects and case studies.
        </p>
      </div>

      {/* Horizontal Scroll Deck */}
      <div className="container">
        <div 
          className="pins-scroll-deck"
          ref={deckRef}
          onMouseEnter={isMobile ? undefined : () => setIsHovered(true)}
          onMouseLeave={isMobile ? undefined : () => setIsHovered(false)}
          onTouchStart={isMobile ? undefined : () => setIsHovered(true)}
          onScroll={isMobile ? undefined : handleScroll}
          style={{ paddingBottom: "1.5rem" }}
        >
          {displayPins.map((pin, idx) => (
            <div key={`${pin.id}-${idx}`} className="double-bezel-wrapper pin-scroll-card-wrapper">
              <div className="double-bezel-inner pin-scroll-card">
                
                {/* Badge Row */}
                <div className="pin-card-badge-row">
                  <span className="pin-card-city">{pin.location}</span>
                  <span className="pin-card-date">{pin.date}</span>
                </div>

                {/* Satellite Project Map */}
                <div className="pin-card-img-container" style={{ position: "relative" }}>
                  <IndividualProjectMap pin={pin} onEnlarge={() => setActiveMapPin(pin)} clientId={clientId} />
                </div>

                {/* Description */}
                <div className="pin-card-details">
                  <span className="pin-card-tech">Completed by {pin.author}</span>
                  <p className="pin-card-desc">
                    {"\""}{pin.description.length > 95 ? pin.description.substring(0, 95) + "…" : pin.description}{"\""}
                  </p>
                  <Link href={`/pin-page/?id=${pin.id}`} className="btn btn-outline pin-card-btn">
                    View Case Study
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Interactive Map Modal for dynamic showcase card enlargement */}
      {activeMapPin && (
        <MapModal pin={activeMapPin} onClose={() => setActiveMapPin(null)} clientId={clientId} />
      )}
    </section>
  );
}
