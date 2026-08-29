// ──────────────────────────────────────────────────────────────
// Google Places API (New) — Server-side integration
// Fetches live business data, reviews, and photos for Lungrin's
// ──────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────

export interface GooglePlaceReview {
  name: string;                    // Resource name
  relativePublishTimeDescription: string; // e.g. "2 months ago"
  rating: number;                  // 1-5
  text?: { text: string; languageCode: string };
  originalText?: { text: string; languageCode: string };
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri: string;
  };
  publishTime: string;             // ISO 8601
}

export interface GooglePlacePhoto {
  name: string;                    // Resource name for photo media
  widthPx: number;
  heightPx: number;
  authorAttributions: Array<{
    displayName: string;
    uri: string;
    photoUri: string;
  }>;
}

export interface GoogleOpeningHours {
  openNow?: boolean;
  periods?: Array<{
    open: { day: number; hour: number; minute: number };
    close: { day: number; hour: number; minute: number };
  }>;
  weekdayDescriptions?: string[];
}

export interface GooglePlaceDetails {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  nationalPhoneNumber: string;
  internationalPhoneNumber?: string;
  rating: number;
  userRatingCount: number;
  regularOpeningHours?: GoogleOpeningHours;
  currentOpeningHours?: GoogleOpeningHours;
  websiteUri?: string;
  googleMapsUri: string;
  reviews?: GooglePlaceReview[];
  photos?: GooglePlacePhoto[];
  types?: string[];
  businessStatus: string;
  location?: { latitude: number; longitude: number };
}

// ─── Fallback Data ───────────────────────────────────────────
// Used when API key is missing or API call fails

export const FALLBACK_PLACE_DATA: GooglePlaceDetails = {
  id: 'ChIJvYxgYy-ipy0ReT6NyUfsbCM',
  displayName: { text: "Lungrin's Lawncare", languageCode: 'en' },
  formattedAddress: '101 Mansker Dr, Flora, MS 39071',
  nationalPhoneNumber: '(601) 906-1281',
  internationalPhoneNumber: '+1 601-906-1281',
  rating: 5.0,
  userRatingCount: 18,
  regularOpeningHours: {
    weekdayDescriptions: [
      'Monday: 7:00 AM – 6:00 PM',
      'Tuesday: 7:00 AM – 6:00 PM',
      'Wednesday: 7:00 AM – 6:00 PM',
      'Thursday: 7:00 AM – 6:00 PM',
      'Friday: 7:00 AM – 6:00 PM',
      'Saturday: Closed',
      'Sunday: Closed',
    ],
  },
  websiteUri: 'https://lungrinslawncare.com',
  googleMapsUri: 'https://www.google.com/maps/place/?q=place_id:ChIJvYxgYy-ipy0ReT6NyUfsbCM',
  businessStatus: 'OPERATIONAL',
  location: { latitude: 32.5432, longitude: -89.8013 },
  types: ['lawn_care_service'],
};

// ─── API Fetching ────────────────────────────────────────────

const PLACES_API_BASE = 'https://places.googleapis.com/v1/places';

const DEFAULT_FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'nationalPhoneNumber',
  'internationalPhoneNumber',
  'rating',
  'userRatingCount',
  'regularOpeningHours',
  'currentOpeningHours',
  'websiteUri',
  'googleMapsUri',
  'reviews',
  'photos',
  'types',
  'businessStatus',
  'location',
].join(',');

// Simple in-memory cache (server-side, resets on redeploy)
let cachedData: { data: GooglePlaceDetails; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch place details from Google Places API (New).
 * Returns fallback data if API key is missing or call fails.
 */
export async function fetchPlaceDetails(
  fieldMask?: string
): Promise<{ data: GooglePlaceDetails; isLive: boolean }> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.LUNGRINS_GOOGLE_PLACE_ID || 'ChIJvYxgYy-ipy0ReT6NyUfsbCM';

  // No API key — return fallback
  if (!apiKey) {
    console.warn('[Google Places] No GOOGLE_PLACES_API_KEY set — using fallback data');
    return { data: FALLBACK_PLACE_DATA, isLive: false };
  }

  // Check cache
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL_MS) {
    return { data: cachedData.data, isLive: true };
  }

  try {
    const url = `${PLACES_API_BASE}/${placeId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask || DEFAULT_FIELD_MASK,
      },
      // Next.js fetch cache: revalidate every 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Google Places] API error ${response.status}: ${errorText}`);
      return { data: FALLBACK_PLACE_DATA, isLive: false };
    }

    const data: GooglePlaceDetails = await response.json();

    // Update cache
    cachedData = { data, timestamp: Date.now() };

    return { data, isLive: true };
  } catch (error) {
    console.error('[Google Places] Fetch failed:', error);
    return { data: FALLBACK_PLACE_DATA, isLive: false };
  }
}

// ─── Convenience Extractors ──────────────────────────────────

export async function getGoogleRating() {
  const { data, isLive } = await fetchPlaceDetails(
    'rating,userRatingCount,googleMapsUri'
  );
  return {
    rating: data.rating,
    reviewCount: data.userRatingCount,
    googleMapsUri: data.googleMapsUri,
    isLive,
  };
}

export async function getGoogleReviews() {
  const { data, isLive } = await fetchPlaceDetails(
    'reviews,rating,userRatingCount,googleMapsUri'
  );
  return {
    reviews: data.reviews || [],
    rating: data.rating,
    reviewCount: data.userRatingCount,
    googleMapsUri: data.googleMapsUri,
    isLive,
  };
}

export async function getGoogleBusinessInfo() {
  const { data, isLive } = await fetchPlaceDetails(
    'displayName,formattedAddress,nationalPhoneNumber,internationalPhoneNumber,regularOpeningHours,currentOpeningHours,websiteUri,googleMapsUri,businessStatus,location'
  );
  return {
    name: data.displayName?.text || "Lungrin's Lawncare",
    address: data.formattedAddress,
    phone: data.nationalPhoneNumber,
    internationalPhone: data.internationalPhoneNumber,
    hours: data.regularOpeningHours,
    currentHours: data.currentOpeningHours,
    websiteUri: data.websiteUri,
    googleMapsUri: data.googleMapsUri,
    businessStatus: data.businessStatus,
    location: data.location,
    isLive,
  };
}

/**
 * Get a photo URL from a Google Places photo reference.
 * Photos require the API key in the URL.
 */
export function getPhotoUrl(
  photoName: string,
  maxWidth: number = 400,
  maxHeight: number = 400
): string | null {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !photoName) return null;
  return `${PLACES_API_BASE}/${photoName}/media?maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}&key=${apiKey}`;
}
