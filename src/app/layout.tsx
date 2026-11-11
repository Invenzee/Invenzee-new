import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DM_Mono, DM_Sans, Outfit } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";

/* Display — geometric, echoes the logo wordmark */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

/* Body */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
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
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
      </body>
    </html>
  );
}
