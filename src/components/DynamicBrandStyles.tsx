"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyConfig } from "@/hooks/useCompanyConfig";

function DynamicBrandStylesContent() {
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get("clientId");
  const { config } = useCompanyConfig(clientIdParam || undefined);

  if (!config.theme) return null;

  const { primaryRgb, secondaryRgb, accentRgb, bgRgb, cardBgRgb } = config.theme;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            ${primaryRgb ? `--primary-rgb: ${primaryRgb};` : ""}
            ${secondaryRgb ? `--secondary-rgb: ${secondaryRgb};` : ""}
            ${accentRgb ? `--accent-rgb: ${accentRgb};` : ""}
            ${bgRgb ? `--bg-rgb: ${bgRgb};` : ""}
            ${cardBgRgb ? `--card-bg-rgb: ${cardBgRgb};` : ""}
          }
        `,
      }}
    />
  );
}

export default function DynamicBrandStyles() {
  return (
    <Suspense fallback={null}>
      <DynamicBrandStylesContent />
    </Suspense>
  );
}
