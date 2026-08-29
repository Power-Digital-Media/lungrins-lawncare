import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Details | PinDrop Portal",
  description: "View detailed project photos and information.",
  alternates: {
    canonical: "/pin-page/"
  }
};

export default function PinPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
