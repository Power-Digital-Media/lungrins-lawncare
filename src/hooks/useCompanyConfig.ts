"use client";

import { useState, useEffect } from "react";
import { CompanyConfig, getCompanyConfigSync } from "@/lib/companyConfig";

export type { CompanyConfig, CompanyTheme, CompanyBrand } from "@/lib/companyConfig";

const configPromiseCache = new Map<string, Promise<CompanyConfig | null>>();

export function useCompanyConfig(clientId?: string) {
  const [config, setConfig] = useState<CompanyConfig>(() => getCompanyConfigSync(clientId));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const targetCid = clientId || "";
    const syncConfig = getCompanyConfigSync(clientId);
    setConfig(syncConfig);

    let pending = configPromiseCache.get(targetCid);
    if (!pending) {
      pending = fetch(`/api/config/?clientId=${encodeURIComponent(targetCid)}`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);
      configPromiseCache.set(targetCid, pending);
    }

    let cancelled = false;
    setLoading(true);
    pending
      .then((data) => {
        if (!cancelled && data && data.clientId) {
          setConfig(data);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return { config, loading };
}
