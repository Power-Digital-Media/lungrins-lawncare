import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Local Project Pins Map | Lungrin's Lawncare",
  },
  description:
    "Explore 32 verified lawn care, pine straw, flowerbed, fence clearing, and pond cleanup job pins by Luke Lungrin across Flora, Madison & Central MS.",
  alternates: {
    canonical: "/pins/",
  },
};

export default function PinsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
