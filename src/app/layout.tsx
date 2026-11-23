import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import "./lungrins.css";
import DynamicBrandStyles from "@/components/DynamicBrandStyles";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lungrinslawncare.com"),
  title: {
    template: "%s | Lungrin's Lawncare",
    default: "Lungrin's Lawncare | Lawn Care & Pine Straw in Flora, MS",
  },
  description:
    "Owner-operated lawn mowing, rolled pine straw, flowerbed cleanups, hedge trimming & clearing in Flora, Madison & Central MS. Call Luke: (601) 906-1281.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://lungrinslawncare.com/",
    siteName: "Lungrin's Lawncare",
    title: "Lungrin's Lawncare | Lawn Care & Pine Straw in Flora, MS",
    description:
      "Meticulous mowing, rolled longleaf pine straw, flowerbed cleanups, bush trimming & property clearing across Flora, Madison & Central MS.",
    images: [
      {
        url: "/images/branding/og-lungrins-2026.jpg",
        width: 1200,
        height: 630,
        alt: "Lungrin's Lawncare — Striped lawns and rolled pine straw in Central Mississippi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lungrin's Lawncare | Lawn Care & Pine Straw in Flora, MS",
    description:
      "Owner-operated lawn mowing, rolled pine straw, flowerbed cleanups & property clearing in Flora, Madison & Central MS. Call (601) 906-1281.",
    images: ["/images/branding/og-lungrins-2026.jpg"],
  },
  icons: {
    icon: "/images/logos/lungrins-icon.svg",
    apple: "/images/logos/favicon.jpg",
  },
  verification: {
    google: "nngIaO9iu7ZwZ5Ly8i3QX8fDtLPi2difMR4RugmEm_I",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const GTM_ID = "GTM-T5FWSFSW";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geist.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="ard" href="/.well-known/ard.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
              window.trackLungrinEvent = function(eventName, params) {
                var payload = Object.assign({ page_path: window.location.pathname }, params || {});
                if (typeof window.gtag === 'function') {
                  window.gtag('event', eventName, payload);
                }
                window.dataLayer.push(Object.assign({ event: eventName }, payload));
              };
              (function() {
                if (window.location.pathname.indexOf('/admin') === 0) return;
                var loaded = false;
                function loadGtm() {
                  if (loaded) return;
                  loaded = true;
                  var s = document.createElement('script');
                  s.async = true;
                  s.src = 'https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';
                  document.head.appendChild(s);
                }
                ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'].forEach(function(ev) {
                  window.addEventListener(ev, loadGtm, { once: true, passive: true });
                });
                window.addEventListener('load', function() {
                  setTimeout(loadGtm, 6500);
                });
              })();
            `,
          }}
        />
        <DynamicBrandStyles />
      </head>
      <body
        style={{
          fontFamily: "var(--font-plus-jakarta), var(--font-geist), sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AnalyticsTracker />
        <SiteHeader />
        <main style={{ minHeight: "70vh", display: "flex", flexDirection: "column" }}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
