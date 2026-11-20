import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { PageReady } from "@/components/sections/about-page/PageReady";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: contact.pageIntro,
};

export default function ContactRoute() {
  return (
    <>
      <PageReady />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-cyan focus:px-5 focus:py-3 focus:text-navy"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Contact standalone />
      </main>
      <Footer />
    </>
  );
}
