// ──────────────────────────────────────────────────────────────
// GoogleReviews — Embeddable page for displaying live Google reviews
// Route: /embed/google-reviews/
// ──────────────────────────────────────────────────────────────

import { fetchPlaceDetails } from '@/lib/google-places';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-slate-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function GoogleReviewsEmbed() {
  const { data, isLive } = await fetchPlaceDetails();

  const reviews = data.reviews || [];
  const rating = data.rating || 5.0;
  const reviewCount = data.userRatingCount || 18;
  const googleMapsUri = data.googleMapsUri || 'https://www.google.com/maps/place/?q=place_id:ChIJvYxgYy-ipy0ReT6NyUfsbCM';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Lungrin&apos;s Lawncare Google Reviews</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #1e293b; }
        `}</style>
      </head>
      <body>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
          {/* Rating Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a' }}>{rating.toFixed(1)}</span>
              <StarRating rating={Math.round(rating)} />
            </div>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Based on <strong>{reviewCount}</strong> Google {reviewCount === 1 ? 'review' : 'reviews'}
              {!isLive && <span style={{ marginLeft: '4px', fontSize: '11px', color: '#94a3b8' }}>(cached)</span>}
            </p>
          </div>

          {/* Reviews Grid */}
          {reviews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {reviews.map((review, i) => (
                <div
                  key={i}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <StarRating rating={review.rating} />
                    <p style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', lineHeight: 1.6, marginTop: '12px' }}>
                      &ldquo;{review.text?.text || review.originalText?.text || ''}&rdquo;
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                    {review.authorAttribution?.photoUri ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.authorAttribution.photoUri}
                        alt={review.authorAttribution.displayName}
                        width={32}
                        height={32}
                        style={{ borderRadius: '50%', width: '32px', height: '32px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: '#16a34a', color: '#fff', fontWeight: 700,
                        fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {(review.authorAttribution?.displayName || 'G')[0]}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                        {review.authorAttribution?.displayName || 'Google User'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {review.relativePublishTimeDescription || ''} • via Google
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
              Reviews loading...
            </p>
          )}

          {/* CTA + Attribution */}
          <div style={{ textAlign: 'center' }}>
            <a
              href={googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '8px',
                background: '#fff', border: '2px solid #e2e8f0',
                color: '#334155', fontWeight: 700, fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Read All {reviewCount} Reviews on Google
            </a>
            <p style={{ marginTop: '12px', fontSize: '11px', color: '#cbd5e1' }}>
              Reviews provided by Google Maps • Powered by Google Places API
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
