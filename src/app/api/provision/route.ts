import { NextRequest, NextResponse } from "next/server";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";

function serializeToFirestoreFields(obj: any): any {
  if (obj === null || obj === undefined) return { nullValue: null };
  if (typeof obj === "string") return { stringValue: obj };
  if (typeof obj === "number") return { doubleValue: obj };
  if (typeof obj === "boolean") return { booleanValue: obj };
  if (Array.isArray(obj)) {
    return {
      arrayValue: {
        values: obj.map((item) => serializeToFirestoreFields(item))
      }
    };
  }
  if (typeof obj === "object") {
    const fields: any = {};
    for (const [key, val] of Object.entries(obj)) {
      fields[key] = serializeToFirestoreFields(val);
    }
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientId,
      companyName,
      rooferPasscode,
      googleReviewUrl,
      mapCenter = [32.2729, -90.1312],
      theme,
      brand,
      technicians = [],
      serviceList = []
    } = body;

    if (!clientId || !companyName || !rooferPasscode) {
      return NextResponse.json({ error: "Client ID, Company Name, and Passcode are required." }, { status: 400 });
    }

    // Standardize slug format for client ID
    const slug = clientId.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "");

    const payload = {
      clientId: slug,
      companyName,
      rooferPasscode,
      googleReviewUrl: googleReviewUrl || "",
      mapCenter,
      theme: theme || {
        primaryRgb: "11, 12, 16",
        secondaryRgb: "209, 164, 83",
        accentRgb: "36, 40, 50",
        bgRgb: "11, 12, 16",
        cardBgRgb: "21, 23, 30"
      },
      brand: brand || {
        phone: "",
        email: "",
        tagline: "",
        logoText: companyName,
        logoSubtext: ""
      },
      technicians: technicians.length ? technicians : [],
      serviceList: serviceList.length ? serviceList : [
        "Residential Mowing",
        "Edging & Trimming",
        "Pine Straw Installation",
        "Gutter Cleaning",
        "Overgrowth Recovery"
      ]
    };

    // Serialize to Firestore fields map
    const firestoreData = serializeToFirestoreFields(payload);
    const firestoreFields = { fields: firestoreData.mapValue.fields };

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${slug}`;

    let isFirestoreSaved = false;
    try {
      const patchRes = await fetch(firestoreUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(firestoreFields)
      });
      if (patchRes.ok) {
        isFirestoreSaved = true;
      } else {
        const errText = await patchRes.text();
        console.warn(`Firestore patch failed: ${errText}. Falling back to local file write.`);
      }
    } catch (dbErr) {
      console.warn("Firestore database unreachable. Falling back to local file write.", dbErr);
    }

    // Always fallback to writing to local company-config.json for local environment testing
    try {
      const fs = require("fs");
      const path = require("path");
      const configPath = path.join(process.cwd(), "src", "data", "company-config.json");
      
      let localConfigs: any = {};
      if (fs.existsSync(configPath)) {
        localConfigs = JSON.parse(fs.readFileSync(configPath, "utf8"));
      }
      
      localConfigs[slug] = payload;
      
      fs.writeFileSync(configPath, JSON.stringify(localConfigs, null, 2), "utf8");
      console.log(`Successfully wrote company config locally to company-config.json for client: ${slug}`);
    } catch (fileErr: any) {
      console.error("Local file write fallback failed:", fileErr);
      if (!isFirestoreSaved) {
        throw new Error(`Failed to save settings: Firestore write failed and local file write failed (${fileErr.message})`);
      }
    }

    return NextResponse.json({ success: true, clientId: slug });
  } catch (error: any) {
    console.error("[Provision API] POST failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
