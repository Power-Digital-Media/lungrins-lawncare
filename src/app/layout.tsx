import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import DynamicBrandStyles from "@/components/DynamicBrandStyles";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Lungrin's Lawncare",
    default: "Lungrin's Lawncare | Flora & Pocahontas, MS"
  },
  description: "Professional lawn care by Luke Lungrin — mowing, edging, pine straw, gutter cleaning, and total property maintenance in Flora, Pocahontas, and surrounding MS areas.",
  icons: {
    icon: "/images/logos/lungrins-icon.svg",
    apple: "/images/logos/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geist.variable}`}>
      <head>
        <DynamicBrandStyles />
      </head>
      <body style={{ fontFamily: "var(--font-geist), sans-serif", margin: 0, padding: 0, background: "var(--bg, #0b0c10)", color: "var(--text, #ffffff)" }}>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
