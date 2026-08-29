import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      {/* Hero Section */}
      <section className="service-hero">
        <div className="service-hero-overlay" />
        <div className="container service-hero-content">
          <p className="eyebrow">Error 404</p>
          <h1>Page Not Found</h1>
          <p className="service-hero-description">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>Let Us Help You Find What You Need</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
            You may have followed an outdated link or typed the address incorrectly.
            Use the links below to get back on track.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2rem',
            }}
          >
            <Link href="/" className="btn btn-primary">
              Go to Homepage
            </Link>
            <Link href="/residential-roofing/" className="btn btn-secondary">
              Our Services
            </Link>
            <Link href="/contact-us/" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
