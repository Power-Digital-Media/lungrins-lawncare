"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import pinsData from "@/data/pins.json";
import reviewsData from "@/data/reviews.json";

interface PinItem {
  id: string;
  title?: string;
  author: string;
  date: string;
  location: string;
  service: string;
  description: string;
  images: string[];
}

interface ReviewItem {
  id: string;
  author: string;
  source: "facebook" | "google";
  rating: number;
  date: string;
  serviceTag: string;
  text: string;
  ownerReply?: string;
}

function toCardWebp(imgPath: string): string {
  return imgPath.endsWith(".webp") && !imgPath.endsWith("-card.webp")
    ? `${imgPath.slice(0, -5)}-card.webp`
    : imgPath;
}

const INITIAL_BA_SLIDER_PCT = 8;

const BEFORE_AFTER_PAIRS = [
  {
    id: "ba-madison-straw",
    tabLabel: "Madison Shrub & Pine Straw",
    location: "Madison, MS",
    date: "Oct 22, 2026",
    title: "Dead Shrub Removal, Weeding & Rolled Pine Straw",
    summary: "Extracted dead foundation shrubs, weeded beds clean, and tucked a thick layer of fresh pine straw.",
    beforeImg: "/images/jobs/fb-2026/oct22-madison-shrub-pinestraw/1.webp",
    afterImg: "/images/jobs/fb-2026/oct22-madison-shrub-pinestraw/2.webp",
    pinId: "lungrin-2026-1022",
  },
  {
    id: "ba-annandale",
    tabLabel: "Annandale Curb Appeal",
    location: "Annandale • Madison, MS",
    date: "Jul 27, 2026",
    title: "Selective Shrub Removal, Shaping & Pine Straw",
    summary: "Opened up the brick arches by removing overcrowded shrubs, sculpting remaining boxwoods, and laying fresh pine straw.",
    beforeImg: "/images/jobs/fb-2026/jul27-annandale-beds/1.webp",
    afterImg: "/images/jobs/fb-2026/jul27-annandale-beds/2.webp",
    pinId: "lungrin-2026-0727",
  },
  {
    id: "ba-flora-beds",
    tabLabel: "Flora Flowerbeds (Nov 2026)",
    location: "Flora, MS",
    date: "Nov 10, 2026",
    title: "Front Elevation & Porch Flowerbed Reclamation",
    summary: "Pulled waist-high late-season weeds by the root, cleared around evergreens, and restored clean bed lines.",
    beforeImg: "/images/jobs/fb-2026/nov10-flora-beds/1.webp",
    afterImg: "/images/jobs/fb-2026/nov10-flora-beds/2.webp",
    pinId: "lungrin-2026-1110",
  },
  {
    id: "ba-jackson-fence",
    tabLabel: "Jackson Fence Clearing",
    location: "Jackson, MS",
    date: "Oct 20, 2026",
    title: "Overhanging Limb & Invasive Vine Fence Reclamation",
    summary: "Trimmed heavy overhanging canopy limbs, stripped out thick vines choking the wood fence, and hauled off all brush.",
    beforeImg: "/images/jobs/fb-2026/oct20-jackson-fenceline/2.webp",
    afterImg: "/images/jobs/fb-2026/oct20-jackson-fenceline/4.webp",
    pinId: "lungrin-2026-1020",
  },
  {
    id: "ba-pocahontas-pond",
    tabLabel: "Pocahontas Pond Bank",
    location: "Pocahontas, MS",
    date: "Aug 5, 2026",
    title: "360° Pond Perimeter & Shoreline Transformation",
    summary: "Cleared chest-high briars, stumps, and tangled vines around the entire waterline and wooden pier.",
    beforeImg: "/images/jobs/fb-2026/aug05-pocahontas-pond/1.webp",
    afterImg: "/images/jobs/fb-2026/aug05-pocahontas-pond/3.webp",
    pinId: "lungrin-009",
  },
];

const LOT_OPTIONS = [
  { id: "small", range: "Under 0.25 Acre", title: "Small Town Yard", sub: "Quick & crisp cut", base: [40, 55] as [number, number] },
  { id: "medium", range: "0.25 – 0.5 Acre", title: "Standard Suburb Lot", sub: "Most common size", base: [55, 75] as [number, number] },
  { id: "large", range: "0.5 – 1.0 Acre", title: "Large / Corner Lot", sub: "Spacious turf & beds", base: [75, 110] as [number, number] },
  { id: "xlarge", range: "1.0 – 2+ Acres", title: "Acreage / Estate", sub: "Rural & large estates", base: [110, 185] as [number, number] },
];

const HERO_SHOWCASE_SLIDES = [
  {
    id: "hero-flora-curved",
    thumbLabel: "Flora Beds",
    tag: "✓ Real Flora, MS Property",
    title: "Curved Longleaf Pine Straw Beds & Fresh Turf",
    location: "Flora, MS • Oct 30, 2026",
    mobileImg: "/images/jobs/fb-2026/hero/flora-curved-640.webp",
    desktopImg: "/images/jobs/fb-2026/hero/flora-curved-1200.webp",
    thumbImg: "/images/jobs/fb-2026/hero/flora-curved-thumb.webp",
    gallery: [
      "/images/jobs/fb-2026/oct30-flora-pinestraw/2.webp",
      "/images/jobs/fb-2026/oct30-flora-pinestraw/1.webp",
      "/images/jobs/fb-2026/oct30-flora-pinestraw/3.webp",
    ],
  },
  {
    id: "hero-flora-corner",
    thumbLabel: "Rolled Edge",
    tag: "✓ Hand-Tucked 90° Corner",
    title: "Thick Rolled-Edge Longleaf Pine Straw",
    location: "Flora, MS • Oct 30, 2026",
    mobileImg: "/images/jobs/fb-2026/hero/flora-corner-640.webp",
    desktopImg: "/images/jobs/fb-2026/hero/flora-corner-1200.webp",
    thumbImg: "/images/jobs/fb-2026/hero/flora-corner-thumb.webp",
    gallery: [
      "/images/jobs/fb-2026/oct30-flora-pinestraw/1.webp",
      "/images/jobs/fb-2026/oct30-flora-pinestraw/2.webp",
      "/images/jobs/fb-2026/oct30-flora-pinestraw/3.webp",
    ],
  },
  {
    id: "hero-ridgeland-stripes",
    thumbLabel: "Turf Stripes",
    tag: "✓ Ridgeland, MS Route",
    title: "Laser-Straight Zero-Turn Striping & Edging",
    location: "Ridgeland, MS • Jul 29, 2026",
    mobileImg: "/images/jobs/fb-2026/hero/ridgeland-stripes-640.webp",
    desktopImg: "/images/jobs/fb-2026/hero/ridgeland-stripes-1200.webp",
    thumbImg: "/images/jobs/fb-2026/hero/ridgeland-stripes-thumb.webp",
    gallery: [
      "/images/jobs/fb-2026/jul29-ridgeland-striping/2.webp",
      "/images/jobs/fb-2026/jul29-ridgeland-striping/3.webp",
      "/images/jobs/fb-2026/jul29-ridgeland-striping/1.webp",
    ],
  },
  {
    id: "hero-pocahontas-pond",
    thumbLabel: "Pond Bank",
    tag: "✓ Pocahontas, MS Clearing",
    title: "360° Pond Perimeter & Shoreline Reclamation",
    location: "Pocahontas, MS • Aug 5, 2026",
    mobileImg: "/images/jobs/fb-2026/hero/pocahontas-pond-640.webp",
    desktopImg: "/images/jobs/fb-2026/hero/pocahontas-pond-1200.webp",
    thumbImg: "/images/jobs/fb-2026/hero/pocahontas-pond-thumb.webp",
    gallery: [
      "/images/jobs/fb-2026/aug05-pocahontas-pond/3.webp",
      "/images/jobs/fb-2026/aug05-pocahontas-pond/4.webp",
      "/images/jobs/fb-2026/aug05-pocahontas-pond/1.webp",
    ],
  },
];

