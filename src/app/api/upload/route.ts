import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { base64Data } = body;

    if (!base64Data || typeof base64Data !== "string") {
      return NextResponse.json({ error: "Missing base64Data" }, { status: 400 });
    }

    // Parse base64 data url format (e.g. "data:image/jpeg;base64,...")
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Invalid base64 image data format" }, { status: 400 });
    }

    const contentType = matches[1];
    const base64Content = matches[2];
    const buffer = Buffer.from(base64Content, "base64");

    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
    // Suffix bucket name based on firebase standard
    const bucket = `${firebaseProjectId}.firebasestorage.app`;
    
    // Generate unique file path
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `checkin_photos/${Date.now()}-${randomStr}.jpg`;

    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(filename)}`;

    console.log(`Uploading to Firebase Storage: ${uploadUrl}`);
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body: buffer,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Firebase Storage upload raw error:", errText);
      return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
    }

    const resData = await res.json();
    const { name, downloadTokens } = resData;

    if (!name || !downloadTokens) {
      console.error("Firebase Storage missing name or downloadTokens in response:", resData);
      return NextResponse.json({ error: "Invalid upload response from storage" }, { status: 500 });
    }

    // Construct standard public URL with download token
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(name)}?alt=media&token=${downloadTokens}`;

    console.log(`Uploaded file successfully: ${publicUrl}`);
    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error("API POST upload error:", error);
    return NextResponse.json({ error: "Failed to process file upload" }, { status: 500 });
  }
}
