import fs from "fs";
import path from "path";
import pinsData from "@/data/pins.json";

export interface PinType {
  id: string;
  author: string;
  date: string;
  location: string;
  service: string;
  description: string;
  images: string[];
  detailedExplanation?: string;
  aeoAnswers?: { question: string; answer: string }[];
  latitude?: number;
  longitude?: number;
  clientId?: string;
}

let inMemoryPins: PinType[] = [...pinsData] as PinType[];

// Helper to convert Firestore REST document format to standard PinType JSON
function parseFirestoreDocument(doc: any): PinType {
  // If the document is wrapped inside a runQuery response, it might be in doc.document
  const actualDoc = doc.document ? doc.document : doc;
  const fields = actualDoc.fields || {};
  
  const parseValue = (val: any): any => {
    if (!val) return undefined;
    if ("stringValue" in val) return val.stringValue;
    if ("doubleValue" in val) return Number(val.doubleValue);
    if ("integerValue" in val) return Number(val.integerValue);
    if ("booleanValue" in val) return val.booleanValue;
    if ("arrayValue" in val) {
      const values = val.arrayValue.values || [];
      return values.map((v: any) => parseValue(v));
    }
    if ("mapValue" in val) {
      const mapFields = val.mapValue.fields || {};
      const obj: any = {};
      for (const [k, v] of Object.entries(mapFields)) {
        obj[k] = parseValue(v);
      }
      return obj;
    }
    return undefined;
  };

  return {
    id: parseValue(fields.id) || actualDoc.name.split("/").pop() || "",
    author: parseValue(fields.author) || "Unknown",
    date: parseValue(fields.date) || "",
    location: parseValue(fields.location) || "",
    service: parseValue(fields.service) || "",
    description: parseValue(fields.description) || "",
    images: parseValue(fields.images) || [],
    latitude: parseValue(fields.latitude),
    longitude: parseValue(fields.longitude),
    detailedExplanation: parseValue(fields.detailedExplanation) || "",
    aeoAnswers: parseValue(fields.aeoAnswers) || [],
    clientId: parseValue(fields.clientId) || "generic-tenant",
  };
}

// Helper to convert standard PinType JSON to Firestore REST document fields
function toFirestoreDocument(pin: PinType): any {
  const toValue = (val: any): any => {
    if (typeof val === "string") return { stringValue: val };
    if (typeof val === "number") return { doubleValue: val };
    if (typeof val === "boolean") return { booleanValue: val };
    if (Array.isArray(val)) {
      return {
        arrayValue: {
          values: val.map((v) => toValue(v)),
        },
      };
    }
    if (val && typeof val === "object") {
      const fields: any = {};
      for (const [k, v] of Object.entries(val)) {
        fields[k] = toValue(v);
      }
      return { mapValue: { fields } };
    }
    return { nullValue: null };
  };

  const fields: any = {};
  for (const [k, v] of Object.entries(pin)) {
    if (v !== undefined) {
      fields[k] = toValue(v);
    }
  }
  return { fields };
}