const CALC_SERVICES = [
  { id: "mowing", shortLabel: "Mowing & Edging", label: "Mowing, Edging & Blow-Off", sub: "Stripe cut, trim, 90° concrete edge", addon: [0, 0] as [number, number] },
  { id: "pinestraw", shortLabel: "Pine Straw / Mulch", label: "Rolled Pine Straw / Mulch", sub: "Thick coverage & tucked borders", addon: [70, 135] as [number, number] },
  { id: "beds", shortLabel: "Bed Weeding", label: "Flowerbed Weeding & Planting", sub: "Root pull, trenching & new plants", addon: [55, 110] as [number, number] },
  { id: "shrubs", shortLabel: "Bush Trimming", label: "Bush & Hedge Trimming", sub: "Crisp shaping + clipping haul-off", addon: [40, 80] as [number, number] },
  { id: "leaf", shortLabel: "Leaf Cleanup", label: "Leaf Removal & Cleanup", sub: "Full yard leaf clearing & haul-away", addon: [50, 95] as [number, number] },
  { id: "gutters", shortLabel: "Gutter Cleaning", label: "Gutter Cleaning & Flushing", sub: "Hand-cleared valleys & downspouts", addon: [55, 100] as [number, number] },
  { id: "clearing", shortLabel: "Pond / Fence Clear", label: "Pond Bank / Fence Clearing", sub: "Brush, vines, briars & bush hogging", addon: [65, 130] as [number, number] },
  { id: "junk", shortLabel: "Junk Haul-Away", label: "Junk & Brush Haul-Away", sub: "Trailer load-out & off-site disposal", addon: [60, 120] as [number, number] },
];

const FREQ_OPTIONS = [
  { id: "weekly", title: "Weekly Route", badge: "Best Rate", sub: "Peak turf density & stripe definition", factor: 1.0, unit: "/ visit (est.)" },
  { id: "biweekly", title: "Bi-Weekly (Every 2 Wks)", badge: "", sub: "Balanced maintenance schedule", factor: 1.15, unit: "/ cut (est.)" },
  { id: "onetime", title: "One-Time Project / Cleanup", badge: "", sub: "Pine straw, overgrowth, leaf or trial job", factor: 1.3, unit: "project est." },
];

const GALLERY_FILTERS = [
  { id: "all", label: "All Verified Jobs" },
  { id: "beds", label: "Pine Straw & Flowerbeds" },
  { id: "mowing", label: "Mowing & Striping" },
  { id: "clearing", label: "Fence, Brush & Bush Hogging" },
  { id: "pond", label: "Pond & Lake Shorelines" },
  { id: "cleanup", label: "Leaf & Debris Haul-Away" },
];

const FACEBOOK_REELS = [
  {
    title: "Bee Lake Steep Lakeside Cleanup",
    views: "785 plays",
    tag: "Bee Lake, MS",
    img: "/images/jobs/fb-2026/reels/reel-1048308904036598-clean.webp",
    url: "https://www.facebook.com/reel/1048308904036598/",
  },
  {
    title: "Front Porch Pine Straw Install",
    views: "415 plays",
    tag: "Before & After",
    img: "/images/jobs/fb-2026/reels/reel-863455829536104-clean.webp",
    url: "https://www.facebook.com/reel/863455829536104/",
  },
  {
    title: "Backyard Pool Area Reclamation",
    views: "1.9K plays",
    tag: "Overgrowth Clear",
    img: "/images/jobs/fb-2026/reels/reel-1060504499384817-clean.webp",
    url: "https://www.facebook.com/reel/1060504499384817/",
  },
  {
    title: "Pine-Lot Spring Property Cleanup",
    views: "1.3K plays",
    tag: "Spring Cleanup",
    img: "/images/jobs/fb-2026/reels/reel-1320510892406330-clean.webp",
    url: "https://www.facebook.com/reel/1320510892406330/",
  },
  {
    title: "Trailer Home Demo & Haul-Away",
    views: "256 plays",
    tag: "Demo & Removal",
    img: "/images/jobs/fb-2026/reels/reel-1961781664271110-clean.webp",
    url: "https://www.facebook.com/reel/1961781664271110/",
  },
];

const FAQ_ITEMS = [
  {
    q: "How often should my lawn be mowed in Central Mississippi?",
    a: "During Mississippi's peak growing season (April through October), weekly mowing every 7–10 days keeps Bermuda, Zoysia, and St. Augustine turf thick, weed-resistant, and free from scalping. Bi-weekly routes are also available during shoulder months or for slower-growing properties.",
  },
  {
    q: "How do free estimates work with Luke?",
    a: "Use our Instant Estimate Calculator on this page for a quick ballpark range, or call/text Luke directly at (601) 906-1281. For routine yards Luke can often quote same-day, and for pine straw counts, overgrowth cleanups, pond banks, or acreage he will gladly stop by in person at zero cost.",
  },
  {
    q: "What towns and neighborhoods do you service?",
    a: "Lungrin's Lawncare is based in Flora, MS (39071) and runs active routes across Flora, Pocahontas, Madison (including Annandale & Reunion), Gluckstadt, Ridgeland, North Jackson, Bentonia, and Yazoo County (including Bee Lake).",
  },
  {
    q: "What makes your pine straw installations hold up so well?",
    a: "We focus on details over speed: we pull weeds and clear encroaching grass runners first, spade a crisp border edge, lay a thick 3–4 inch blanket of clean longleaf needles, and tightly hand-tuck and roll every concrete and lawn edge so rainstorms don't wash straw across your driveway.",
  },
  {
    q: "Do I need to be home when you service my property?",
    a: "Not at all. As long as backyard gates are unlocked and pets are safely indoors, Luke handles the entire job, blows off every porch, walkway, and driveway, and texts you if anything needs your attention.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Venmo, Cash App, Zelle, checks, and cash upon completion — with straightforward, transparent pricing and zero surprise fees.",
  },
];

function matchGalleryCategory(service: string): string {
  const s = service.toLowerCase();
  if (s.includes("pine straw") || s.includes("flowerbed") || s.includes("mulch")) return "beds";
  if (s.includes("mowing")) return "mowing";
  if (s.includes("pond") || s.includes("lake")) return "pond";
  if (s.includes("leaf") || s.includes("debris") || s.includes("cleanout")) return "cleanup";
  return "clearing";
}

