"use client";

import { useEffect, useRef } from "react";
import { marquee } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./MarqueeBand.module.css";

export function MarqueeBand() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const shifts = gsap.utils.toArray<HTMLElement>("[data-shift]", root);
        shifts.forEach((el, i) => {
          const from = i === 0 ? 4 : -4;
          gsap.fromTo(
            el,
            { xPercent: from },
            {
              xPercent: -from,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });
    },
    { scope },
  );

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const rows = root.querySelectorAll<HTMLElement>("[data-marquee]");
    const io = new IntersectionObserver(
      ([entry]) => {
        const state = entry?.isIntersecting ? "running" : "paused";
        rows.forEach((row) => {
          row.style.animationPlayState = state;
        });
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      rows.forEach((row) => {
        row.style.animationPlayState = "";
      });
    };
  }, []);

  return (
    <section
      ref={scope}
      aria-hidden="true"
      className="theme-dark overflow-hidden py-[clamp(56px,7vw,120px)]"
    >
      <div className={styles.stack}>
        <WordRow />
        <WordRow reverse outline />
      </div>
    </section>
  );
}

function wordClass(accent: boolean, outline: boolean) {
  if (accent && outline) return `accent ${styles.stroke}`;
  if (accent) return "accent";
  if (outline) return styles.stroke;
  return undefined;
}

function WordRow({ reverse = false, outline = false }: { reverse?: boolean; outline?: boolean }) {
  return (
    <div className={styles.shift}>
      <div data-shift className={styles.scrub}>
        <div data-marquee className={reverse ? `${styles.track} ${styles.reverse}` : styles.track}>
          {[0, 1].map((copy) => (
            <div className={styles.half} key={copy}>
              {marquee.words.map((word, i) => (
                <span className={styles.item} key={`${copy}-${i}`}>
                  <span className={wordClass(i % 2 === 1, outline)}>{word}</span>
                  <span className={styles.slash}>/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
