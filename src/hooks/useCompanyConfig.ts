"use client";

import { useState, useEffect } from "react";
import { CompanyConfig, getCompanyConfigSync } from "@/lib/companyConfig";

export type { CompanyConfig, CompanyTheme, CompanyBrand } from "@/lib/companyConfig";

export function useCompanyConfig(clientId?: string) {
  const [config, setConfig] = useState<CompanyConfig>(() => getCompanyConfigSync(clientId));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Use synchronous fallback immediately
    const syncConfig = getCompanyConfigSync(clientId);
    setConfig(syncConfig);

    // Fetch dynamic config from API
    const targetCid = clientId || "";
    fetch(`/api/config?clientId=${targetCid}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch config");
      })
      .then((data) => {
        if (data && data.clientId) {
          setConfig(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load company config dynamically:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clientId]);

  return { config, loading };
}
