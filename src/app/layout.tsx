import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CursorTrail } from "@/components/ui/CursorTrail";
import { site } from "@/content/site";
import "./globals.css";

/* Display — geometric, echoes the logo wordmark */
const outfit = localFont({
  src: "../../public/fonts/outfit/Outfit.woff2",
  variable: "--font-outfit",
  weight: "100 900",
  display: "swap",
});

/* Body */
const dmSans = localFont({
  src: "../../public/fonts/dm-sans/DM-Sans.woff2",
  variable: "--font-dm-sans",
  weight: "100 1000",
  display: "swap",
});

/* Accent — test face, Megan Cloudy */
const remboy = localFont({
  src: "../../public/fonts/MeganCloudyPersonalUseOnly.ttf",
  variable: "--font-remboy",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
});

/* Labels */
const dmMono = localFont({
  src: [
    { path: "../../public/fonts/dm-mono/DM-Mono-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/dm-mono/DM-Mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-dm-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Invenzee | All-in-one digital agency",
    template: "%s | Invenzee",
  },
  description: site.description,
  openGraph: {
    title: "Invenzee | All-in-one digital agency",
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07081c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} ${remboy.variable} ${dmMono.variable} antialiased`}
    >
      <body className="theme-dark min-h-dvh">
        <SmoothScroll>{children}</SmoothScroll>
        <CursorTrail />
      </body>
    </html>
  );
}
