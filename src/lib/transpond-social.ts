import { PinType } from "./db";

interface TranspondSettings {
  apiKey: string;
  groupId: string;
}

// 1. Helper to fetch stored Transpond settings from Firestore
async function getTranspondSettings(clientId: string, firebaseProjectId: string): Promise<TranspondSettings | null> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`[Transpond Social] No Transpond settings found in Firestore for ${clientId}. Falling back to env.`);
      return null;
    }
    const data = await res.json();
    const fields = data.fields || {};

    const apiKey = fields.transpondApiKey?.stringValue || "";
    const groupId = fields.transpondGroupId?.stringValue || "";

    if (!apiKey) return null;
    return { apiKey, groupId };
  } catch (error) {
    console.error("[Transpond Social] Error fetching settings from Firestore:", error);
    return null;
  }
}

// 2. Main Entry Point: Auto-post check-in to Transpond Social
export async function publishPinToTranspondSocial(pin: PinType): Promise<boolean> {
  try {
    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
    const clientId = process.env.PDM_CLIENT_ID || "lungrins-lawncare";

    // A. Resolve API Key
    let apiKey = "";
    const dbSettings = await getTranspondSettings(clientId, firebaseProjectId);
    if (dbSettings && dbSettings.apiKey) {
      apiKey = dbSettings.apiKey;
    } else {
      apiKey = process.env.TRANSPOND_API_KEY || "";
    }

    if (!apiKey) {
      console.log("[Transpond Social] No Transpond API key found. Skipping social posting.");
      return false;
    }

    // B. Query connected social channels
    console.log("[Transpond Social] Checking connected channels...");
    const socialRes = await fetch("https://api.transpond.io/social", {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!socialRes.ok) {
      console.error("[Transpond Social] Failed to fetch connected channels:", await socialRes.text());
      return false;
    }

    const channels = await socialRes.json();
    if (!Array.isArray(channels) || channels.length === 0) {
      console.log("[Transpond Social] No social channels connected to Transpond yet. Skipping post.");
      return false;
    }

    const channelIds = channels.map((c: any) => c.id).filter(Boolean);
    if (channelIds.length === 0) {
      console.log("[Transpond Social] No valid social channel IDs resolved.");
      return false;
    }

    console.log(`[Transpond Social] Found ${channelIds.length} connected channels. Building post...`);

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
      console.error("[Transpond Social] Failed to fetch company name:", e);
    }

    // C. Format post content body
    const host = process.env.NEXT_PUBLIC_SITE_URL || "";
    const projectUrl = `${host}/pin-page?id=${pin.id}`;
    
    const message = `🛠️ New Job Completed by ${companyName}!\n\n` +
      `👷 Technician: ${pin.author}\n` +
      `📍 Location: ${pin.location}\n` +
      `📂 Category: ${pin.service}\n\n` +
      `Project Details:\n${pin.description}\n\n` +
      `🔗 View photos and review details: ${projectUrl}`;

    // D. Create Campaign (Type 50)
    const createBody = {
      campaignName: `Project Sync: ${pin.location} - ${pin.service}`,
      type: 50,
      options: {
        socialChannels: channelIds,
        message: message,
        images: pin.images && pin.images.length > 0 ? [pin.images[0]] : []
      }
    };

    const campaignRes = await fetch("https://api.transpond.io/campaign", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createBody)
    });

    if (!campaignRes.ok) {
      console.error("[Transpond Social] Failed to create campaign:", await campaignRes.text());
      return false;
    }

    const campaignData = await campaignRes.json();
    const campaignId = campaignData?.Campaign?.id;
    if (!campaignId) {
      console.error("[Transpond Social] Response did not return a valid campaign ID.");
      return false;
    }

    console.log(`[Transpond Social] Created Draft Campaign ID ${campaignId}. Publishing...`);

    // E. Transition campaign status to publish
    const publishRes = await fetch(`https://api.transpond.io/campaign/${campaignId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        campaign: {
          status: "Sent"
        }
      })
    });

    if (!publishRes.ok) {
      console.error("[Transpond Social] Failed to publish campaign:", await publishRes.text());
      return false;
    }

    console.log(`[Transpond Social] Successfully published Pin ID ${pin.id} to ${channelIds.length} social networks via Transpond!`);
    return true;

  } catch (error) {
    console.error("[Transpond Social] Exception in auto-posting:", error);
    return false;
  }
}
