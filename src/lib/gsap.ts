"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* Register once, import from here everywhere: `import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"` */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/* House easing — matches --ease-expo / --ease-io in globals.css */
export const EASE_EXPO = "expo.out";
export const EASE_IO = "power3.inOut";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export { gsap, ScrollTrigger, useGSAP };
