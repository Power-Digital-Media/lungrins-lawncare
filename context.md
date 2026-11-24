# Lungrin's Lawncare — Project Context, Infrastructure & Handoff Checklist

This document is the persistent single source of truth for **Lungrin's Lawncare** (`https://lungrinslawncare.com`). Read this file first whenever resuming work on this repository so all business details, infrastructure IDs, analytics mappings, and remaining launch tasks stay 100% aligned.

---

## 1. Verified Business & NAP Identity

- **Business Name:** Lungrin's Lawncare *(alternate: Luke Lungrin's Lawn Care Services)*
- **Owner / Operator:** Luke Lungrin (owner on-site on every job)
- **Home Base:** Flora, MS 39071 (Madison County)
- **Primary Phone / SMS:** `(601) 906-1281`
- **Secondary Phone:** `(601) 906-1282`
- **8 Active Route Communities (`/service-areas/[slug]/`):**
  1. Flora, MS (`39071`) — `/service-areas/flora-ms/`
  2. Pocahontas, MS (`39072`) — `/service-areas/pocahontas-ms/`
  3. Madison, MS (`39110`, incl. Annandale & Reunion) — `/service-areas/madison-ms/`
  4. Gluckstadt, MS (`39110`) — `/service-areas/gluckstadt-ms/`
  5. Ridgeland, MS (`39157`) — `/service-areas/ridgeland-ms/`
  6. Jackson, MS (`39206`, `39211`, `39213` North Jackson) — `/service-areas/jackson-ms/`
  7. Bentonia, MS (`39040`) — `/service-areas/bentonia-ms/`
  8. Yazoo County & Bee Lake, MS (`39040`, `39194`) — `/service-areas/yazoo-county-ms/`
- **Facebook Page:** `https://www.facebook.com/profile.php?id=100083356506669`
- **Core Services:** Residential & acreage mowing/striping, hand-rolled longleaf pine straw & mulch, fall & winter leaf removal, flowerbed weeding & reclamation, shrub & privacy tree planting, bush/hedge shaping, pond-bank & fence-line clearing / bush hogging, and trailer junk/brush haul-away *(Note: Gutter cleaning removed — Luke does not offer gutter cleaning).*

---

## 2. Infrastructure, Hosting, DNS & Analytics IDs

- **Local Workspace:** `E:\AntiGravity\lungrins-lawncare`
- **GitHub Repo:** `https://github.com/Power-Digital-Media/lungrins-lawncare.git` (branch: `master`)
- **Production URL:** `https://lungrinslawncare.com` (`www.lungrinslawncare.com` 301-redirects to apex; `trailingSlash: true`)
- **Netlify Site:**
  - **Site Name:** `lungrinslawncare` (`power-digital-media` team)
  - **Site ID:** `371b3166-5c20-4132-92bb-56298387a174`
  - **Netlify DNS Zone ID:** `6a9254f7d8a90102b5b326dc`
  - **Assigned Netlify Nameservers (Active on Registrar / `8.8.8.8` / `1.1.1.1`):**
    - `dns1.p02.nsone.net`
    - `dns2.p02.nsone.net`
    - `dns3.p02.nsone.net`
    - `dns4.p02.nsone.net`
  - **Current Netlify Env Vars Set:** `GOOGLE_PLACES_API_KEY`, `LUNGRINS_GOOGLE_PLACE_ID`
- **Google Search Console:**
  - **Verification Token (Live in both Netlify DNS `TXT` & HTML `<meta>`):** `google-site-verification=nngIaO9iu7ZwZ5Ly8i3QX8fDtLPi2difMR4RugmEm_I`
  - **Sitemap URL:** `https://lungrinslawncare.com/sitemap.xml` (12 indexable static URLs)
