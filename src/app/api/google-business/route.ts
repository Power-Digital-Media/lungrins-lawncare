// ──────────────────────────────────────────────────────────────
// /api/google-business — Server-side endpoint for Google Places data
// Never exposes API key to client
// ──────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { fetchPlaceDetails } from '@/lib/google-places';

export async function GET(request: NextRequest) {
  try {
    const { data, isLive } = await fetchPlaceDetails();

    // Sanitize — strip any sensitive fields before sending to client
    const clientData = {
      id: data.id,
      name: data.displayName?.text || "Lungrin's Lawncare",
      address: data.formattedAddress,
      phone: data.nationalPhoneNumber,
      rating: data.rating,
      reviewCount: data.userRatingCount,
      hours: data.regularOpeningHours?.weekdayDescriptions || [],
      openNow: data.currentOpeningHours?.openNow,
      googleMapsUrl: data.googleMapsUri,
      websiteUrl: data.websiteUri,
      businessStatus: data.businessStatus,
      reviews: (data.reviews || []).map((review) => ({
        authorName: review.authorAttribution?.displayName || 'Google User',
        authorPhoto: review.authorAttribution?.photoUri || '',
        authorUrl: review.authorAttribution?.uri || '',
        rating: review.rating,
        text: review.text?.text || review.originalText?.text || '',
        relativeTime: review.relativePublishTimeDescription || '',
        publishTime: review.publishTime || '',
      })),
      isLive,
    };

    return NextResponse.json(clientData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[/api/google-business] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google business data' },
      { status: 500 }
    );
  }
}
