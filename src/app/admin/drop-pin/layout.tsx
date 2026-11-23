import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Field Crew PinDrop Portal | Lungrin's Lawncare",
  },
  description:
    "Authorized field crew portal for Lungrin's Lawncare to log verified GPS job pins and before-and-after project photos.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DropPinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
