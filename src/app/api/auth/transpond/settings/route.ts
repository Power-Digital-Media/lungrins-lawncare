import { NextRequest, NextResponse } from "next/server";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
const clientId = process.env.PDM_CLIENT_ID || "generic-tenant";
const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;

// Helper to mask API key for security (only show first 4 and last 4 characters)
function maskApiKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "****";
  return `${key.slice(0, 4)}****${key.slice(-4)}`;
}

interface LocationItem {
  name: string;
  lat: number;
  lng: number;
}

// 1. GET Settings & Social Connection Status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryClientId = searchParams.get("clientId");
    const activeClientId = queryClientId || process.env.PDM_CLIENT_ID || "generic-tenant";
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${activeClientId}`;

    let transpondApiKey = "";
    let transpondGroupId = "";
    let isFromEnv = false;
    let technicians: string[] = [];
    let rooferPasscodeConfigured = false;
    let companyName = "";
    let googleReviewUrl = "";
    let locations: LocationItem[] = [];
    let googleConnected = false;

    // A. Read from Firestore
    const res = await fetch(firestoreUrl);
    if (res.ok) {
      const data = await res.json();
      const fields = data.fields || {};
      
      const parseVal = (val: any) => val?.stringValue || "";
      const parseArrayVal = (val: any): string[] => {
        if (!val?.arrayValue?.values) return [];
        return val.arrayValue.values.map((v: any) => v.stringValue || "");
      };

      const parseLocations = (val: any): LocationItem[] => {
        if (!val?.arrayValue?.values) return [];
        return val.arrayValue.values.map((v: any) => {
          const parts = (v.stringValue || "").split("|");
          if (parts.length >= 3) {
            return {
              name: parts[0],
              lat: parseFloat(parts[1]),
              lng: parseFloat(parts[2])
            };
          }
          return null;
        }).filter((item: any): item is LocationItem => item !== null);
      };

      transpondApiKey = parseVal(fields.transpondApiKey);
      transpondGroupId = parseVal(fields.transpondGroupId);
      technicians = parseArrayVal(fields.technicians);
      companyName = parseVal(fields.companyName) || (activeClientId === "generic-tenant" ? "PinDrop Portal" : activeClientId);
      rooferPasscodeConfigured = !!parseVal(fields.rooferPasscode);
      googleReviewUrl = parseVal(fields.googleReviewUrl);
      locations = parseLocations(fields.locations);
      googleConnected = !!parseVal(fields.googleRefreshToken);
    }

    // B. Check local company-config.json for credentials fallback
    try {
      const fs = require("fs");
      const path = require("path");
      const configPath = path.join(process.cwd(), "src", "data", "company-config.json");
      if (fs.existsSync(configPath)) {
        const localConfigs = JSON.parse(fs.readFileSync(configPath, "utf8"));
        const clientConfig = localConfigs[activeClientId];
        if (clientConfig) {
          if (!transpondApiKey) {
            transpondApiKey = clientConfig.transpondApiKey || "";
            transpondGroupId = clientConfig.transpondGroupId || "";
          }
          if (!companyName) {
            companyName = clientConfig.companyName || "";
          }
          if (technicians.length === 0 && clientConfig.technicians) {
            technicians = clientConfig.technicians;
          }
          if (!googleReviewUrl) {
            googleReviewUrl = clientConfig.googleReviewUrl || "";
          }
          if (!googleConnected) {
            googleConnected = !!clientConfig.googleRefreshToken;
          }
        }
      }
    } catch (err) {
      console.warn("Failed to read local company config file in GET settings:", err);
    }

    // C. Fallback to process.env for Transpond keys if blank (ONLY for Generic Tenant)
    if (!transpondApiKey && activeClientId === "generic-tenant") {
      transpondApiKey = process.env.TRANSPOND_API_KEY || "";
      transpondGroupId = process.env.TRANSPOND_GROUP_ID || "";
      if (transpondApiKey) {
        isFromEnv = true;
      }
    }

    // D. Fallback to default locations for Generic Tenant
    if (locations.length === 0) {
      if (activeClientId === "generic-tenant") {
        locations = [
          { name: "New York, NY", lat: 40.7128, lng: -74.0060 },
          { name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
          { name: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
          { name: "Houston, TX", lat: 29.7604, lng: -95.3698 },
          { name: "Jackson, MS", lat: 32.2988, lng: -90.1848 }
        ];
      } else {
        locations = [];
      }
    }

    // E. Fallback to default technicians if Generic Tenant
    if (technicians.length === 0) {
      if (activeClientId === "generic-tenant") {
        technicians = [
          "John Doe",
          "Jane Smith",
          "Bob Johnson"
        ];
      } else {
        technicians = [];
      }
    }

    // F. Check social connection status via Transpond API
    let socialConnected = false;
    let connectedChannels: any[] = [];
    if (transpondApiKey) {
      try {
        const socialRes = await fetch("https://api.transpond.io/social", {
          headers: {
            Authorization: `Bearer ${transpondApiKey}`
          }
        });
        if (socialRes.ok) {
          const channels = await socialRes.json();
          if (Array.isArray(channels) && channels.length > 0) {
            socialConnected = true;
            connectedChannels = channels;
          }
        }
      } catch (socialErr) {
        console.error("[Transpond settings API] Failed to check social channels:", socialErr);
      }
    }

    return NextResponse.json({
      configured: !!transpondApiKey,
      transpondGroupId,
      transpondApiKey: transpondApiKey ? (isFromEnv ? "env_configured" : maskApiKey(transpondApiKey)) : "",
      socialConnected,
      connectedChannels,
      technicians,
      rooferPasscodeConfigured,
      companyName,
      googleReviewUrl,
      locations,
      googleConnected
    });

  } catch (error: any) {
    console.error("[Transpond settings API] GET failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST Save Settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, groupId, technicians, rooferPasscode, companyName, googleReviewUrl, locations, clientId } = body;
    const activeClientId = clientId || process.env.PDM_CLIENT_ID || "generic-tenant";
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${activeClientId}`;

    // Read current settings document (so we don't wipe out other fields like Google tokens)
    const getRes = await fetch(firestoreUrl);
    const existingDoc = getRes.ok ? await getRes.json() : { fields: {} };
    const fields = existingDoc.fields || {};

    const updatedFields: any = { ...fields };
    const updateParams = new URLSearchParams();

    // Always keep clientId updated
    updatedFields.clientId = { stringValue: activeClientId };
    updateParams.append("updateMask.fieldPaths", "clientId");

    if (apiKey !== undefined && groupId !== undefined) {
      if (!apiKey || !groupId) {
        return NextResponse.json({ error: "Both API Key and Group ID are required." }, { status: 400 });
      }
      updatedFields.transpondApiKey = { stringValue: apiKey };
      updatedFields.transpondGroupId = { stringValue: groupId };
      updateParams.append("updateMask.fieldPaths", "transpondApiKey");
      updateParams.append("updateMask.fieldPaths", "transpondGroupId");
    }

    if (technicians !== undefined) {
      if (!Array.isArray(technicians)) {
        return NextResponse.json({ error: "Technicians must be an array of strings." }, { status: 400 });
      }
      updatedFields.technicians = {
        arrayValue: {
          values: technicians.map((tech: string) => ({ stringValue: tech }))
        }
      };
      updateParams.append("updateMask.fieldPaths", "technicians");
    }

    if (rooferPasscode !== undefined) {
      updatedFields.rooferPasscode = { stringValue: rooferPasscode };
      updateParams.append("updateMask.fieldPaths", "rooferPasscode");
    }

    if (companyName !== undefined) {
      updatedFields.companyName = { stringValue: companyName };
      updateParams.append("updateMask.fieldPaths", "companyName");
    }

    if (googleReviewUrl !== undefined) {
      updatedFields.googleReviewUrl = { stringValue: googleReviewUrl };
      updateParams.append("updateMask.fieldPaths", "googleReviewUrl");
    }

    if (locations !== undefined) {
      if (!Array.isArray(locations)) {
        return NextResponse.json({ error: "Locations must be an array of objects." }, { status: 400 });
      }
      updatedFields.locations = {
        arrayValue: {
          values: locations.map((loc: LocationItem) => ({
            stringValue: `${loc.name}|${loc.lat}|${loc.lng}`
          }))
        }
      };
      updateParams.append("updateMask.fieldPaths", "locations");
    }

    const firestoreFields = { fields: updatedFields };

    const patchRes = await fetch(`${firestoreUrl}?${updateParams.toString()}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(firestoreFields)
    });

    let isFirestoreSaved = false;
    if (patchRes.ok) {
      isFirestoreSaved = true;
    } else {
      const errText = await patchRes.text();
      console.warn("[Transpond settings API] Firestore write failed. Falling back to local file write.", errText);
    }

    // Always fallback/write locally to company-config.json for local environment hot-reloads
    try {
      const fs = require("fs");
      const path = require("path");
      const configPath = path.join(process.cwd(), "src", "data", "company-config.json");
      
      let localConfigs: any = {};
      if (fs.existsSync(configPath)) {
        localConfigs = JSON.parse(fs.readFileSync(configPath, "utf8"));
      }

      const currentConfig = localConfigs[activeClientId] || {};
      
      if (companyName !== undefined) currentConfig.companyName = companyName;
      if (rooferPasscode !== undefined) currentConfig.rooferPasscode = rooferPasscode;
      if (googleReviewUrl !== undefined) currentConfig.googleReviewUrl = googleReviewUrl;
      if (technicians !== undefined) currentConfig.technicians = technicians;
      if (apiKey !== undefined) currentConfig.transpondApiKey = apiKey;
      if (groupId !== undefined) currentConfig.transpondGroupId = groupId;
      
      localConfigs[activeClientId] = {
        ...currentConfig,
        clientId: activeClientId
      };
      
      fs.writeFileSync(configPath, JSON.stringify(localConfigs, null, 2), "utf8");
      console.log(`[Transpond settings API] Local settings saved successfully for: ${activeClientId}`);
    } catch (fileErr: any) {
      console.error("[Transpond settings API] Local file write fallback failed:", fileErr);
      if (!isFirestoreSaved) {
        return NextResponse.json({ error: `Settings save failed on both Firestore and local fallback` }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully!" });

  } catch (error: any) {
    console.error("[Transpond settings API] POST failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