- **Google Analytics 4 & Google Tag:**
  - **Account ID:** `252687316`
  - **GA4 Property Name & Numeric ID:** `Lungrin's Lawncare` — **`565570733`**
  - **Web Stream ID:** `16399462928`
  - **Measurement ID:** **`G-6C0PTHBTTY`**
  - **Google Tag Container ID:** **`GTM-T5FWSFSW`**
  - **5 Active GA4 Key Events (Conversions):**
    1. `click_to_call` (`tel:` clicks via `src/components/AnalyticsTracker.tsx`)
    2. `click_to_text` (`sms:` clicks via `src/components/AnalyticsTracker.tsx`)
    3. `lock_estimate` (calculator lock-in via `src/components/HomeClient.tsx`)
    4. `form_submit` (AJAX quote form submit via `HomeClient.tsx` & `ContactForm.tsx`)
    5. `generate_lead` (qualified quote inquiry via `HomeClient.tsx` & `ContactForm.tsx`)
  - **5 Active GA4 Event-Scoped Custom Dimensions:**
    1. `Service Requested` (`service_requested`)
    2. `Property Location` (`property_location`)
    3. `Estimate Range` (`estimate_range`)
    4. `Lot Size` (`lot_size`)
    5. `Service Frequency` (`frequency`)
- **PDM PinDrop™ & PDM Site Intelligence™:**
  - **PinDrop Firestore Project:** `pdm-pindrop-central` (`collection: "pins"`, `clientId: "lungrins-lawncare"`, `32/32` real GPS pins seeded)
  - **PDM Site Intelligence Website ID:** `site_lungrins_lawncare` (`org_pdm_default` in `E:\AntiGravity\pdm-site-intelligence`)

---

## 3. Verified Live PDM Site Intelligence Baseline (Nov 23, 2026)

- **Watchtower Technical Health:** **`100 / 100`** (`40/40` Availability, `20/20` SSL, `15/15` Latency `21ms` TTFB, `15/15` Links across `33` crawled pages with `0` broken links/forms, `10/10` Hygiene with `0` missing meta & `0` open issues)
- **Google Lighthouse Desktop (13.6):** **`100`** Performance • **`100`** Accessibility • **`100`** Best Practices • **`100`** SEO • **`4/4`** Agentic Browsing
- **Google Lighthouse Mobile (13.6):** **`91`** Performance • **`100`** Accessibility • **`100`** Best Practices • **`100`** SEO • **`4/4`** Agentic Browsing
- **6-Pillar Stage 1 Unified Audit:** **`97 / 100` Overall** (`100` SEO, `100` GEO/AEO with `/llms.txt` + `/llms-full.txt` + `/.well-known/ard.json`, `100` Schema across `43` valid entities, `93` Local Signals, `90` Conversion)

---

## 4. Remaining Handoff & Next-Session Checklist

