"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { about } from "@/content/site";
import { ArrowLink } from "@/components/ui/Button";
import { Artwork } from "@/components/ui/Artwork";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { EASE_EXPO, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import styles from "./About.module.css";

/** Width / height for the six frames, in source order. */
const STRIP_WIDTH = ["1.333333", "0.75", "1", "1.333333", "0.75", "1"];

function isPureNumber(value: string) {
  return /^\d+$/.test(value);
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      if (!prefersReducedMotion()) {
        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          if (!Number.isFinite(target)) return;
          const counter = { n: 0 };
          el.textContent = "0";
          gsap.to(counter, {
            n: target,
            duration: 1.2,
            ease: EASE_EXPO,
            scrollTrigger: {
              trigger: el.closest("[data-stat]") ?? el,
              start: "top 82%",
              once: true,
            },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.n));
            },
          });
        });
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const row = rowRef.current;
        const scroller = scrollerRef.current;
        if (!row || !scroller) return;

        scroller.scrollLeft = 0;
        gsap.set(scroller, { overflow: "hidden", scrollSnapType: "none" });

        /* Row padding is the page margin on both sides, so the overflow distance
           parks the last tile on the right margin. */
        gsap.to(row, {
          x: () => {
            const distance = row.scrollWidth - scroller.clientWidth;
            return distance > 0 ? -distance : 0;
          },
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id={about.id}
      ref={sectionRef}
      className={`theme-light sheet relative z-10 overflow-clip ${styles.root}`}
    >
      <div className="wrap sec">
        <Label>{about.label}</Label>
        <Heading
          parts={about.heading}
          as="h2"
          className="t-h2 mt-6 max-w-[16ch]"
        />

        <div className="mt-[clamp(48px,6vw,96px)] grid-12 items-start gap-y-[clamp(40px,5vw,72px)]">
          <div className="col-span-12 min-w-0 lg:col-span-5">
            <Reveal>
              <p className="t-lead text-pretty text-fg">{about.lead}</p>
            </Reveal>
            <Reveal delay={80}>
              <p className="t-body mt-5 max-w-[46ch] text-pretty text-fg-2">
                {about.body}
              </p>
            </Reveal>
            <Reveal delay={160} className="mt-8">
              <ArrowLink href={about.link.href}>{about.link.label}</ArrowLink>
            </Reveal>
          </div>

          <div className="col-span-12 min-w-0 lg:col-span-6 lg:col-start-7">
            <div className="grid grid-cols-2 border-t border-line">
              {about.stats.map((stat, i) => {
                const right = i % 2 === 1;
                const numeric = isPureNumber(stat.value);
                return (
                  <div
                    key={stat.label}
                    data-stat=""
                    className={`min-w-0 py-[clamp(20px,2.4vw,40px)] ${
                      right
                        ? "border-l border-line pl-[clamp(10px,1.6vw,36px)]"
                        : "pr-[clamp(10px,1.6vw,36px)]"
                    } ${i < 2 ? "border-b border-line" : ""}`}
                  >
                    <Reveal delay={i * 80}>
                      <p className="font-display text-[clamp(3.5rem,2rem+5vw,7rem)] leading-[0.9] font-light tracking-[-0.05em] text-fg tabular-nums whitespace-nowrap">
                        {numeric ? (
                          <>
                            <span className="sr-only">{stat.value}</span>
                            <span data-count={stat.value} aria-hidden="true">
                              {stat.value}
                            </span>
                          </>
                        ) : (
                          stat.value
                        )}
                      </p>
                      <p className="t-label mt-4 text-fg-2">{stat.label}</p>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className={`${styles.scroller} mt-[clamp(56px,7vw,112px)]`}
          aria-hidden="true"
          data-lenis-prevent-touch=""
        >
          <div ref={rowRef} className={styles.row}>
            {about.strip.map((item, i) => (
              <div
                key={`${item.art}-${item.tone}`}
                className={`${styles.tile} relative overflow-hidden rounded-card bg-surface`}
                style={{ "--tile-w": STRIP_WIDTH[i] ?? "1" } as CSSProperties}
              >
                <Artwork variant={item.art} tone={item.tone} className="absolute inset-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
