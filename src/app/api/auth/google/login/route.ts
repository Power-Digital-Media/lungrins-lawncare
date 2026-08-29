import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId") || "lungrins-lawncare";

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return NextResponse.json({ error: "Google Client ID is not configured on the server." }, { status: 500 });
    }

    const host = request.headers.get("host") || "localhost:3002";
    const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    const oauthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    oauthUrl.searchParams.append("client_id", googleClientId);
    oauthUrl.searchParams.append("redirect_uri", redirectUri);
    oauthUrl.searchParams.append("response_type", "code");
    oauthUrl.searchParams.append("scope", "https://www.googleapis.com/auth/business.manage openid email profile");
    oauthUrl.searchParams.append("access_type", "offline");
    oauthUrl.searchParams.append("prompt", "consent");
    oauthUrl.searchParams.append("state", clientId);

    return NextResponse.redirect(oauthUrl.toString());
  } catch (error: any) {
    console.error("[Google OAuth Login] Initiating failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
