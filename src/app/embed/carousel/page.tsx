"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectsCarousel from "@/components/ProjectsCarousel";

import DynamicBrandStyles from "@/components/DynamicBrandStyles";

function EmbedCarouselContent() {
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get("clientId") || undefined;

  return (
    <div style={{ width: "100%", margin: 0, padding: 0 }}>
      <DynamicBrandStyles />
      <ProjectsCarousel clientId={clientIdParam} />
    </div>
  );
}

export default function EmbedCarouselPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--text-muted)" }}>
        <h4>Loading Projects Showcase...</h4>
      </div>
    }>
      <EmbedCarouselContent />
    </Suspense>
  );
}
