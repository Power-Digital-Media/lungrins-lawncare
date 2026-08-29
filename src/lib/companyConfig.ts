import companyConfigMap from "@/data/company-config.json";

export interface CompanyTheme {
  primaryRgb: string;
  secondaryRgb: string;
  accentRgb: string;
  bgRgb: string;
  cardBgRgb: string;
}

export interface CompanyBrand {
  phone: string;
  email: string;
  tagline: string;
  logoText: string;
  logoSubtext: string;
  logoImg: string;
}

export interface CompanyConfig {
  clientId: string;
  companyName: string;
  portalPasscode: string;
  reviewUrl: string;
  mapCenter: [number, number];
  theme?: CompanyTheme;
  brand?: CompanyBrand;
  authorList: string[];
  serviceList: string[];
  cityCoords: Record<string, [number, number]>;
}

export const DEFAULT_CONFIG: CompanyConfig = companyConfigMap["generic-tenant"] as unknown as CompanyConfig;

export function getCompanyConfigSync(clientIdOverride?: string): CompanyConfig {
  const companyConfig = companyConfigMap as unknown as Record<string, CompanyConfig>;
  if (clientIdOverride && companyConfig[clientIdOverride]) {
    return companyConfig[clientIdOverride];
  }
  const envClientId = process.env.NEXT_PUBLIC_PDM_CLIENT_ID || process.env.PDM_CLIENT_ID;
  if (envClientId && companyConfig[envClientId]) {
    return companyConfig[envClientId];
  }
  return DEFAULT_CONFIG;
}
