import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Verified Field Job Details | Lungrin's Lawncare",
  },
  description:
    "Inspect full-resolution before-and-after job photos, project details, and service location data from Luke Lungrin's verified Central MS field work.",
  alternates: {
    canonical: "/pin-page/",
  },
};

export default function PinPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
