"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;

/** The active Lenis instance, or null (reduced motion / not mounted yet). */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/** Lock or unlock page scrolling (used by the preloader and the mobile menu). */
export function setScrollLocked(locked: boolean) {
  document.documentElement.classList.toggle("is-loading", locked);
  if (locked) lenisInstance?.stop();
  else lenisInstance?.start();
}

/** Scroll to a selector or position, smoothly when Lenis is active. */
export function scrollToTarget(target: string | number, offset = 0) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target });
    return;
  }
  document.querySelector(target)?.scrollIntoView();
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -88 },
      autoRaf: false,
    });
    lenisInstance = lenis;
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
