"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    trackLungrinEvent?: (eventName: string, params?: Record<string, unknown>) => void;
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname() || "/";
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname.startsWith("/admin")) return;
    if (lastTrackedPathRef.current === pathname) return;
    lastTrackedPathRef.current = pathname;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "virtual_page_view",
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    const handleClick = (event: MouseEvent) => {
      if (window.location.pathname.startsWith("/admin")) return;
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href^="tel:"], a[href^="sms:"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const eventName = href.startsWith("tel:") ? "click_to_call" : "click_to_text";
      const payload = {
        page_path: window.location.pathname || "/",
        link_url: href,
      };

      if (typeof window.trackLungrinEvent === "function") {
        window.trackLungrinEvent(eventName, payload);
      } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, ...payload });
      }
    };

    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
