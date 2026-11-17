import type { Metadata } from "next";
import { AboutPage } from "@/components/sections/about-page/AboutPage";
import { PageReady } from "@/components/sections/about-page/PageReady";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { about } from "@/content/site";

export const metadata: Metadata = {
  title: "About us",
  description: about.lead,
};

export default function AboutRoute() {
  return (
    <>
      <PageReady />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:mark focus:bg-cyan focus:px-5 focus:py-3 focus:font-display focus:font-semibold focus:text-navy"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <AboutPage />
      </main>
      <Footer />
    </>
  );
}
