import { NextResponse } from "next/server";
import companyConfig from "@/data/company-config.json";

export const dynamic = "force-dynamic";

function parseFirestoreConfig(doc: any): any {
  if (!doc || !doc.fields) return null;
  const fields = doc.fields;
  
  const parseVal = (f: any): any => {
    if (!f) return undefined;
    if (f.stringValue !== undefined) return f.stringValue;
    if (f.doubleValue !== undefined) return parseFloat(f.doubleValue);
    if (f.integerValue !== undefined) return parseInt(f.integerValue, 10);
    if (f.booleanValue !== undefined) return f.booleanValue;
    if (f.arrayValue?.values) return f.arrayValue.values.map((v: any) => parseVal(v));
    if (f.mapValue?.fields) {
      const res: any = {};
      for (const [k, val] of Object.entries(f.mapValue.fields)) {
        res[k] = parseVal(val);
      }
      return res;
    }
    return undefined;
  };

  const parsed: any = {};
  for (const [key, val] of Object.entries(fields)) {
    parsed[key] = parseVal(val);
  }
  return parsed;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryClientId = searchParams.get("clientId");
    const envClientId = process.env.PDM_CLIENT_ID;
    
    // Resolve active client ID (query overrides environment, falling back to generic-tenant)
    const activeClientId = queryClientId || envClientId || "lungrins-lawncare";
    
    let config = (companyConfig as any)[activeClientId];
    
    if (!config) {
      // Try fetching from Firestore settings
      const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${activeClientId}`;
      try {
        const firestoreRes = await fetch(firestoreUrl, { cache: "no-store" });
        if (firestoreRes.ok) {
          const doc = await firestoreRes.json();
          const parsed = parseFirestoreConfig(doc);
          if (parsed && parsed.clientId) {
            config = parsed;
          }
        }
      } catch (err) {
        console.error(`Failed to fetch client config from Firestore for: ${activeClientId}`, err);
      }
    }
    
    if (!config) {
      // Fallback to generic-tenant if resolved config does not exist anywhere
      const fallbackConfig = (companyConfig as any)["lungrins-lawncare"];
      return NextResponse.json(fallbackConfig, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "CDN-Cache-Control": "no-store"
        }
      });
    }
    
    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("API GET config error:", error);
    return NextResponse.json({ error: "Failed to resolve configuration" }, { status: 500 });
  }
}
