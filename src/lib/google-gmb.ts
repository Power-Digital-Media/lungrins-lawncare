import { PinType } from "./db";

interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiryTime: number;
}

// 1. Helper to fetch GMB auth settings from Firestore
async function getGoogleAuthSettings(clientId: string, firebaseProjectId: string): Promise<GoogleTokens | null> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`[GMB] No Google OAuth credentials found in settings/${clientId} or failed to fetch.`);
      return null;
    }
    const data = await res.json();
    const fields = data.fields || {};

    const parseValue = (val: any) => {
      if (!val) return "";
      return val.stringValue || (val.doubleValue ? Number(val.doubleValue) : "");
    };

    const accessToken = parseValue(fields.accessToken);
    const refreshToken = parseValue(fields.refreshToken);
    const expiryTime = Number(parseValue(fields.expiryTime)) || 0;

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken, expiryTime };
  } catch (error) {
    console.error("[GMB] Error fetching settings from Firestore:", error);
    return null;
  }
}

// 2. Helper to save updated token back to Firestore
async function saveAccessToken(clientId: string, firebaseProjectId: string, accessToken: string, expiryTime: number) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;
    
    const firestoreFields = {
      fields: {
        clientId: { stringValue: clientId },
        accessToken: { stringValue: accessToken },
        expiryTime: { doubleValue: expiryTime }
      }
    };

    const updateParams = new URLSearchParams();
    updateParams.append("updateMask.fieldPaths", "accessToken");
    updateParams.append("updateMask.fieldPaths", "expiryTime");

    await fetch(`${url}?${updateParams.toString()}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(firestoreFields)
    });
  } catch (error) {
    console.error("[GMB] Failed to save refreshed token:", error);
  }
}

// 3. Helper to refresh the Google access token using the refresh_token
async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expires_in: number } | null> {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!googleClientId || !googleClientSecret) {
      console.error("[GMB] Missing Google Client ID or Secret in environment.");
      return null;
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[GMB] Token refresh endpoint returned error:", errText);
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expires_in: data.expires_in || 3600
    };
  } catch (error) {
    console.error("[GMB] Exception refreshing Google access token:", error);
    return null;
  }
}

// 4. Helper to resolve the GMB Location ID dynamically
async function getGmbLocationName(accessToken: string): Promise<string | null> {
  try {
    // A. List accounts
    const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!accountsRes.ok) {
      console.error("[GMB] Failed to fetch accounts list:", await accountsRes.text());
      return null;
    }
    const accountsData = await accountsRes.json();
    const accounts = accountsData.accounts || [];
    if (accounts.length === 0) {
      console.error("[GMB] No Google Business accounts associated with this Google ID.");
      return null;
    }
    // Use the primary account
    const accountName = accounts[0].name; // format: "accounts/12345"

    // B. List locations for that account
    const locationsRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!locationsRes.ok) {
      console.error("[GMB] Failed to list locations for account:", await locationsRes.text());
      return null;
    }
    const locationsData = await locationsRes.json();
    const locations = locationsData.locations || [];
    if (locations.length === 0) {
      console.error("[GMB] No physical business locations found in this account.");
      return null;
    }
    // Use the primary location
    return locations[0].name; // format: "locations/98765"
  } catch (error) {
    console.error("[GMB] Exception resolving location name:", error);
    return null;
  }
}

// 5. Main entry point: Publish a Pin to GMB as a Local Post
export async function publishPinToGmb(pin: PinType): Promise<boolean> {
  try {
    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
    const clientId = process.env.PDM_CLIENT_ID || "lungrins-lawncare";
    
    // Fetch stored OAuth credentials from Firestore
    const credentials = await getGoogleAuthSettings(clientId, firebaseProjectId);
    if (!credentials) {
      return false; // Silently abort if not connected
    }

    let { accessToken, refreshToken, expiryTime } = credentials;

    // Check if token has expired or is expiring in next 5 minutes
    if (Date.now() + 300 * 1000 >= expiryTime) {
      console.log("[GMB] Access token expired or expiring. Refreshing...");
      const refreshResult = await refreshAccessToken(refreshToken);
      if (!refreshResult) {
        console.error("[GMB] Failed to obtain new access token.");
        return false;
      }
      accessToken = refreshResult.accessToken;
      expiryTime = Date.now() + refreshResult.expires_in * 1000;
      // Save refreshed token to Firestore
      await saveAccessToken(clientId, firebaseProjectId, accessToken, expiryTime);
    }

    // Resolve location ID dynamically (e.g. locations/98765)
    const locationName = await getGmbLocationName(accessToken);
    if (!locationName) {
      return false;
    }

    // Fetch company name dynamically from Firestore settings
    let companyName = "our crew";
    try {
      const docRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`
      );
      if (docRes.ok) {
        const docData = await docRes.json();
        companyName = docData.fields?.companyName?.stringValue || "our crew";
      }
    } catch (e) {
      console.error("[GMB] Failed to fetch company name:", e);
    }

    // Determine host for redirect callback button link
    const host = process.env.NEXT_PUBLIC_SITE_URL || "";
    const projectUrl = `${host}/pin-page?id=${pin.id}`;

    // Format post text body
    const summary = `🛠️ New Job Completed by ${companyName}!\n\n` +
      `👷 Technician: ${pin.author}\n` +
      `📍 Location: ${pin.location}\n` +
      `📂 Category: ${pin.service}\n\n` +
      `Project Details:\n${pin.description}`;

    // Setup GMB local post structure
    const postBody: any = {
      languageCode: "en-US",
      summary: summary,
      callToAction: {
        actionType: "LEARN_MORE",
        url: projectUrl
      }
    };

    // Attach primary photo if available (GMB supports 1 image for updates)
    if (pin.images && pin.images.length > 0) {
      postBody.media = [
        {
          mediaFormat: "PHOTO",
          sourceUrl: pin.images[0]
        }
      ];
    }

    // Call localPosts API
    const gmbPostUrl = `https://mybusinesslocalpost.googleapis.com/v1/${locationName}/localPosts`;
    const postRes = await fetch(gmbPostUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postBody)
    });

    if (!postRes.ok) {
      const errText = await postRes.text();
      console.error("[GMB] Google localPosts API returned error status:", postRes.status, errText);
      return false;
    }

    console.log(`[GMB] Successfully published job check-in for Pin ID ${pin.id} to Google Business Profile!`);
    return true;
  } catch (error) {
    console.error("[GMB] Unexpected error publishing to GMB:", error);
    return false;
  }
}