### [ ] 1. Wire Netlify Environment Variables for Lead Form → CRM & Email Delivery
Right now Netlify production only has `GOOGLE_PLACES_API_KEY` and `LUNGRINS_GOOGLE_PLACE_ID`. Submitting the quote form shows the customer the instant SMS button to text Luke, **but** `src/app/api/forms/route.ts` skips background CRM/email sync until these env vars are added on Netlify (`371b3166-5c20-4132-92bb-56298387a174`):
- `PDM_CLIENT_ID=lungrins-lawncare`
- `NEXT_PUBLIC_PDM_CLIENT_ID=lungrins-lawncare`
- `FIREBASE_PROJECT_ID=pdm-pindrop-central`
- `TRANSPOND_API_KEY` + `TRANSPOND_GROUP_ID` *(for Luke's Capsule CRM + Transpond two-way sync)*
- `FORMSPREE_FORM_ID` *(optional direct email backup to Luke)*

### [ ] 2. Calibrate Instant Yard Estimate Calculator (`src/components/HomeClient.tsx`)
Update `LOT_OPTIONS`, `CALC_SERVICES`, `FREQ_OPTIONS`, and `estimateCalc` in `src/components/HomeClient.tsx` (`L96–L181` & `L408–L431`) once Luke replies to these 6 pricing questions:
1. **Minimum Trip Charge:** Smallest dollar amount he rolls the truck/trailer out for.
2. **Weekly Mowing Rates by Lot Size:** Under 1/4 acre (currently `$40–$55`), 1/4–1/2 acre (`$55–$75`), 1/2–1 acre (`$75–$110`), 1–2+ acres (`$110–$185` or per-acre rate).
3. **Bi-Weekly & Overgrown / One-Time Multipliers:** Bi-weekly upcharge (currently `+15%`) and one-time / tall first-cut upcharge (currently `+30%`).
4. **Pine Straw & Mulch:** Installed price **per bale** + minimum bale count (consider adding an optional bale-count selector when Pine Straw is checked so 20–30 bale jobs don't under-quote at `$70–$135`), plus mulch per-bag/per-yard installed rate.
5. **Project Add-On Ranges:** Confirm/adjust starting ranges for flowerbed weeding (`$55–$110`), shrub & privacy tree planting (`$75–$160`), bush trimming (`$40–$80`), fall & winter leaf cleanup (`$50–$95`), pond/fence clearing & bush hogging (`$65–$130`), and trailer junk/brush haul-away (`$60–$120`).
6. **Out-of-Area Travel Minimums:** Any higher minimum for Jackson, Ridgeland, Madison, or Bee Lake vs. Flora/Pocahontas.

### [ ] 3. Provision Luke's PinDrop™ Field Login (`/admin/drop-pin/`)
- Create Luke's user credentials for `/admin/drop-pin/` (`pdm-pindrop-central`) and ensure upload/auth env vars are present on Netlify so he can snap and publish new GPS job pins from his phone.

### [x] 4. Search Console, Site Intelligence & Social Profile Links (GSC & SI 100% Connected!)
- **Google Search Console (`sc-domain:lungrinslawncare.com`):** ✅ Verified (`siteOwner` via Netlify DNS `TXT`) and `https://lungrinslawncare.com/sitemap.xml` submitted (`Status: Success`, `12` discovered pages).
- **PDM Site Intelligence (`site_lungrins_lawncare`):** ✅ `overallStatus: "connected"` — bound to GSC **`sc-domain:lungrinslawncare.com`** (`siteOwner`) + 4-way verified GA4 Property **`565570733`** (`G-6C0PTHBTTY` / `GTM-T5FWSFSW`), `7d/28d/90d` sync active (`lastSyncStatus: "ok"`, `0` open issues).
- **Google Business Profile & Facebook Page:** Set `https://lungrinslawncare.com/` as the official website URL on both profiles.
- **Optional Later — Meta Pixel:** Add Meta Pixel ID when running paid Facebook Reels / Lead Ads (lifts Stage 1 Conversion score from `90` → `100/100`).

---

## 5. Key Architectural & UX Decisions Log

- **2026-11-23:**
  - Redesigned mobile first-fold Hero (`32px` topbar, `60px` header, 4-photo real-property switcher, zero stock photos) and converted all stacked mobile card grids (`#gallery`, `#services`, Reels, `#why-us`, `#service-areas`, `#reviews`, `/pins/`) into single-layer touch-snap carousels.
  - Added continuous verified Google + Facebook reviews marquee in `.ll-stats-strip`.
  - Fixed all 5 Facebook Reel cards to use exact matching downloaded & letterbox-cleaned video frames (`public/images/jobs/fb-2026/reels/reel-*-clean.webp`).
  - Set **Madison Shrub & Pine Straw** (`oct22-madison-shrub-pinestraw/1.webp` → `2.webp`) as default Before/After #1 and configured all 5 Before/After sliders to start at `8%` on **Before** and wipe left-to-right **Before → After**.
  - Built 8 SSG local community hub pages (`src/data/serviceAreas.ts` & `src/app/service-areas/[slug]/page.tsx`) and generated `46.7 KB` responsive `640w` hero WebPs + `161` `-card.webp` (`560w`) card thumbnails.
  - Replaced Next.js's default Vercel triangle `src/app/favicon.ico` with Luke's official crest logo across `/favicon.ico`, `/icon-192.png`, `/icon-512.png`, `/apple-touch-icon.png`, and `1200×630` `/images/branding/og-lungrins-crest-v2.jpg`.
  - Configured Netlify DNS (`dns1..4.p02.nsone.net`), GSC `TXT` + HTML verification, and GA4 (`565570733` / `G-6C0PTHBTTY` / `GTM-T5FWSFSW`) with 5 Key Events and 5 Custom Dimensions.
