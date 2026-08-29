"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyConfig } from "@/hooks/useCompanyConfig";

interface SchemaProps {
  pageTitle?: string;
  pageDescription?: string;
  path?: string;
}

function LocalBusinessSchemaContent({ pageTitle, pageDescription, path = "" }: SchemaProps) {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") || undefined;
  const { config } = useCompanyConfig(clientId);

  const host = typeof window !== "undefined" ? window.location.origin : "";
  const currentUrl = `${host}${path}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle || `${config.companyName} Project Page`,
    "description": pageDescription || `Verified service job details from ${config.companyName}`,
    "url": currentUrl,
    "publisher": {
      "@type": "Organization",
      "name": config.companyName,
      "logo": config.brand?.logoImg ? `${host}${config.brand.logoImg}` : undefined
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function LocalBusinessSchema(props: SchemaProps) {
  return (
    <Suspense fallback={null}>
      <LocalBusinessSchemaContent {...props} />
    </Suspense>
  );
}
