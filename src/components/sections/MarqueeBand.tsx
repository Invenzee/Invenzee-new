"use client";

import { useRef } from "react";
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
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-marquee]", root);
        rows.forEach((el, i) => {
          const reverse = i === 1;
          const travel = Math.min(160, el.offsetWidth * 0.025);
          gsap.fromTo(
            el,
            { x: reverse ? -travel : 0 },
            {
              x: reverse ? 0 : -travel,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      aria-hidden="true"
      className="theme-dark overflow-hidden py-[clamp(56px,7vw,120px)]"
    >
      <div className={styles.stack}>
        <WordRow />
        <WordRow outline />
      </div>
    </section>
  );
}

function WordRow({ outline = false }: { outline?: boolean }) {
  return (
    <div className={styles.shift}>
      <div className={styles.scrub}>
        <div data-marquee className={styles.track}>
          {[0, 1].map((copy) => (
            <div className={styles.half} key={copy}>
              {marquee.words.map((word, i) => (
                <span className={styles.item} key={`${copy}-${i}`}>
                  <span className={outline ? styles.stroke : undefined}>{word}</span>
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
