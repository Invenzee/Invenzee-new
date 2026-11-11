import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { Nav } from "@/components/sections/Nav";
import { Preloader } from "@/components/sections/Preloader";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Showcase } from "@/components/sections/Showcase";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:mark focus:bg-cyan focus:px-5 focus:py-3 focus:font-display focus:font-semibold focus:text-navy"
      >
        Skip to content
      </a>
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Showcase />
        <Process />
        <MarqueeBand />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
