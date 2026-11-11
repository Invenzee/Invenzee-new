"use client";

import { useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { setScrollLocked } from "@/components/providers/SmoothScroll";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import styles from "./Preloader.module.css";

/**
 * Full-screen ink cover. Plays once (~1.8s), then unmounts.
 * Rendered on the server so the first paint is never a bare page.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      /* Drop the CSS failsafe so it cannot hide the overlay mid-timeline. */
      root.removeAttribute("data-failsafe");

      if (prefersReducedMotion()) {
        const id = window.setTimeout(() => {
          markReady();
          setScrollLocked(false);
          setVisible(false);
        }, 0);
        return () => window.clearTimeout(id);
      }

      setScrollLocked(true);
      let locked = true;
      const unlock = () => {
        if (!locked) return;
        locked = false;
        setScrollLocked(false);
      };

      const mark = root.querySelector<HTMLElement>("[data-pre='mark']");
      const fill = root.querySelector<HTMLElement>("[data-pre='fill']");

      const tl = gsap.timeline({
        onComplete: () => {
          unlock();
          setVisible(false);
        },
      });

      tl.fromTo(
        mark,
        { scale: 0.6, opacity: 0, transformOrigin: "50% 50%" },
        { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out" },
        0,
      );
      tl.fromTo(
        fill,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "power3.inOut" },
        0.25,
      );
      /* Hero intro overlaps this exit: ready fires as the slide begins. */
      tl.add(() => markReady(), 0.9);
      tl.to(root, { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, 0.9);
      tl.to(mark, { y: -32, duration: 0.9, ease: "power3.inOut" }, 0.9);

      return () => unlock();
    },
    { scope: rootRef },
  );

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-failsafe=""
      aria-hidden="true"
    >
      <div className={styles.group}>
        <div className={styles.mark} data-pre="mark">
          <Logo variant="mark" height={72} priority />
        </div>
        <div className={styles.hairline}>
          <span className={styles.fill} data-pre="fill" />
        </div>
      </div>
    </div>
  );
}