export async function getPins(overrideClientId?: string): Promise<PinType[]> {
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  const clientId = overrideClientId || process.env.PDM_CLIENT_ID || "generic-tenant";

  let merged: PinType[] = [];

  // Filter static local pins.json to only include pins for this client.
  // Roofer check-ins are tagged/untagged with 'generic-tenant'.
  const localPins = (pinsData as PinType[]).filter(
    (p) => (p.clientId || "generic-tenant") === clientId
  );

  // 1. Try Firebase Firestore REST API (using runQuery to filter by clientId)
  if (firebaseProjectId) {
    try {
      const queryBody = {
        structuredQuery: {
          from: [{ collectionId: "pins" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "clientId" },
              op: "EQUAL",
              value: { stringValue: clientId }
            }
          }
        }
      };

      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents:runQuery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryBody),
          next: { revalidate: 30 }, // Cache for 30 seconds
        }
      );

      if (res.ok) {
        const results = await res.json();
        // Firebase runQuery returns an array of objects containing a 'document' property
        // Filter out empty results (sometimes Firestore returns an empty final element in the array)
        const dbPins = results
          .filter((r: any) => r.document)
          .map((r: any) => parseFirestoreDocument(r));
        
        merged = [...dbPins, ...localPins];
      } else {
        console.error("Firebase Firestore runQuery error status:", res.status);
      }
    } catch (err) {
      console.error("Failed to fetch from Firebase Firestore runQuery:", err);
    }
  }
  
  // 2. Try Supabase REST API (fallback filtering by clientId if no Firebase results)
  if (merged.length === 0 && supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/pins?select=*&clientId=eq.${clientId}&order=id.desc`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const dbPins = await res.json();
        merged = [...dbPins, ...localPins];
      }
    } catch (err) {
      console.error("Failed to fetch from Supabase:", err);
    }
  }
  
  // 3. Fallback to local memory if database calls did not yield pins
  if (merged.length === 0) {
    merged = inMemoryPins.filter(
      (p) => (p.clientId || "generic-tenant") === clientId
    );
  }

  // Deduplicate and sort by ID descending (newest first)
  const seen = new Set();
  const unique = merged.filter((p) => {
    const duplicate = seen.has(p.id);
    seen.add(p.id);
    return !duplicate;
  });

  return unique.sort((a, b) => {
    const numA = Number(a.id) || 0;
    const numB = Number(b.id) || 0;
    return numB - numA;
  });
}

export async function addPin(pin: Omit<PinType, "id">): Promise<PinType | null> {
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  const clientId = pin.clientId || process.env.PDM_CLIENT_ID || "generic-tenant";
  
  const pinId = Date.now().toString();
  const newPin: PinType = {
    ...pin,
    id: pinId,
    clientId: clientId, // Automatically tag pin with clientId
  };

  // 1. Write to Firebase Firestore REST API
  if (firebaseProjectId) {
    try {
      const firestoreDoc = toFirestoreDocument(newPin);
      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/pins?documentId=${pinId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(firestoreDoc),
        }
      );
      if (res.ok) {
        console.log(`Successfully wrote new pin to Firebase Firestore under clientId: ${clientId}`);
        
        // Trigger Google My Business Local Post Sync in background
        try {
          const { publishPinToGmb } = await import("./google-gmb");
          publishPinToGmb(newPin).catch((err) => console.error("[GMB] Background publish error:", err));
        } catch (gmbErr) {
          console.error("[GMB] Trigger failed:", gmbErr);
        }

        // Trigger Transpond Social Media Post Sync in background
        try {
          const { publishPinToTranspondSocial } = await import("./transpond-social");
          publishPinToTranspondSocial(newPin).catch((err) => console.error("[Transpond Social] Background publish error:", err));
        } catch (socialErr) {
          console.error("[Transpond Social] Trigger failed:", socialErr);
        }

        return newPin;
      } else {
        const errText = await res.text();
        console.error("Firebase Firestore write error:", errText);
        return null; // Fail fast if Firebase is configured but write fails
      }
    } catch (err) {
      console.error("Failed to write to Firebase Firestore:", err);
      return null; // Fail fast on connection exception
    }
  }

  // 2. Write to Supabase REST API (fallback)
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/pins`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(newPin),
      });
      if (res.ok) {
        const created = await res.json();
        return Array.isArray(created) ? created[0] : created;
      }
    } catch (err) {
      console.error("Failed to write to Supabase:", err);
    }
  }

  // Local development fallback
  console.log("No cloud database configured. Appending locally...");
  try {
    inMemoryPins = [newPin, ...inMemoryPins];
    if (process.env.NODE_ENV === "development") {
      const dataDir = path.join(process.cwd(), "src", "data");
      const pinsFilePath = path.join(dataDir, "pins.json");
      fs.writeFileSync(pinsFilePath, JSON.stringify(inMemoryPins, null, 2), "utf-8");
      console.log("Successfully appended new pin to local src/data/pins.json");
    }
    return newPin;
  } catch (err) {
    console.error("Failed to write to local filesystem:", err);
  }

  return newPin;
}
