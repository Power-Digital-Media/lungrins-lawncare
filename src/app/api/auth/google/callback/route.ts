import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const clientId = searchParams.get("state") || "lungrins-lawncare";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const errorRedirect = (msg: string) => 
    NextResponse.redirect(`${baseUrl}/admin/drop-pin?clientId=${clientId}&google_sync=error&message=${encodeURIComponent(msg)}`);

  if (error) {
    return errorRedirect(errorDescription || error);
  }

  if (!code) {
    return errorRedirect("Authorization code not found in Google response.");
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    return errorRedirect("Server side Google credentials are not configured.");
  }

  try {
    const host = request.headers.get("host") || "localhost:3002";
    const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    // 1. Exchange auth code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      })
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return errorRedirect(`Failed to exchange authorization code: ${errText}`);
    }

    const tokenData = await tokenRes.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    if (!access_token) {
      return errorRedirect("Failed to retrieve access token from Google.");
    }

    const expiryTime = (Date.now() + expires_in * 1000).toString();

    // 2. Read and update settings in Firestore settings collection
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;
    
    let isFirestoreSaved = false;
    try {
      const getRes = await fetch(firestoreUrl);
      const existingDoc = getRes.ok ? await getRes.json() : { fields: {} };
      const fields = existingDoc.fields || {};

      const updatedFields: any = { ...fields };
      updatedFields.clientId = { stringValue: clientId };
      updatedFields.googleAccessToken = { stringValue: access_token };
      if (refresh_token) {
        updatedFields.googleRefreshToken = { stringValue: refresh_token };
      }
      updatedFields.googleTokenExpiry = { stringValue: expiryTime };

      const firestoreFields = { fields: updatedFields };
      const patchRes = await fetch(firestoreUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(firestoreFields)
      });

      if (patchRes.ok) {
        isFirestoreSaved = true;
      } else {
        const errText = await patchRes.text();
        console.warn(`[Google OAuth Callback] Firestore save failed: ${errText}. Falling back to local file write.`);
      }
    } catch (dbErr) {
      console.warn("[Google OAuth Callback] Firestore connection error. Falling back to local file write.", dbErr);
    }

    // 3. Fallback to writing to local company-config.json for local/offline testing
    try {
      const fs = require("fs");
      const path = require("path");
      const configPath = path.join(process.cwd(), "src", "data", "company-config.json");

      let localConfigs: any = {};
      if (fs.existsSync(configPath)) {
        localConfigs = JSON.parse(fs.readFileSync(configPath, "utf8"));
      }

      const currentConfig = localConfigs[clientId] || {};
      currentConfig.clientId = clientId;
      currentConfig.googleAccessToken = access_token;
      if (refresh_token) {
        currentConfig.googleRefreshToken = refresh_token;
      }
      currentConfig.googleTokenExpiry = expiryTime;

      localConfigs[clientId] = currentConfig;
      fs.writeFileSync(configPath, JSON.stringify(localConfigs, null, 2), "utf8");
      console.log(`[Google OAuth Callback] Local settings saved successfully for: ${clientId}`);
    } catch (fileErr: any) {
      console.error("[Google OAuth Callback] Local file write fallback failed:", fileErr);
      if (!isFirestoreSaved) {
        return errorRedirect(`Failed to save Google connection: Firestore write and local file fallback failed (${fileErr.message})`);
      }
    }

    // 4. Success redirect
    return NextResponse.redirect(`${baseUrl}/admin/drop-pin?clientId=${clientId}&google_sync=success`);

  } catch (err: any) {
    console.error("[Google OAuth Callback] Token exchange failed:", err);
    return errorRedirect(`System error: ${err.message}`);
  }
}
