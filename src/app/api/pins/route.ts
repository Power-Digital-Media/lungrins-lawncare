import { NextRequest, NextResponse } from "next/server";
import { getPins, addPin } from "@/lib/db";

// Force Next.js to run this route dynamically at runtime (avoid static compilation)
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId") || undefined;
    const pins = await getPins(clientId);
    return NextResponse.json(pins, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("API GET pins error:", error);
    return NextResponse.json({ error: "Failed to fetch pins" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, date, location, service, description, images, latitude, longitude, clientId } = body;

    // Validate required fields
    if (!author || !date || !location || !service || !description || !images || !Array.isArray(images)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pinData = {
      author,
      date,
      location,
      service,
      description,
      images,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      detailedExplanation: "",
      aeoAnswers: [],
      clientId
    };

    const createdPin = await addPin(pinData);
    if (!createdPin) {
      return NextResponse.json({ error: "Failed to save pin" }, { status: 500 });
    }

    return NextResponse.json(createdPin, { status: 201 });
  } catch (error) {
    console.error("API POST pins error:", error);
    return NextResponse.json({ error: "Failed to create pin" }, { status: 500 });
  }
}