function MobileCarouselRow({
  children,
  itemCount,
  resetKey,
  ariaLabel,
  darkTheme = false,
}: {
  children: React.ReactNode;
  itemCount: number;
  resetKey?: string;
  ariaLabel: string;
  darkTheme?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [resetKey]);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || el.children.length === 0) return;
    const firstChild = el.children[0] as HTMLElement;
    const step = firstChild.offsetWidth + 15;
    if (step <= 0) return;
    const idx = Math.min(itemCount - 1, Math.max(0, Math.round(el.scrollLeft / step)));
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const scrollByStep = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el || el.children.length === 0) return;
    const firstChild = el.children[0] as HTMLElement;
    const step = firstChild.offsetWidth + 15;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="ll-cards-grid-3 ll-mobile-carousel-track"
        aria-label={ariaLabel}
      >
        {children}
      </div>
      {itemCount > 1 && (
        <div className={`ll-carousel-nav ${darkTheme ? "ll-carousel-nav-dark" : ""}`}>
          <span className="ll-carousel-status">
            Swipe cards • <strong>{Math.min(activeIndex + 1, itemCount)}</strong> of <strong>{itemCount}</strong>
          </span>
          <div className="ll-carousel-arrows">
            <button
              type="button"
              className="ll-carousel-arrow"
              aria-label="Previous card"
              disabled={activeIndex <= 0}
              onClick={() => scrollByStep(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="ll-carousel-arrow"
              aria-label="Next card"
              disabled={activeIndex >= itemCount - 1}
              onClick={() => scrollByStep(1)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomeClient() {
  const pins = pinsData as PinItem[];
  const staticReviews = reviewsData.reviews as ReviewItem[];

  // Live Google rating/count hydration
  const [googleStats, setGoogleStats] = useState({
    rating: reviewsData.summary.googleRating,
    count: reviewsData.summary.googleReviewCount,
  });

  useEffect(() => {
    fetch("/api/google-business/")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.rating && d.reviewCount) {
          setGoogleStats({ rating: Number(d.rating), count: Number(d.reviewCount) });
        }
      })
      .catch(() => {});
  }, []);

  // Hero Showcase & Before / After Slider State
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const activeHero = HERO_SHOWCASE_SLIDES[activeHeroIdx];
  const [activeBaIdx, setActiveBaIdx] = useState(0);
  const [sliderPct, setSliderPct] = useState(INITIAL_BA_SLIDER_PCT);
  const baViewportRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const activeBa = BEFORE_AFTER_PAIRS[activeBaIdx];

  const updateSliderFromClientX = (clientX: number) => {
    const el = baViewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(7, Math.min(96, ((clientX - rect.left) / rect.width) * 100));
    setSliderPct(pct);
  };

  // Gallery Filter & Lightbox State
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [visibleJobsCount, setVisibleJobsCount] = useState(6);
  const [lightbox, setLightbox] = useState<{ title: string; location: string; images: string[]; index: number } | null>(null);

  const filteredJobs = useMemo(() => {
    if (galleryFilter === "all") return pins;
    return pins.filter((p) => matchGalleryCategory(p.service) === galleryFilter);
  }, [pins, galleryFilter]);

  const visibleJobs = useMemo(() => filteredJobs.slice(0, visibleJobsCount), [filteredJobs, visibleJobsCount]);

  // Estimate Calculator State
  const [selectedLot, setSelectedLot] = useState("small");
  const [selectedServices, setSelectedServices] = useState<string[]>(["mowing"]);
  const [selectedFreq, setSelectedFreq] = useState("weekly");

  const toggleService = (id: string) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const estimateCalc = useMemo(() => {
    const lot = LOT_OPTIONS.find((l) => l.id === selectedLot) || LOT_OPTIONS[0];
    const freq = FREQ_OPTIONS.find((f) => f.id === selectedFreq) || FREQ_OPTIONS[0];
    if (selectedServices.length === 0) {
      return { text: "$0", unit: "Select at least 1 service above" };
    }
    let [minP, maxP] = lot.base;
    const hasMowing = selectedServices.includes("mowing");
    selectedServices.forEach((sid) => {
      const svc = CALC_SERVICES.find((s) => s.id === sid);
      if (svc && sid !== "mowing") {
        minP += svc.addon[0];
        maxP += svc.addon[1];
      }
    });
    if (!hasMowing) {
      minP = Math.max(45, minP - lot.base[0] * 0.72);
      maxP = Math.max(65, maxP - lot.base[1] * 0.72);
    }
    return {
      text: `$${Math.round(minP * freq.factor)} – $${Math.round(maxP * freq.factor)}`,
      unit: freq.unit,
    };
  }, [selectedLot, selectedServices, selectedFreq]);

  // Contact Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formService, setFormService] = useState("Regular Lawn Mowing & Edging");
  const [formNotes, setFormNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedSmsUrl, setSubmittedSmsUrl] = useState<string | null>(null);

  const handleLockEstimate = () => {
    const lotObj = LOT_OPTIONS.find((l) => l.id === selectedLot);
    const freqObj = FREQ_OPTIONS.find((f) => f.id === selectedFreq);
    const svcNames = CALC_SERVICES.filter((s) => selectedServices.includes(s.id))
      .map((s) => s.label)
      .join(", ");
    setFormNotes(
      `Online Estimate: ${estimateCalc.text} ${estimateCalc.unit} (${freqObj?.title || selectedFreq}, ${lotObj?.range || selectedLot}).\nRequested Services: ${svcNames}.`
    );
    if (typeof window !== "undefined" && typeof window.trackLungrinEvent === "function") {
      window.trackLungrinEvent("lock_estimate", {
        estimate_range: estimateCalc.text,
        lot_size: selectedLot,
        frequency: selectedFreq,
      });
    }
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (typeof window !== "undefined" && typeof window.trackLungrinEvent === "function") {
      const leadParams = {
        service_requested: formService,
        property_location: formAddress.trim(),
        lead_source: "homepage_estimate_form",
      };
      window.trackLungrinEvent("form_submit", leadParams);
      window.trackLungrinEvent("generate_lead", leadParams);
    }

    const smsBody = [
      `Hi Luke! I'd like a free estimate from Lungrin's Lawncare.`,
      `Name: ${formName.trim()}`,
      `Phone: ${formPhone.trim()}`,
      `Address/Town: ${formAddress.trim()}`,
      `Service: ${formService}`,
      formNotes.trim() ? `Details: ${formNotes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const smsHref = `sms:6019061281?body=${encodeURIComponent(smsBody)}`;

    try {
      await fetch("/api/forms/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          phone: formPhone.trim(),
          addressStreet: formAddress.trim(),
          service: formService,
          message: formNotes.trim(),
          _form_source: "estimate-request",
          page_url: typeof window !== "undefined" ? window.location.href : "https://lungrinslawncare.com/",
          clientId: "lungrins-lawncare",
        }),
      });
    } catch {
      // Fallback gracefully to direct SMS/Call actions
    } finally {
      setSubmitting(false);
      setSubmittedSmsUrl(smsHref);
    }
  };

  // Service Area Checker State
  const [areaQuery, setAreaQuery] = useState("");
  const [areaResult, setAreaResult] = useState<{ matched: boolean; label: string } | null>(null);

  const checkServiceArea = (e: React.FormEvent) => {
    e.preventDefault();
    const q = areaQuery.trim().toLowerCase();
    if (!q) return;
    const activeKeywords = [
      "flora", "39071", "pocahontas", "madison", "39110", "annandale", "reunion",
      "gluckstadt", "ridgeland", "39157", "jackson", "39211", "39206", "39213",
      "bentonia", "39040", "yazoo", "bee lake", "kearney", "canton", "39046", "clinton",
    ];
    const matched = activeKeywords.some((k) => q.includes(k));
    setAreaResult({ matched, label: areaQuery.trim() });
  };

  // Reviews Filter State
  const [reviewFilter, setReviewFilter] = useState<"all" | "facebook" | "google">("all");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "all") return staticReviews;
    return staticReviews.filter((r) => r.source === reviewFilter);
  }, [staticReviews, reviewFilter]);

  // FAQ State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const totalVerifiedReviews = googleStats.count + reviewsData.summary.facebookReviewCount;

  return (
    <div className="ll-page">
      {/* 1. HERO SECTION — FULL-BLEED REAL PROPERTY BACKDROP + FIRST-FOLD SHOWCASE */}
      <section
        className="ll-hero"
        style={{ "--hero-bg-url": `url(${activeHero.mobileImg})` } as React.CSSProperties}
      >
        <div className="ll-hero-bg" aria-hidden="true">
          <div className="ll-hero-bg-desktop-photo" />
          <div className="ll-hero-scrim" />
        </div>

        <div className="ll-container ll-hero-inner">
          <div className="ll-hero-grid">
            {/* Left / Top First-Fold Copy */}
            <div>
              <a href="#reviews" className="ll-hero-rating-pill">
                <span style={{ color: "#facc15", letterSpacing: "0.03em" }}>★★★★★</span>
                <span>
                  {googleStats.rating.toFixed(1)} Google ({googleStats.count}) • 100% FB ({reviewsData.summary.facebookReviewCount})
                </span>
              </a>

              <h1 className="ll-hero-h1">
                Razor-Sharp Edges,{" "}
                <span className="ll-hero-h1-accent">Rolled Pine Straw</span>{" "}
                &amp; Spotless Lawns.
                <span className="ll-hero-h1-geo">Flora, Madison, Ridgeland &amp; Jackson, MS</span>
              </h1>

              <p className="ll-hero-lead">
                Owner-operated by <strong style={{ marginRight: "0.08em" }}>Luke Lungrin</strong>{" "}
                across Flora, Madison, Gluckstadt &amp; Ridgeland — meticulous lawn, flowerbed &amp; property care without franchise prices.
              </p>

              <div className="ll-hero-chips">
                <span className="ll-hero-chip">✓ Owner-Operated</span>
                <span className="ll-hero-chip">✓ $0 Quotes</span>
                <Link href="/pins/" className="ll-hero-chip" style={{ textDecoration: "none" }}>
                  📍 {pins.length} Job Pins →
                </Link>
              </div>

              <div className="ll-hero-actions">
                <div className="ll-btn-hero-primary-wrap">
                  <a href="#calculator" className="ll-btn-hero-primary">
                    <span>⚡ Calculate Instant Estimate</span>
                    <span>→</span>
                  </a>
                </div>
                <a href="tel:6019061281" className="ll-btn-hero-glass">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#4ade80" aria-hidden="true">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
                  </svg>
                  <span>(601) 906-1281</span>
                </a>
                <a
                  href="sms:6019061281?body=Hi%20Luke,%20I%27d%20like%20a%20free%20estimate%20for%20my%20yard!"
                  className="ll-btn-hero-glass"
                >
                  <span>💬 Text Luke</span>
                </a>
              </div>
            </div>

            {/* Right / Bottom Live Property Showcase + 4-Photo Switcher (Visible on Screen #1!) */}
            <div className="ll-hero-card">
              <div
                className="ll-hero-photo-wrap"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setLightbox({
                    title: activeHero.title,
                    location: activeHero.location,
                    images: activeHero.gallery,
                    index: 0,
                  })
                }
              >
                <span className="ll-hero-top-tag">{activeHero.tag}</span>
                <span className="ll-hero-zoom-tag">🔍 Full Photo</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeHero.mobileImg}
                  srcSet={`${activeHero.mobileImg} 640w, ${activeHero.desktopImg} 1200w`}
                  sizes="(max-width: 767px) 320px, 560px"
                  alt={`${activeHero.title} — ${activeHero.location} by Lungrin's Lawncare`}
                  width={640}
                  height={480}
                  fetchPriority="high"
                />
                <div className="ll-hero-photo-overlay">
                  <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#ffffff", lineHeight: 1.2 }}>
                    {activeHero.title}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#bbf7d0", fontWeight: 600 }}>
                    {activeHero.location} • Zero Stock Photos
                  </div>
                </div>
              </div>

              <div className="ll-hero-thumb-strip" aria-label="Switch real local project photo">
                {HERO_SHOWCASE_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-pressed={activeHeroIdx === idx}
                    className={`ll-hero-thumb-btn ${activeHeroIdx === idx ? "active" : ""}`}
                    onClick={() => setActiveHeroIdx(idx)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.thumbImg}
                      alt=""
                      width={180}
                      height={120}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                    <span className="ll-hero-thumb-caption">{slide.thumbLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS STRIP + CONTINUOUS VERIFIED REVIEWS MARQUEE */}
      <section className="ll-stats-strip" aria-label="Company Highlights and Verified Reviews">
        <div className="ll-container">
          <div className="ll-stats-grid">
            <div>
              <div className="ll-stat-num">5.0 ★</div>
              <div className="ll-stat-label">{totalVerifiedReviews} Reviews • 100% FB Recommend</div>
            </div>
            <div>
              <div className="ll-stat-num">{pins.length} Jobs</div>
              <div className="ll-stat-label">Pinned Across 8 MS Communities</div>
            </div>
            <div>
              <div className="ll-stat-num">100%</div>
              <div className="ll-stat-label">Owner-Operated Attention to Detail</div>
            </div>
            <div>
              <div className="ll-stat-num">$0</div>
              <div className="ll-stat-label">Free Transparent Quotes</div>
            </div>
          </div>
        </div>

        <div className="ll-marquee-divider" aria-hidden="true">
          <div className="ll-marquee-divider-line" />
        </div>

        <div className="ll-marquee-wrap" aria-label="Continuous stream of verified customer reviews">
          <div className="ll-marquee-track">
            {[0, 1].map((copyIdx) => (
              <div
                key={copyIdx}
                className="ll-marquee-group"
                aria-hidden={copyIdx === 1 ? "true" : undefined}
              >
                {staticReviews.map((rev) => (
                  <a
                    key={`${copyIdx}-${rev.id}`}
                    href="#reviews"
                    tabIndex={copyIdx === 1 ? -1 : undefined}
                    className="ll-marquee-card"
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                      <span style={{ color: "#facc15", fontSize: "0.8rem", letterSpacing: "0.04em" }}>★★★★★</span>
                      <span
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 800,
                          padding: "0.14rem 0.48rem",
                          borderRadius: "999px",
                          background: rev.source === "facebook" ? "rgba(59, 130, 246, 0.22)" : "rgba(34, 197, 94, 0.22)",
                          color: rev.source === "facebook" ? "#93c5fd" : "#86efac",
                          border: rev.source === "facebook" ? "1px solid rgba(96, 165, 250, 0.35)" : "1px solid rgba(74, 222, 128, 0.35)",
                        }}
                      >
                        {rev.source === "facebook" ? "FB Recommends" : "Google 5.0★"}
                      </span>
                    </div>

                    <p className="ll-marquee-quote">&ldquo;{rev.text}&rdquo;</p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#ffffff" }}>{rev.author}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#86efac" }}>{rev.serviceTag}</span>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BEFORE & AFTER SWITCHER + FILTERABLE FACEBOOK PROJECT GALLERY */}
      <section id="gallery" className="ll-section ll-section-tint">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Real Central Mississippi Transformations</span>
            <h2>Drag to Compare Before &amp; After</h2>
            <p>
              Every photo below comes straight from real properties serviced by Luke Lungrin across Flora, Madison, Jackson, Bentonia, Gluckstadt, Ridgeland, and Pocahontas.
            </p>
          </div>

          {/* 5-Transformation Switcher */}
          <div className="ll-ba-tabs" role="tablist" aria-label="Select before and after project">
            {BEFORE_AFTER_PAIRS.map((pair, idx) => (
              <button
                key={pair.id}
                type="button"
                role="tab"
                aria-selected={activeBaIdx === idx}
                className={`ll-ba-tab ${activeBaIdx === idx ? "active" : ""}`}
                onClick={() => {
                  setActiveBaIdx(idx);
                  setSliderPct(INITIAL_BA_SLIDER_PCT);
                }}
              >
                {pair.tabLabel}
              </button>
            ))}
          </div>

          <div className="ll-ba-stage">
            <div
              ref={baViewportRef}
              className="ll-ba-viewport"
              onMouseDown={(e) => {
                draggingRef.current = true;
                updateSliderFromClientX(e.clientX);
              }}
              onMouseMove={(e) => {
                if (draggingRef.current) updateSliderFromClientX(e.clientX);
              }}
              onMouseUp={() => {
                draggingRef.current = false;
              }}
              onMouseLeave={() => {
                draggingRef.current = false;
              }}
              onTouchStart={(e) => {
                draggingRef.current = true;
                if (e.touches[0]) updateSliderFromClientX(e.touches[0].clientX);
              }}
              onTouchMove={(e) => {
                if (draggingRef.current && e.touches[0]) updateSliderFromClientX(e.touches[0].clientX);
              }}
              onTouchEnd={() => {
                draggingRef.current = false;
              }}
            >
              {/* BEFORE Base Image (Starts visible across the frame) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={toCardWebp(activeBa.beforeImg)}
                srcSet={`${toCardWebp(activeBa.beforeImg)} 560w, ${activeBa.beforeImg} 960w`}
                sizes="(max-width: 767px) 360px, 760px"
                alt={`Before — ${activeBa.title} in ${activeBa.location}`}
                width={960}
                height={720}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="ll-ba-img-after"
              />
              <span className="ll-ba-badge ll-ba-badge-before">
                Before<span className="ll-ba-badge-extra"> • Overgrown</span>
              </span>

              {/* AFTER Clipped Reveal Layer (Sweeps left-to-right as user slides to After) */}
              <div className="ll-ba-before-clip" style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={toCardWebp(activeBa.afterImg)}
                  srcSet={`${toCardWebp(activeBa.afterImg)} 560w, ${activeBa.afterImg} 960w`}
                  sizes="(max-width: 767px) 360px, 760px"
                  alt={`After — ${activeBa.title} in ${activeBa.location}`}
                  width={960}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="ll-ba-img-after"
                />
                <span className="ll-ba-badge ll-ba-badge-after">
                  After<span className="ll-ba-badge-extra"> • Lungrin&apos;s Care</span>
                </span>
              </div>

              {/* Slider Handle */}
              <div className="ll-ba-divider" style={{ left: `${sliderPct}%` }}>
                <div className="ll-ba-handle" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
                  </svg>
                  <span
                    className="ll-ba-slide-cue"
                    style={{ opacity: sliderPct <= 14 ? 1 : 0 }}
                  >
                    Slide to After →
                  </span>
                </div>
              </div>
            </div>

            {/* Caption Bar under Before/After */}
            <div
              style={{
                marginTop: "1rem",
                background: "#ffffff",
                border: "1px solid #dce8df",
                borderRadius: "16px",
                padding: "1rem 1.25rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#15803d", textTransform: "uppercase" }}>
                  {activeBa.location} • {activeBa.date}
                </div>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>{activeBa.title}</div>
                <div style={{ fontSize: "0.85rem", color: "#475569" }}>{activeBa.summary}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>
                    Before
                  </span>
                  <input
                    type="range"
                    min={7}
                    max={96}
                    value={Math.round(sliderPct)}
                    aria-label="Slide from before to after transformation"
                    onChange={(e) => setSliderPct(Number(e.target.value))}
                    style={{ accentColor: "#16a34a", width: "104px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#15803d", textTransform: "uppercase" }}>
                    After
                  </span>
                </div>
                <Link
                  href={`/pin-page/?id=${activeBa.pinId}`}
                  style={{ fontSize: "0.84rem", fontWeight: 800, color: "#15803d", textDecoration: "none" }}
                >
                  View Full Pin →
                </Link>
              </div>
            </div>
          </div>

          {/* Filterable All-Jobs Grid */}
          <div style={{ marginTop: "4.25rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "clamp(1.55rem, 2.6vw, 2.15rem)", fontWeight: 900, marginBottom: "0.4rem" }}>
                Browse Recent Field Projects &amp; Job Pins ({pins.length})
              </h3>
              <p style={{ fontSize: "0.94rem", color: "#475569" }}>
                Filter by service type, click any photo for the full gallery, or explore every pin on our interactive satellite map.
              </p>
            </div>

            <div className="ll-filter-pills">
              {GALLERY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`ll-ba-tab ${galleryFilter === f.id ? "active" : ""}`}
                  onClick={() => {
                    setGalleryFilter(f.id);
                    setVisibleJobsCount(6);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <MobileCarouselRow
              itemCount={visibleJobs.length + 1}
              resetKey={galleryFilter}
              ariaLabel="Recent verified field projects"
            >
              {visibleJobs.map((job) => (
                <article key={job.id} className="ll-job-card">
                  <div>
                    <div
                      className="ll-job-media"
                      onClick={() =>
                        setLightbox({
                          title: job.title || `${job.service} in ${job.location}`,
                          location: `${job.location} • ${job.date}`,
                          images: job.images,
                          index: 0,
                        })
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={toCardWebp(job.images[0])}
                        srcSet={
                          toCardWebp(job.images[0]) !== job.images[0]
                            ? `${toCardWebp(job.images[0])} 560w, ${job.images[0]} 960w`
                            : undefined
                        }
                        sizes="(max-width: 767px) 320px, 370px"
                        alt={`${job.title || job.service} in ${job.location} by Lungrin's Lawncare`}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        width={560}
                        height={420}
                      />
                      <span className="ll-job-loc-badge">📍 {job.location}</span>
                      {job.images.length > 1 && (
                        <span className="ll-job-count-badge">📷 {job.images.length} Photos</span>
                      )}
                      <span className="ll-job-svc-badge">{job.service}</span>
                    </div>

                    <div className="ll-job-body">
                      <div className="ll-job-meta">
                        <span>By {job.author}</span>
                        <span>{job.date}</span>
                      </div>
                      <h4 className="ll-job-title">{job.title || `${job.service} — ${job.location}`}</h4>
                      <p className="ll-job-desc">{job.description}</p>
                    </div>
                  </div>

                  <div className="ll-job-footer">
                    <Link
                      href={`/pin-page/?id=${job.id}`}
                      style={{ fontSize: "0.82rem", fontWeight: 800, color: "#15803d", textDecoration: "none" }}
                    >
                      Project Pin &amp; Photos →
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({
                          title: job.title || `${job.service} in ${job.location}`,
                          location: `${job.location} • ${job.date}`,
                          images: job.images,
                          index: 0,
                        })
                      }
                      style={{
                        background: "#ecfdf5",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                        borderRadius: "7px",
                        padding: "0.24rem 0.6rem",
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Zoom ({job.images.length})
                    </button>
                  </div>
                </article>
              ))}

              <Link href="/pins/" className="ll-mobile-only-endcard">
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "16px",
                    background: "rgba(34, 197, 94, 0.2)",
                    border: "1px solid rgba(74, 222, 128, 0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                  }}
                >
                  🗺️
                </div>
                <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#ffffff", lineHeight: 1.25 }}>
                  Explore All {pins.length} Verified Job Pins
                </div>
                <div style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                  Interactive satellite map &amp; full photo galleries across Flora, Madison, Pocahontas, Gluckstadt &amp; Ridgeland.
                </div>
                <span className="ll-btn-cta-green" style={{ marginTop: "0.35rem", width: "100%" }}>
                  Open Satellite Map →
                </span>
              </Link>
            </MobileCarouselRow>

            <div
              style={{
                marginTop: "1.75rem",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.9rem",
              }}
            >
              {visibleJobsCount < filteredJobs.length && (
                <button
                  type="button"
                  className="ll-btn-hero-secondary ll-desktop-only-btn"
                  onClick={() => setVisibleJobsCount((n) => n + 6)}
                  style={{ cursor: "pointer" }}
                >
                  Load More Projects ({filteredJobs.length - visibleJobsCount} more)
                </button>
              )}
              <Link href="/pins/" className="ll-btn-hero-primary">
                <span>🗺️ Open Interactive {pins.length}-Pin Satellite Map</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INSTANT ESTIMATE CALCULATOR */}
      <section id="calculator" className="ll-section ll-section-forest">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow ll-eyebrow-dark">Interactive Pricing Tool</span>
            <h2>Calculate Your Instant Yard Estimate</h2>
            <p>
              Select your approximate lot size, check the services you need, and see a transparent ballpark price in seconds.
            </p>
          </div>

          <div className="ll-calc-shell">
            {/* Step 1 */}
            <span className="ll-calc-step-label">Step 1: Approximate Property Size</span>
            <div className="ll-calc-lots">
              {LOT_OPTIONS.map((lot) => (
                <button
                  key={lot.id}
                  type="button"
                  className={`ll-calc-choice ${selectedLot === lot.id ? "active" : ""}`}
                  onClick={() => setSelectedLot(lot.id)}
                >
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: selectedLot === lot.id ? "#86efac" : "#94a3b8" }}>
                    {lot.range}
                  </div>
                  <div style={{ fontSize: "0.98rem", fontWeight: 800, color: "#ffffff", margin: "0.25rem 0 0.15rem" }}>
                    {lot.title}
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#cbd5e1" }}>{lot.sub}</div>
                </button>
              ))}
            </div>

            {/* Step 2 */}
            <span className="ll-calc-step-label">Step 2: Services Needed (Select All That Apply)</span>
            <div className="ll-calc-services">
              {CALC_SERVICES.map((svc) => {
                const checked = selectedServices.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    className={`ll-calc-choice ${checked ? "active" : ""}`}
                    onClick={() => toggleService(svc.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#ffffff", lineHeight: 1.25 }}>
                        <span className="ll-calc-svc-label-mobile">{svc.shortLabel}</span>
                        <span className="ll-calc-svc-label-desktop">{svc.label}</span>
                      </span>
                      <span
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "5px",
                          border: checked ? "2px solid #4ade80" : "2px solid #64748b",
                          background: checked ? "#22c55e" : "transparent",
                          color: "#052e16",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.72rem",
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        {checked ? "✓" : ""}
                      </span>
                    </div>
                    <div className="ll-calc-svc-sub">{svc.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Step 3 */}
            <span className="ll-calc-step-label">Step 3: Preferred Schedule</span>
            <div className="ll-calc-freqs">
              {FREQ_OPTIONS.map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  className={`ll-calc-choice ${selectedFreq === freq.id ? "active" : ""}`}
                  onClick={() => setSelectedFreq(freq.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
                    <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#ffffff" }}>{freq.title}</span>
                    {freq.badge && (
                      <span
                        style={{
                          background: "#22c55e",
                          color: "#052e16",
                          fontSize: "0.66rem",
                          fontWeight: 900,
                          padding: "0.14rem 0.45rem",
                          borderRadius: "6px",
                          textTransform: "uppercase",
                        }}
                      >
                        {freq.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#cbd5e1", marginTop: "0.25rem" }}>{freq.sub}</div>
                </button>
              ))}
            </div>

            {/* Output Banner */}
            <div className="ll-calc-result">
              <div>
                <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Estimated Ballpark Range
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                  <span style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#ffffff", lineHeight: 1.05 }}>
                    {estimateCalc.text}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: 600 }}>{estimateCalc.unit}</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.35rem" }}>
                  *Final exact price confirmed by Luke based on bale count, slope, fence gates, and overgrowth density.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", width: "100%" }}>
                <button
                  type="button"
                  onClick={handleLockEstimate}
                  className="ll-btn-cta-green"
                  style={{ flex: "1 1 210px", padding: "0.9rem 1.15rem", fontSize: "0.92rem" }}
                >
                  Lock In This Estimate →
                </button>
                <a
                  href="tel:6019061281"
                  style={{
                    flex: "1 1 170px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.9rem 1.1rem",
                    borderRadius: "10px",
                    border: "1.5px solid rgba(148,163,184,0.35)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                >
                  Call (601) 906-1281
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES TAILORED FOR MISSISSIPPI PROPERTIES */}
      <section id="services" className="ll-section ll-section-white">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Complete Lawn &amp; Landscape Care</span>
            <h2>Services Built for Central Mississippi Yards</h2>
            <p>
              Whether you want dependable weekly turf striping or a heavy one-time reclamation, Luke handles the entire outdoor checklist with meticulous care.
            </p>
          </div>

          <MobileCarouselRow itemCount={6} ariaLabel="Lawn and landscape services">
            {[
              {
                title: "Residential & Acreage Mowing",
                desc: "Commercial zero-turn turf striping at healthy blade height, string trimming around obstacles, vertical steel-blade concrete edging, and spotless driveway blow-offs.",
                bullets: ["Alternating stripe patterns", "90° sidewalk & curb edging", "Weekly & bi-weekly routes"],
              },
              {
                title: "Rolled Longleaf Pine Straw & Mulch",
                desc: "Our signature service — thorough bed weeding, deep spaded trench borders, thick even coverage, and tightly hand-tucked rolled fronts that stay put in heavy rain.",
                bullets: ["Clean longleaf pine straw delivery", "Dark hardwood & black mulch", "Neatly rolled concrete borders"],
              },
              {
                title: "Flowerbed Makeovers & Planting",
                desc: "Sod stripping for brand-new curved beds, dead shrub root extraction, custom ornamental shrub & privacy tree installation, and seasonal bed resets.",
                bullets: ["New flowerbed design & turf removal", "Shrub & living privacy tree planting", "Root-level weed extraction"],
              },
              {
                title: "Bush, Hedge & Small Tree Trimming",
                desc: "From light seasonal shaping to hard size reductions and overhanging fence-line limb pruning — sculpted level and hauled completely clean.",
                bullets: ["Foundation hedge leveling", "Ornamental bush sculpting", "100% branch & clipping haul-away"],
              },
              {
                title: "Pond Perimeters, Fence Lines & Bush Hogging",
                desc: "Heavy clearing where ordinary lawn crews stop: overgrown pond dams, lakefront banks, vine-choked privacy fences, and bush-hogged rural lots.",
                bullets: ["360° pond & lake shoreline clearing", "Fence-line vine & briar removal", "Bush hogging + finish-cut mowing"],
              },
              {
                title: "Leaf Cleanups, Gutters & Junk Removal",
                desc: "Full-yard fall and spring leaf haul-aways, hand-cleared roof gutters and downspouts, raised-bed excavation, and trailer junk/debris cleanouts.",
                bullets: ["Fall & pre-spring leaf removal", "Gutter & downspout flushing", "Garage, shed & yard junk hauling"],
              },
            ].map((svc) => (
              <div key={svc.title} className="ll-service-card">
                <div className="ll-service-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "1.22rem", fontWeight: 800, marginBottom: "0.55rem" }}>{svc.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#475569" }}>{svc.desc}</p>
                <ul className="ll-service-list">
                  {svc.bullets.map((b) => (
                    <li key={b}>
                      <span style={{ color: "#16a34a", fontWeight: 900 }}>✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </MobileCarouselRow>

          {/* Real Facebook Reels Video Strip */}
          <div
            style={{
              marginTop: "3rem",
              padding: "clamp(1.25rem, 3vw, 2rem)",
              borderRadius: "24px",
              background: "#081c10",
              color: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <span className="ll-eyebrow ll-eyebrow-dark">Watch Luke In Action</span>
                <h3 style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: 900, marginTop: "0.5rem" }}>
                  Recent Transformation Reels on Facebook
                </h3>
              </div>
              <a
                href="https://www.facebook.com/LungrinsLawncare/reels/"
                target="_blank"
                rel="noopener noreferrer"
                className="ll-btn-cta-green"
              >
                Follow @LungrinsLawncare (526+) →
              </a>
            </div>

            <div className="ll-mobile-swipe-hint" style={{ textAlign: "left", margin: "-0.25rem 0 0.75rem" }}>
              ← Swipe all 5 transformation reels →
            </div>

            <div className="ll-reels-grid">
              {FACEBOOK_REELS.map((reel) => (
                <a
                  key={reel.url}
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ll-reel-card"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={reel.img}
                    alt={reel.title}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    width={540}
                    height={720}
                  />
                  <div className="ll-reel-shade" />
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "0.7rem",
                      right: "0.7rem",
                      zIndex: 2,
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(5, 24, 13, 0.78)",
                      border: "1px solid rgba(74, 222, 128, 0.55)",
                      color: "#4ade80",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.78rem",
                      paddingLeft: "2px",
                    }}
                  >
                    ▶
                  </span>
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <span
                      style={{
                        display: "inline-block",
                        background: "rgba(34,197,94,0.28)",
                        color: "#bbf7d0",
                        fontSize: "0.66rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.45rem",
                        borderRadius: "5px",
                        marginBottom: "0.35rem",
                      }}
                    >
                      ▶ {reel.tag}
                    </span>
                    <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.88rem", lineHeight: 1.25 }}>
                      {reel.title}
                    </div>
                    <div style={{ color: "#86efac", fontSize: "0.72rem", fontWeight: 700, marginTop: "0.2rem" }}>
                      {reel.views}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY LUKE + 8-COMMUNITY ROUTE CHECKER */}
      <section id="why-us" className="ll-section ll-section-forest">
        <div className="ll-container">
          <div className="ll-why-split-grid">
            <div style={{ minWidth: 0 }}>
              <span className="ll-eyebrow ll-eyebrow-dark">The Lungrin Difference</span>
              <h2 style={{ fontSize: "clamp(1.85rem, 3.2vw, 2.6rem)", fontWeight: 900, margin: "0.75rem 0 1rem" }}>
                Details Over Speed — Owner on Every Single Job
              </h2>
              <p style={{ marginBottom: "1.25rem" }}>
                Sure, plenty of crews cut grass — fast, rushed, and out the driveway in ten minutes. At Lungrin&apos;s Lawncare, you work directly with owner <strong>Luke Lungrin</strong>, holding every stripe, rolled bed border, and cleanup to a higher standard.
              </p>
              <div className="ll-why-cards-grid">
                {[
                  { t: "Clear Communication", d: "Texts back promptly, shows up when promised, and walks through exactly what will be done." },
                  { t: "No Rushed Sloppy Cuts", d: "Sharp mower blades, crisp 90° edges, and hand-rolled pine straw borders." },
                  { t: "Honest Local Pricing", d: "Premium workmanship priced fairly for local families and acreage owners." },
                  { t: "Spotless Departure", d: "Every porch, driveway, and walkway blown completely clean before pulling off." },
                ].map((item) => (
                  <div
                    key={item.t}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(74,222,128,0.2)",
                      borderRadius: "14px",
                      padding: "1rem",
                    }}
                  >
                    <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "0.92rem", marginBottom: "0.25rem" }}>
                      ✓ {item.t}
                    </div>
                    <div style={{ color: "#cbd5e1", fontSize: "0.8rem", lineHeight: 1.5 }}>{item.d}</div>
                  </div>
                ))}
              </div>
              <div className="ll-mobile-swipe-hint" style={{ textAlign: "left", margin: "0.35rem 0 0" }}>
                ← Swipe all 4 standards →
              </div>
            </div>

            <div
              style={{
                background: "rgba(5, 28, 15, 0.85)",
                border: "1px solid rgba(74, 222, 128, 0.28)",
                borderRadius: "24px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/jobs/fb-2026/branding-fb/2-card.webp"
                srcSet="/images/jobs/fb-2026/branding-fb/2-card.webp 560w, /images/jobs/fb-2026/branding-fb/2.webp 960w"
                sizes="(max-width: 767px) 330px, 440px"
                alt="Lungrin's Lawncare official Flora MS crest — 601-906-1281"
                width={560}
                height={373}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                style={{ width: "100%", height: "auto", borderRadius: "16px", marginBottom: "1.1rem" }}
              />
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff" }}>
                Direct Owner Lines — Call or Text Anytime
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.85rem" }}>
                <a href="tel:6019061281" className="ll-btn-cta-green">
                  📞 (601) 906-1281
                </a>
                <a
                  href="tel:6019061282"
                  style={{
                    padding: "0.68rem 1.1rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(74,222,128,0.4)",
                    color: "#86efac",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                  }}
                >
                  📱 (601) 906-1282
                </a>
              </div>
            </div>
          </div>

          {/* Service Areas & Route Checker */}
          <div id="service-areas" style={{ paddingTop: "2rem", borderTop: "1px solid rgba(74,222,128,0.18)" }}>
            <div className="ll-section-head" style={{ marginBottom: "2rem" }}>
              <span className="ll-eyebrow ll-eyebrow-dark">Central Mississippi Coverage</span>
              <h2>8 Local Communities We Actively Service</h2>
              <p>Based in Flora, MS and running weekly mowing, pine straw, and property cleanup routes across Madison, Hinds, and Yazoo Counties.</p>
            </div>

            <div className="ll-areas-grid">
              {[
                { slug: "flora-ms", town: "Flora, MS", sub: "Home Base • 39071" },
                { slug: "pocahontas-ms", town: "Pocahontas, MS", sub: "Primary Route & Ponds" },
                { slug: "madison-ms", town: "Madison, MS", sub: "Annandale • 39110" },
                { slug: "gluckstadt-ms", town: "Gluckstadt, MS", sub: "Subdivisions & Beds" },
                { slug: "ridgeland-ms", town: "Ridgeland, MS", sub: "Estates • 39157" },
                { slug: "jackson-ms", town: "Jackson, MS", sub: "North Jackson Routes" },
                { slug: "bentonia-ms", town: "Bentonia, MS", sub: "Acreage & Clearing • 39040" },
                { slug: "yazoo-county-ms", town: "Yazoo County", sub: "Bee Lake & Rural" },
              ].map((a) => (
                <Link key={a.slug} href={`/service-areas/${a.slug}/`} className="ll-area-tile">
                  <div style={{ color: "#4ade80", fontSize: "0.82rem", fontWeight: 800 }}>📍 Active Route →</div>
                  <div style={{ color: "#ffffff", fontWeight: 900, fontSize: "1.02rem", marginTop: "0.2rem" }}>
                    {a.town}
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "0.75rem", marginTop: "0.15rem" }}>{a.sub}</div>
                </Link>
              ))}
            </div>
            <div className="ll-mobile-swipe-hint">← Swipe all 8 active route communities →</div>

            <form
              onSubmit={checkServiceArea}
              style={{
                maxWidth: "580px",
                margin: "0 auto",
                background: "rgba(5, 24, 13, 0.9)",
                border: "1px solid rgba(74, 222, 128, 0.3)",
                borderRadius: "18px",
                padding: "1.25rem",
              }}
            >
              <label
                htmlFor="route-check-input"
                style={{ display: "block", textAlign: "center", fontWeight: 800, fontSize: "0.88rem", color: "#86efac", marginBottom: "0.65rem" }}
              >
                Check If Your Town, Subdivision, or Zip Code Is on Luke&apos;s Route
              </label>
              <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
                <input
                  id="route-check-input"
                  type="text"
                  value={areaQuery}
                  onChange={(e) => setAreaQuery(e.target.value)}
                  placeholder="Town, neighborhood, or zip (e.g. Flora, 39110)"
                  style={{
                    flex: "1 1 210px",
                    minWidth: 0,
                    padding: "0.78rem 0.9rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(148,163,184,0.35)",
                    background: "#091b10",
                    color: "#ffffff",
                    fontSize: "0.86rem",
                  }}
                />
                <button type="submit" className="ll-btn-cta-green">
                  Check Route
                </button>
              </div>
              {areaResult && (
                <div
                  style={{
                    marginTop: "0.8rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    background: areaResult.matched ? "rgba(22,163,74,0.22)" : "rgba(255,255,255,0.06)",
                    border: areaResult.matched ? "1px solid #4ade80" : "1px solid rgba(148,163,184,0.3)",
                    color: "#f8fafc",
                    fontSize: "0.84rem",
                    textAlign: "center",
                  }}
                >
                  {areaResult.matched ? (
                    <>
                      <strong>✓ Yes!</strong> Luke runs active lawn &amp; landscaping routes in{" "}
                      <strong>{areaResult.label}</strong>.{" "}
                      <a href="tel:6019061281" style={{ color: "#4ade80", fontWeight: 800, textDecoration: "underline" }}>
                        Call (601) 906-1281
                      </a>{" "}
                      to grab a spot!
                    </>
                  ) : (
                    <>
                      Luke frequently takes on pine straw, cleanup, and acreage projects near{" "}
                      <strong>{areaResult.label}</strong>.{" "}
                      <a href="tel:6019061281" style={{ color: "#4ade80", fontWeight: 800, textDecoration: "underline" }}>
                        Call or text (601) 906-1281
                      </a>{" "}
                      to confirm availability!
                    </>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* 7. DUAL-PLATFORM VERIFIED REVIEWS WALL (GOOGLE 5.0★ + FACEBOOK 100% RECOMMEND) */}
      <section id="reviews" className="ll-section ll-section-white">
        <div className="ll-container">
          <div className="ll-section-head">
            <span className="ll-eyebrow">Verified Local Reputation</span>
            <h2>{totalVerifiedReviews} Five-Star &amp; 100%-Recommend Reviews</h2>
            <p>
              Real feedback from neighbors across Flora, Madison, Pocahontas, and Jackson on both Google Business Profile and Facebook.
            </p>
          </div>

          {/* Dual Score Banner */}
          <div className="ll-reviews-score-grid">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 0.8rem",
                borderRadius: "16px",
                background: "#f8faf8",
                border: "1px solid #dce8df",
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: "clamp(1.38rem, 3vw, 2rem)", fontWeight: 900, color: "#0f172a", flexShrink: 0 }}>
                {googleStats.rating.toFixed(1)}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#eab308", fontSize: "0.82rem", letterSpacing: "0.03em" }}>★★★★★</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#475569", lineHeight: 1.2 }}>
                  {googleStats.count} Google Reviews
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 0.8rem",
                borderRadius: "16px",
                background: "#f0f7ff",
                border: "1px solid #bfdbfe",
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: "clamp(1.32rem, 3vw, 2rem)", fontWeight: 900, color: "#1d4ed8", flexShrink: 0 }}>
                100%
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#1d4ed8", fontSize: "0.74rem", fontWeight: 800, lineHeight: 1.2 }}>👍 Facebook</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#475569", lineHeight: 1.2 }}>
                  {reviewsData.summary.facebookReviewCount} of {reviewsData.summary.facebookReviewCount} Recommend
                </div>
              </div>
            </div>
          </div>

          {/* Platform Filter Tabs */}
          <div className="ll-filter-pills">
            <button
              type="button"
              className={`ll-ba-tab ${reviewFilter === "all" ? "active" : ""}`}
              onClick={() => setReviewFilter("all")}
            >
              All Highlighted Reviews ({staticReviews.length})
            </button>
            <button
              type="button"
              className={`ll-ba-tab ${reviewFilter === "facebook" ? "active" : ""}`}
              onClick={() => setReviewFilter("facebook")}
            >
              Facebook Recommendations (14)
            </button>
            <button
              type="button"
              className={`ll-ba-tab ${reviewFilter === "google" ? "active" : ""}`}
              onClick={() => setReviewFilter("google")}
            >
              Google 5.0★ Highlights
            </button>
          </div>

          <MobileCarouselRow
            itemCount={filteredReviews.length}
            resetKey={reviewFilter}
            ariaLabel="Verified customer reviews"
          >
            {filteredReviews.map((rev, idx) => (
              <article
                key={rev.id}
                className={`ll-review-card ${idx >= 6 && !showAllReviews ? "ll-review-extra-desktop" : ""}`}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
                    <span style={{ color: "#eab308", fontSize: "0.92rem", letterSpacing: "0.04em" }}>★★★★★</span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        padding: "0.18rem 0.55rem",
                        borderRadius: "999px",
                        background: rev.source === "facebook" ? "#eff6ff" : "#ecfdf5",
                        color: rev.source === "facebook" ? "#1d4ed8" : "#166534",
                      }}
                    >
                      {rev.source === "facebook" ? "Facebook Recommends" : "Verified Google"}
                    </span>
                  </div>
                  <p className="ll-review-quote">&ldquo;{rev.text}&rdquo;</p>
                  {rev.ownerReply && (
                    <div className="ll-review-reply" style={{ marginTop: "0.75rem" }}>
                      <strong>Lungrin&apos;s Lawncare:</strong> {rev.ownerReply}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    paddingTop: "0.85rem",
                    borderTop: "1px solid #e2ece4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#15803d",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: "0.84rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#0f172a" }}>{rev.author}</div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>{rev.serviceTag}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>{rev.date}</span>
                </div>
              </article>
            ))}
          </MobileCarouselRow>

          <div
            style={{
              marginTop: "1.85rem",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.85rem",
            }}
          >
            {!showAllReviews && filteredReviews.length > 6 && (
              <button
                type="button"
                className="ll-btn-hero-secondary ll-desktop-only-btn"
                style={{ cursor: "pointer" }}
                onClick={() => setShowAllReviews(true)}
              >
                Read All {filteredReviews.length} Customer Reviews
              </button>
            )}
            <a
              href={reviewsData.summary.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ll-btn-cta-green"
            >
              ★ Leave a Google Review
            </a>
            <a
              href={reviewsData.summary.facebookReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ll-btn-hero-secondary"
            >
              👍 View All 14 Facebook Reviews
            </a>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="ll-section ll-section-tint">
        <div className="ll-container" style={{ maxWidth: "880px" }}>
          <div className="ll-section-head">
            <span className="ll-eyebrow">Common Questions</span>
            <h2>Frequently Asked Questions</h2>
            <p>Straight answers on scheduling, estimates, pine straw, and property cleanups.</p>
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {FAQ_ITEMS.map((item, idx) => {
              const open = openFaqIdx === idx;
              return (
                <div key={item.q} className="ll-faq-item">
                  <button
                    type="button"
                    className="ll-faq-btn"
                    aria-expanded={open}
                    onClick={() => setOpenFaqIdx(open ? null : idx)}
                  >
                    <span>{item.q}</span>
                    <span style={{ color: "#15803d", fontWeight: 900, fontSize: "1.2rem" }}>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open && <div className="ll-faq-answer">{item.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CONTACT & FREE ESTIMATE FORM */}
      <section id="contact" className="ll-section ll-section-white">
        <div className="ll-container">
          <div className="ll-contact-grid">
            {/* Direct Contact Cards */}
            <div style={{ minWidth: 0 }}>
              <span className="ll-eyebrow">Fast Free Estimates</span>
              <h2 style={{ fontSize: "clamp(1.85rem, 3vw, 2.5rem)", fontWeight: 900, margin: "0.75rem 0 0.85rem" }}>
                Ready for the Best-Looking Yard on Your Street?
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Send your estimate request right here or call/text Luke directly. Most inquiries get a same-day response.
              </p>

              <div style={{ display: "grid", gap: "0.75rem", minWidth: 0 }}>
                <a href="tel:6019061281" className="ll-contact-card-link">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#16a34a",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    📞
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                      Primary Mobile Line (Call or Text)
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#0f172a" }}>(601) 906-1281</div>
                  </div>
                </a>

                <a href="tel:6019061282" className="ll-contact-card-link">
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#14532d",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    📱
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                      Secondary Phone Line
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#0f172a" }}>(601) 906-1282</div>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/LungrinsLawncare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ll-contact-card-link"
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#1877f2",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    f
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                      Official Facebook Page &amp; Messenger
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "#0f172a", overflowWrap: "anywhere" }}>
                      facebook.com/LungrinsLawncare
                    </div>
                  </div>
                </a>
              </div>

              <div
                style={{
                  marginTop: "1.25rem",
                  padding: "0.95rem 1.1rem",
                  borderRadius: "14px",
                  background: "#fefce8",
                  border: "1px solid #fde047",
                  fontSize: "0.82rem",
                  color: "#713f12",
                  fontWeight: 600,
                }}
              >
                <strong>Hours:</strong> Monday – Saturday, 7:00 AM – 6:30 PM. Evening messages are returned first thing next morning.
              </div>
            </div>

            {/* Right Quote Form */}
            <div className="ll-form-box" style={{ minWidth: 0 }}>
              {submittedSmsUrl ? (
                <div style={{ textAlign: "center", padding: "2rem 0.5rem" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "#dcfce7",
                      color: "#15803d",
                      fontSize: "1.8rem",
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem",
                    }}
                  >
                    ✓
                  </div>
                  <h3 style={{ fontSize: "1.55rem", fontWeight: 900, marginBottom: "0.5rem" }}>
                    Estimate Request Logged!
                  </h3>
                  <p style={{ fontSize: "0.92rem", color: "#475569", maxWidth: "460px", margin: "0 auto 1.4rem" }}>
                    Your project details have been saved. For the fastest response while Luke is out on routes, tap below to send it straight to his phone via text or Messenger:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
                    <a href={submittedSmsUrl} className="ll-btn-cta-green" style={{ padding: "0.9rem 1.4rem" }}>
                      💬 Send Instant Text to Luke
                    </a>
                    <a
                      href="https://www.facebook.com/messages/t/LungrinsLawncare/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ll-btn-hero-secondary"
                    >
                      Message on Facebook
                    </a>
                    <button
                      type="button"
                      className="ll-btn-phone-outline"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSubmittedSmsUrl(null);
                        setFormName("");
                        setFormPhone("");
                        setFormAddress("");
                        setFormNotes("");
                      }}
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit}>
                  <h3 style={{ fontSize: "1.45rem", fontWeight: 900, marginBottom: "0.25rem" }}>
                    Request Your Free Estimate
                  </h3>
                  <p style={{ fontSize: "0.84rem", color: "#64748b", marginBottom: "1.35rem" }}>
                    Zero obligation — tell Luke what you need and lock in your spot on the schedule.
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label htmlFor="ll-name" className="ll-label">Your Name *</label>
                      <input
                        id="ll-name"
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="ll-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="ll-phone" className="ll-label">Phone Number *</label>
                      <input
                        id="ll-phone"
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="e.g. (601) 555-0192"
                        className="ll-input"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label htmlFor="ll-address" className="ll-label">Property Address or Town *</label>
                      <input
                        id="ll-address"
                        type="text"
                        required
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        placeholder="e.g. Flora, Madison, Gluckstadt..."
                        className="ll-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="ll-service" className="ll-label">Primary Service Needed</label>
                      <select
                        id="ll-service"
                        value={formService}
                        onChange={(e) => setFormService(e.target.value)}
                        className="ll-select"
                      >
                        <option value="Regular Lawn Mowing & Edging">Regular Lawn Mowing &amp; Edging</option>
                        <option value="Pine Straw & Mulch Installation">Rolled Pine Straw &amp; Mulch Installation</option>
                        <option value="Flowerbed Cleanup & Planting">Flowerbed Cleanup &amp; Planting</option>
                        <option value="Bush & Hedge Trimming">Bush, Hedge &amp; Tree Trimming</option>
                        <option value="Leaf Removal & Seasonal Cleanup">Leaf Removal &amp; Seasonal Cleanup</option>
                        <option value="Pond Bank / Fence Line / Bush Hogging">Pond Bank / Fence Line / Bush Hogging</option>
                        <option value="Gutter Cleaning & Flushing">Gutter Cleaning &amp; Flushing</option>
                        <option value="Junk & Yard Debris Removal">Junk &amp; Yard Debris Removal</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label htmlFor="ll-notes" className="ll-label">Project Details / Estimate Notes</label>
                    <textarea
                      id="ll-notes"
                      rows={4}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Tell Luke about gate access, pine straw beds, overgrowth, weekly vs. one-time..."
                      className="ll-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="ll-btn-cta-green"
                    style={{ width: "100%", padding: "0.95rem 1rem", fontSize: "clamp(0.86rem, 3.6vw, 1rem)" }}
                  >
                    {submitting ? "Sending Request..." : "Submit Free Estimate Request →"}
                  </button>

                  <div style={{ textAlign: "center", fontSize: "0.74rem", color: "#64748b", marginTop: "0.7rem" }}>
                    🔒 Respectful local service — never shared or spammed.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {lightbox && (
        <div
          className="ll-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
        >
          <div
            style={{
              maxWidth: "1040px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.85rem",
              color: "#ffffff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem" }}>{lightbox.title}</div>
              <div style={{ fontSize: "0.78rem", color: "#86efac" }}>
                {lightbox.location} • Photo {lightbox.index + 1} of {lightbox.images.length}
              </div>
            </div>
            <button
              type="button"
              aria-label="Close photo viewer"
              onClick={() => setLightbox(null)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.14)",
                border: "none",
                color: "#ffffff",
                fontSize: "1.2rem",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.images[lightbox.index]}
            alt={`${lightbox.title} — photo ${lightbox.index + 1}`}
            width={1400}
            height={1050}
            className="ll-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          {lightbox.images.length > 1 && (
            <div
              style={{ display: "flex", gap: "0.85rem", marginTop: "1rem" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="ll-btn-cta-green"
                onClick={() =>
                  setLightbox((prev) =>
                    prev
                      ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }
                      : null
                  )
                }
              >
                ← Prev Photo
              </button>
              <button
                type="button"
                className="ll-btn-cta-green"
                onClick={() =>
                  setLightbox((prev) =>
                    prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null
                  )
                }
              >
                Next Photo →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
