"use client";

import { useRef, type CSSProperties } from "react";
import { markerHex, showcase, type ShowcaseItem } from "@/content/site";
import { Artwork } from "@/components/ui/Artwork";
import { ArrowLink } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { getLenis } from "@/components/providers/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./Showcase.module.css";

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * How far the rail must travel: its content width minus the stage, which is
 * the viewport. scrollWidth is the spec path; if a browser reports no
 * overflow, sum the intro and cards instead.
 */
function horizontalDistance(rail: HTMLElement, stage: HTMLElement) {
  const viewport = stage.clientWidth;
  let content = rail.scrollWidth;
  if (content <= viewport + 1) {
    const style = getComputedStyle(rail);
    const gap = Number.parseFloat(style.columnGap) || 0;
    const pad =
      (Number.parseFloat(style.paddingLeft) || 0) +
      (Number.parseFloat(style.paddingRight) || 0);
    const boxes = rail.querySelectorAll<HTMLElement>("[data-intro], article");
    let sum = 0;
    boxes.forEach((el) => {
      sum += el.offsetWidth;
    });
    content = pad + sum + gap * Math.max(0, boxes.length - 1);
  }
  return Math.max(0, content - viewport);
}

export function Showcase() {
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const count = showcase.items.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const stage = stageRef.current;
        const rail = railRef.current;
        if (!track || !stage || !rail) return;

        let alive = true;

        const syncHeight = () => {
          const stageHeight = stage.offsetHeight;
          const distance = horizontalDistance(rail, stage);
          // ScrollTrigger from "top top" to "bottom bottom" travels
          // trackHeight − innerHeight. Using the taller of the stage and the
          // scrollport keeps that distance equal to the horizontal travel
          // when 100dvh and the scrollport match, and never shorter.
          const trackHeight = Math.max(stageHeight, window.innerHeight) + distance;
          gsap.set(track, { height: trackHeight });
        };

        const paint = (progress: number) => {
          const clamped = Math.min(1, Math.max(0, progress));
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${clamped})`;
          if (currentRef.current) {
            const index = Math.min(count, Math.max(1, Math.round(clamped * (count - 1)) + 1));
            currentRef.current.textContent = pad2(index);
          }
        };

        syncHeight();
        ScrollTrigger.addEventListener("refreshInit", syncHeight);

        const layers = gsap.utils.toArray<HTMLElement>("[data-parallax]", rail);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => paint(self.progress),
            onRefresh: (self) => paint(self.progress),
          },
        });

        tl.to(rail, { x: () => -horizontalDistance(rail, stage) }, 0);
        layers.forEach((layer, i) => {
          const shift = 6 + (i % 3) * 2;
          tl.fromTo(layer, { x: shift }, { x: -shift }, 0);
        });

        void document.fonts?.ready.then(() => {
          if (!alive) return;
          syncHeight();
          getLenis()?.resize();
          ScrollTrigger.refresh();
        });

        return () => {
          alive = false;
          ScrollTrigger.removeEventListener("refreshInit", syncHeight);
          if (fillRef.current) fillRef.current.style.transform = "";
          if (currentRef.current) currentRef.current.textContent = pad2(1);
        };
      });
    },
    { scope },
  );

  return (
    <section id={showcase.id} ref={scope} className={`theme-dark relative ${styles.section}`}>
      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage}>
          <div ref={railRef} className={styles.rail}>
            <div className={styles.intro} data-intro>
              <div>
                <Label>{showcase.label}</Label>
                <Heading parts={showcase.heading} as="h2" className="t-h2 mt-6" />
              </div>
              <div className={styles.introFoot}>
                <p className="t-body max-w-[30ch] text-fg-2">{showcase.intro}</p>
                <ArrowLink href={showcase.link.href} className="mt-8">
                  {showcase.link.label}
                </ArrowLink>
              </div>
            </div>

            <div className={styles.cards} data-lenis-prevent>
              {showcase.items.map((item, index) => (
                <ShowcaseCard key={item.title} item={item} index={index} />
              ))}
            </div>
          </div>

          <div className={styles.progress} aria-hidden="true">
            <div className="wrap pb-7">
              <div className="flex items-center gap-5">
                <div className={styles.meter}>
                  <span ref={fillRef} className={styles.meterFill} />
                </div>
                <p className="t-label m-0 shrink-0 text-fg-3 tabular-nums">
                  <span ref={currentRef} className="text-fg">
                    {pad2(1)}
                  </span>
                  {" / "}
                  <span>{pad2(count)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({ item, index }: { item: ShowcaseItem; index: number }) {
  return (
    <article className={`${styles.card} group/card`}>
      <div className={styles.frame}>
        <div className={styles.zoom}>
          <div className={styles.parallax} data-parallax>
            <Artwork
              variant={item.art}
              tone={item.tone}
              className="h-full w-full origin-center transition-transform duration-[900ms] ease-expo group-hover/card:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <span className="t-label inline-flex min-w-0 items-center gap-2.5 text-fg-2">
          <span
            className="sq shrink-0"
            style={{ "--sq": markerHex[item.color] } as CSSProperties}
          />
          <span className="min-w-0">{item.discipline}</span>
        </span>
        <span className="t-label shrink-0 text-fg-3 tabular-nums">{pad2(index + 1)}</span>
      </div>
      <h3 className="t-h3 mt-[14px]">{item.title}</h3>
      <p className="t-small mt-2 max-w-[34ch] text-fg-2">{item.blurb}</p>
    </article>
  );
}
