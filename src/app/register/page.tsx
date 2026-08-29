"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OnboardingDashboard() {
  const [companyName, setCompanyName] = useState("");
  const [clientId, setClientId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [techsText, setTechsText] = useState("John Doe, Jane Smith, Bob Johnson");
  const [servicesText, setServicesText] = useState("General Inspection, Standard Repair, Custom Installation");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registeredSlug, setRegisteredSlug] = useState("");
  const [integrationTab, setIntegrationTab] = useState<"standard" | "nextjs">("standard");

  const handleNameChange = (val: string) => {
    setCompanyName(val);
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setClientId(slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!companyName.trim() || !clientId.trim() || !passcode.trim()) {
      setError("Company Name, Client ID, and Passcode are required.");
      setLoading(false);
      return;
    }

    const technicians = techsText.split(",").map(t => t.trim()).filter(Boolean);
    const serviceList = servicesText.split(",").map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          companyName,
          rooferPasscode: passcode,
          googleReviewUrl,
          brand: {
            phone,
            email,
            tagline,
            logoText: companyName,
            logoSubtext: ""
          },
          technicians,
          serviceList
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRegisteredSlug(data.clientId || clientId);
        setSuccess(true);
      } else {
        const errText = await res.text();
        setError(`Provisioning failed: ${errText}`);
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3002";
    const portalUrl = `${baseUrl}/admin/drop-pin?clientId=${registeredSlug}`;
    const mapUrl = `${baseUrl}/?clientId=${registeredSlug}`;
    const embedMapUrl = `${baseUrl}/embed/map?clientId=${registeredSlug}`;
    const embedCarouselUrl = `${baseUrl}/embed/carousel?clientId=${registeredSlug}`;

    return (
      <div className="onboarding-container" style={{ minHeight: "100vh", background: "var(--bg, #0b0c10)", color: "#ffffff", padding: "4rem 1rem" }}>
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="double-bezel-wrapper success-card" style={{ border: "2px solid #d1a453", borderRadius: "12px", background: "#15171e", overflow: "hidden" }}>
            <div className="double-bezel-inner" style={{ padding: "3rem" }}>
              <span className="success-icon" style={{ fontSize: "3rem", display: "block", textAlign: "center", marginBottom: "1rem" }}>🎉</span>
              <h2 style={{ color: "#ffffff", fontSize: "1.8rem", fontWeight: "800", textAlign: "center", marginBottom: "1.5rem" }}>Company Registered Successfully!</h2>
              
              {/* Integration Method Selector */}
              <div style={{ margin: "2.5rem 0 1.5rem 0" }}>
                <h3 style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.75rem", textAlign: "center" }}>💻 Integrate PinDrop Into Your Website</h3>
                <div style={{ display: "flex", background: "rgba(0, 0, 0, 0.2)", padding: "4px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "1.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setIntegrationTab("standard")}
                    style={{
                      flex: 1,
                      background: integrationTab === "standard" ? "#d1a453" : "transparent",
                      color: integrationTab === "standard" ? "#000000" : "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    🔌 Standard HTML/CMS Embed
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntegrationTab("nextjs")}
                    style={{
                      flex: 1,
                      background: integrationTab === "nextjs" ? "#d1a453" : "transparent",
                      color: integrationTab === "nextjs" ? "#000000" : "#ffffff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    ⚡ Next.js Rewrite Proxy (Local SEO)
                  </button>
                </div>
              </div>

              {integrationTab === "standard" && (
                <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5", margin: 0 }}>
                    Best for sites hosted on WordPress, Wix, Webflow, Squarespace, or custom HTML. Copy and paste these responsive iframe blocks into your website pages.
                  </p>

                  <div className="dashboard-urls" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.25rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <h4 style={{ color: "#d1a453", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px 0" }}>📱 Crew Check-In Portal</h4>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 6px 0" }}>Your field crew's secure link to drop job pins on-site:</p>
                      <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.05)", wordBreak: "break-all" }}>
                        <a href={portalUrl} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", textDecoration: "underline", fontSize: "0.8rem" }}>{portalUrl}</a>
                      </div>
                      <span style={{ fontSize: "0.72rem", display: "block", marginTop: "4px", color: "rgba(255,255,255,0.6)" }}>🔑 Crew Passcode: <strong>{passcode}</strong></span>
                    </div>

                    <div style={{ paddingTop: "10px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                      <h4 style={{ color: "#d1a453", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px 0" }}>🗺️ Live Customer Map</h4>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 6px 0" }}>Direct URL to view your company map online:</p>
                      <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.05)", wordBreak: "break-all" }}>
                        <a href={mapUrl} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", textDecoration: "underline", fontSize: "0.8rem" }}>{mapUrl}</a>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>🗺️ Interactive Map Embed Iframe</label>
                      <textarea readOnly value={`<iframe src="${embedMapUrl}" width="100%" height="600" style="border:none; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.3);"></iframe>`} style={{ width: "100%", height: "65px", padding: "8px 12px", fontSize: "0.75rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", resize: "none", fontFamily: "monospace" }} />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>🎠 Recent Work Carousel Embed Iframe</label>
                      <textarea readOnly value={`<iframe src="${embedCarouselUrl}" width="100%" height="320" style="border:none;"></iframe>`} style={{ width: "100%", height: "65px", padding: "8px 12px", fontSize: "0.75rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", resize: "none", fontFamily: "monospace" }} />
                    </div>
                  </div>
                </div>
              )}

              {integrationTab === "nextjs" && (
                <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5", margin: 0 }}>
                    Recommended for Next.js websites. This maps PinDrop natively under your domain subdirectory (e.g. <code>yourdomain.com/pins/</code>) for maximum local SEO benefits.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <strong style={{ color: "#d1a453", fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>Step 1: Configure proxy rules in your Next.js project</strong>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 6px 0" }}>Add these reverse-proxy rules inside your <code>next.config.js</code> or <code>next.config.ts</code>:</p>
                      <textarea 
                        readOnly 
                        value={`// In your next.config.ts / next.config.js\nasync rewrites() {\n  const PINDROP_URL = "${baseUrl}";\n  return [\n    { source: "/pins/", destination: \`\${PINDROP_URL}/pins/\` },\n    { source: "/pins/:path*/", destination: \`\${PINDROP_URL}/pins/:path*/\` },\n    { source: "/admin/", destination: \`\${PINDROP_URL}/admin/\` },\n    { source: "/admin/:path*/", destination: \`\${PINDROP_URL}/admin/:path*/\` },\n    { source: "/api/pins/", destination: \`\${PINDROP_URL}/api/pins/\` },\n    { source: "/api/pins/:path*/", destination: \`\${PINDROP_URL}/api/pins/:path*/\` },\n    { source: "/api/config/", destination: \`\${PINDROP_URL}/api/config/\` },\n    { source: "/api/config/:path*/", destination: \`\${PINDROP_URL}/api/config/:path*/\` },\n    { source: "/api/auth/:path*/", destination: \`\${PINDROP_URL}/api/auth/:path*/\` },\n    { source: "/api/geocode/", destination: \`\${PINDROP_URL}/api/geocode/\` },\n    { source: "/api/provision/", destination: \`\${PINDROP_URL}/api/provision/\` },\n    { source: "/api/upload/", destination: \`\${PINDROP_URL}/api/upload/\` },\n    { source: "/embed/:path*/", destination: \`\${PINDROP_URL}/embed/:path*/\` }\n  ];\n}`} 
                        style={{ width: "100%", height: "180px", padding: "8px 12px", fontSize: "0.72rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", resize: "none", fontFamily: "monospace" }} 
                      />
                    </div>

                    <div>
                      <strong style={{ color: "#d1a453", fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>Step 2: Bind Client ID slug in environment variables</strong>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 6px 0" }}>Add this to your primary website's environment configuration (<code>.env.local</code>):</p>
                      <pre style={{ margin: 0, padding: "8px 12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#8ab4f8", fontSize: "0.75rem", overflowX: "auto" }}>
                        NEXT_PUBLIC_PDM_CLIENT_ID={registeredSlug}{"\n"}
                        PDM_CLIENT_ID={registeredSlug}
                      </pre>
                    </div>

                    <div>
                      <strong style={{ color: "#d1a453", fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>Step 3: Embed dynamic widgets relatively (optional)</strong>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 6px 0" }}>Since traffic is proxied, you can embed widgets using relative urls (no domain names or query parameters needed!):</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <textarea readOnly value={`<iframe src="/embed/map/" width="100%" height="600" style="border:none; border-radius:12px;"></iframe>`} style={{ width: "100%", height: "45px", padding: "8px 12px", fontSize: "0.72rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", resize: "none", fontFamily: "monospace" }} />
                        <textarea readOnly value={`<iframe src="/embed/carousel/" width="100%" height="320" style="border:none;"></iframe>`} style={{ width: "100%", height: "45px", padding: "8px 12px", fontSize: "0.72rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", resize: "none", fontFamily: "monospace" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "2.5rem", flexWrap: "wrap" }}>
                <a 
                  href={portalUrl} 
                  className="btn" 
                  style={{ background: "#d1a453", color: "#000000", border: "none", padding: "10px 24px", borderRadius: "24px", fontSize: "0.82rem", fontWeight: "bold", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                >
                  Launch Crew Portal 🚀
                </a>
                <button 
                  className="btn" 
                  onClick={() => setSuccess(false)} 
                  style={{ background: "rgba(255,255,255,0.08)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 24px", borderRadius: "24px", fontSize: "0.82rem", fontWeight: "bold", cursor: "pointer" }}
                >
                  Register Another Company
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container" style={{ minHeight: "100vh", background: "var(--bg, #0b0c10)", color: "#ffffff", padding: "4rem 1rem" }}>
      <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="onboarding-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="eyebrow" style={{ color: "var(--secondary, #d1a453)", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "bold" }}>PinDrop SaaS Platform</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", margin: "0.5rem 0", color: "#ffffff" }}>Create Your Custom Map Portal</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.5" }}>Register your company instantly to launch your custom team check-in portal, customer project map, and responsive web embedding widgets.</p>
        </div>

        <div className="double-bezel-wrapper" style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", background: "#15171e", overflow: "hidden" }}>
          <div className="double-bezel-inner form-card" style={{ padding: "2.5rem" }}>
            <form onSubmit={handleSubmit}>
              
              {error && (
                <div className="error-banner" style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", borderRadius: "8px", padding: "12px", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#ef4444" }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="form-section" style={{ marginBottom: "2rem" }}>
                <h3 style={{ color: "#d1a453", fontSize: "1rem", fontWeight: "800", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px", marginBottom: "1.25rem" }}>🏢 1. Company Profile</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Company Name</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "100%", padding: "10px 14px", fontSize: "0.85rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                      placeholder="e.g. Acme Services"
                      value={companyName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>
                   <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Portal Slug (Client ID)</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "100%", padding: "10px 14px", fontSize: "0.85rem", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", color: "#888", cursor: "not-allowed" }}
                      placeholder="e.g. acme-services"
                      value={clientId}
                      readOnly
                      required
                    />
                  </div>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Crew Passcode</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "100%", padding: "10px 14px", fontSize: "0.85rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                      placeholder="e.g. passcode123"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section" style={{ marginBottom: "2rem" }}>
                <h3 style={{ color: "#d1a453", fontSize: "1rem", fontWeight: "800", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px", marginBottom: "1.25rem" }}>📞 2. Branding & Contact Info</h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Company Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "100%", padding: "10px 14px", fontSize: "0.85rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                      placeholder="e.g. 800-555-0100"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Company Email</label>
                    <input
                      type="email"
                      className="form-input"
                      style={{ width: "100%", padding: "10px 14px", fontSize: "0.85rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                      placeholder="e.g. contact@acmeservices.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Company Slogan / Tagline</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "100%", padding: "10px 14px", fontSize: "0.85rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                      placeholder="e.g. We get the job done right"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "span 2" }}>
                    <label className="form-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Google Reviews Link</label>
                    <input
                      type="url"
                      className="form-input"
                      style={{ width: "100%", padding: "10px 14px", fontSize: "0.85rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff" }}
                      placeholder="e.g. https://g.page/r/your-review-id/review"
                      value={googleReviewUrl}
                      onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section" style={{ marginBottom: "2rem" }}>
                <h3 style={{ color: "#d1a453", fontSize: "1rem", fontWeight: "800", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px", marginBottom: "1.25rem" }}>👷 3. Crew & Services Setup</h3>
                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "1.25rem" }}>
                  <label className="form-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Initial Crew Members (Comma separated)</label>
                  <textarea
                    className="form-input"
                    style={{ width: "100%", minHeight: "80px", padding: "10px 14px", fontSize: "0.85rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontFamily: "inherit" }}
                    placeholder="John Doe, Jane Smith, Bob Johnson"
                    value={techsText}
                    onChange={(e) => setTechsText(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label className="form-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>Initial Service Categories (Comma separated)</label>
                  <textarea
                    className="form-input"
                    style={{ width: "100%", minHeight: "80px", padding: "10px 14px", fontSize: "0.85rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", fontFamily: "inherit" }}
                    placeholder="General Inspection, Standard Repair, Custom Installation"
                    value={servicesText}
                    onChange={(e) => setServicesText(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-submit" style={{ textAlign: "center", marginTop: "2rem" }}>
                <button type="submit" className="btn" disabled={loading} style={{ background: "#d1a453", color: "#000000", border: "none", padding: "12px 36px", borderRadius: "24px", fontSize: "0.88rem", fontWeight: "bold", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Registering Company..." : "Register & Launch Map Portal"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0b0c10", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Registration Form...</div>}>
      <OnboardingDashboard />
    </Suspense>
  );
}
