import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  // 1. Try US Census Bureau Geocoder first (Highly accurate for exact US addresses)
  try {
    const censusUrl = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(query)}&benchmark=Public_AR_Current&format=json`;
    const censusResponse = await fetch(censusUrl);
    
    if (censusResponse.ok) {
      const data = await censusResponse.json();
      const matches = data.result?.addressMatches;
      if (matches && matches.length > 0) {
        // Format to Nominatim-compatible output format so the client-side code works seamlessly
        const formattedResults = matches.map((m: any) => ({
          lat: m.coordinates.y.toString(),
          lon: m.coordinates.x.toString(),
          display_name: m.matchedAddress
        }));
        return NextResponse.json(formattedResults);
      }
    }
  } catch (error) {
    console.error("Census geocoder failed, falling back to Nominatim:", error);
  }

  // 2. Fall back to OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "BornAgainRoofingApp/1.0 (info@bornagainroofing.com)",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Nominatim API returned status ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Geocoding proxy error:", error);
    return NextResponse.json({ error: "Failed to connect to geocoding service" }, { status: 500 });
  }
}
