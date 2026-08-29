// ──────────────────────────────────────────────────────────────
// Google Business Profile API — Phase 2 Preparation
// When GBP API access is approved, this replaces the 5-review
// Places API limit with the full review feed.
// ──────────────────────────────────────────────────────────────

// OAuth scope required for GBP API access
export const GBP_OAUTH_SCOPE = 'https://www.googleapis.com/auth/business.manage';

// ─── Types ───────────────────────────────────────────────────

export interface GBPReview {
  name: string;           // Resource name e.g. accounts/{id}/locations/{id}/reviews/{id}
  reviewId: string;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
    isAnonymous: boolean;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment: string;
  createTime: string;     // ISO 8601
  updateTime: string;     // ISO 8601
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

export interface GBPReviewsResponse {
  reviews: GBPReview[];
  averageRating: number;
  totalReviewCount: number;
  nextPageToken?: string;
}

export interface GBPPerformanceMetrics {
  searchImpressions?: number;
  mapsImpressions?: number;
  websiteClicks?: number;
  callClicks?: number;
  directionRequests?: number;
  searchKeywords?: Array<{ keyword: string; impressions: number }>;
}

// ─── Placeholder Functions ───────────────────────────────────
// TODO: Implement when GBP API access is approved

/**
 * Discover GBP account ID for the authenticated user.
 * Endpoint: GET https://mybusinessaccountmanagement.googleapis.com/v1/accounts
 */
export async function discoverGBPAccount(
  _accessToken: string
): Promise<{ accountId: string; accountName: string } | null> {
  // TODO: Implement when GBP API access approved
  console.warn('[GBP] discoverGBPAccount not yet implemented');
  return null;
}

/**
 * Discover the GBP location ID for Lungrin's Lawncare.
 * Endpoint: GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations
 */
export async function discoverGBPLocation(
  _accessToken: string,
  _accountId: string
): Promise<{ locationId: string; locationName: string } | null> {
  // TODO: Implement when GBP API access approved
  console.warn('[GBP] discoverGBPLocation not yet implemented');
  return null;
}

/**
 * Fetch ALL reviews (paginated) from GBP API.
 * Endpoint: GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews
 */
export async function fetchAllGBPReviews(
  _accessToken: string,
  _accountId: string,
  _locationId: string
): Promise<GBPReviewsResponse | null> {
  // TODO: Implement when GBP API access approved
  console.warn('[GBP] fetchAllGBPReviews not yet implemented');
  return null;
}

/**
 * Fetch performance metrics from GBP Performance API.
 * Includes: search impressions, maps impressions, clicks, calls, directions.
 */
export async function fetchGBPPerformance(
  _accessToken: string,
  _locationName: string
): Promise<GBPPerformanceMetrics | null> {
  // TODO: Implement when GBP API access approved
  console.warn('[GBP] fetchGBPPerformance not yet implemented');
  return null;
}

/**
 * Convert GBP star rating enum to number.
 */
export function gbpStarToNumber(star: GBPReview['starRating']): number {
  const map = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  return map[star] || 5;
}
