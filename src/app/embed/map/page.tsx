"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useCompanyConfig } from "@/hooks/useCompanyConfig";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.02)", color: "var(--text-muted)" }}>
      <h4>Loading Map Widget...</h4>
    </div>
  )
});

interface Pin {
  id: string;
  author: string;
  date: string;
  location: string;
  service: string;
  description: string;
  images: string[];
  latitude?: number;
  longitude?: number;
}

import DynamicBrandStyles from "@/components/DynamicBrandStyles";

function EmbedMapContent() {
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get("clientId") || undefined;
  const { config } = useCompanyConfig(clientIdParam);
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = clientIdParam ? `/api/pins?clientId=${encodeURIComponent(clientIdParam)}` : "/api/pins";
    fetch(url)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch pins for embed");
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPins(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("[Embed Map] fetch error:", err);
        setLoading(false);
      });
  }, [clientIdParam]);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.02)", color: "var(--text-muted)" }}>
        <h4>Loading dynamic projects map...</h4>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      <DynamicBrandStyles />
      <InteractiveMap pins={pins} clientId={clientIdParam} fullHeight={true} />
    </div>
  );
}

export default function EmbedMapPage() {
  return (
    <Suspense fallback={
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.02)", color: "var(--text-muted)" }}>
        <h4>Loading map viewport...</h4>
      </div>
    }>
      <EmbedMapContent />
    </Suspense>
  );
}
