"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { markerHex, showcase, type ShowcaseItem } from "@/content/site";
import { Artwork } from "@/components/ui/Artwork";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { setScrollLocked, getLenis } from "@/components/providers/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./Showcase.module.css";

/** One numbered line per project, plus a single empty step after the last card. */
const MARKS = Array.from({ length: showcase.items.length + 1 }, (_, index) => (index + 1) * 10);
/** Three equal ticks in the middle of each gap, clear of the numbers. */
const MINOR_AT = [0.35, 0.5, 0.65];

function yardTicks() {
  const span = MARKS.length - 1;
  const ticks: { key: string; at: number; label?: number; minor?: boolean }[] = [];
  MARKS.forEach((mark, index) => {
    ticks.push({ key: `n-${mark}`, at: index / span, label: mark });
    if (index === span) return;
    MINOR_AT.forEach((spot, step) => {
      ticks.push({
        key: `m-${mark}-${step}`,
        at: (index + spot) / span,
        minor: true,
      });
    });
  });
  return ticks;
}

function horizontalDistance(rail: HTMLElement, viewport: HTMLElement) {
  const view = viewport.clientWidth;
  const fromWidth = Math.max(0, rail.scrollWidth - view);
  const last = rail.querySelector("article:last-of-type");
  if (!last) return fromWidth;
  const railLeft = rail.getBoundingClientRect().left;
  const lastRight = last.getBoundingClientRect().right - railLeft;
  // Keep going until the last card sits fully on screen, not clipped at the right edge.
  const fromLast = Math.max(0, lastRight - view + 64);
  return Math.max(fromWidth, fromLast);
}

export function Showcase() {
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let width = "";
    const fit = () => {
      const next = `${viewport.clientWidth}px`;
      if (next === width) return;
      width = next;
      viewport.style.setProperty("--work-w", next);
      if (window.matchMedia("(min-width: 1024px)").matches) viewport.scrollLeft = 0;
      ScrollTrigger.refresh();
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const stage = stageRef.current;
        const viewport = viewportRef.current;
        const rail = railRef.current;
        if (!track || !stage || !viewport || !rail) return;

        let alive = true;

        const resetNativeScroll = () => {
          if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
        };

        const syncHeight = () => {
          resetNativeScroll();
          const distance = horizontalDistance(rail, viewport);
          const trackHeight = Math.max(stage.offsetHeight, window.innerHeight) + distance;
          gsap.set(track, { height: trackHeight });
        };

        viewport.addEventListener("scroll", resetNativeScroll);

        syncHeight();
        ScrollTrigger.addEventListener("refreshInit", syncHeight);

        const tween = gsap.to(rail, {
          x: () => -horizontalDistance(rail, viewport),
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        void document.fonts?.ready.then(() => {
          if (!alive) return;
          syncHeight();
          getLenis()?.resize();
          ScrollTrigger.refresh();
        });

        return () => {
          alive = false;
          viewport.removeEventListener("scroll", resetNativeScroll);
          tween.scrollTrigger?.kill();
          tween.kill();
          ScrollTrigger.removeEventListener("refreshInit", syncHeight);
          gsap.set(rail, { clearProps: "transform" });
        };
      });
    },
    { scope },
  );

  const item = active === null ? null : showcase.items[active];

  return (
    <section id={showcase.id} ref={scope} className={`theme-dark relative ${styles.section}`}>
      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage}>
          <header className={styles.head}>
            <Heading parts={showcase.heading} as="h2" className="t-h2" />
          </header>

          <div ref={viewportRef} className={styles.viewport}>
            <div ref={railRef} className={styles.rail}>
              <div className={styles.yard} aria-hidden="true">
                {yardTicks().map((tick) => (
                  <span key={tick.key} className={styles.mark} style={{ left: `${tick.at * 100}%` }}>
                    <span className={tick.minor ? styles.tick : styles.bar} />
                    {tick.label != null ? <span className={styles.num}>{tick.label}</span> : null}
                  </span>
                ))}
              </div>

              <div className={styles.cards}>
                {showcase.items.map((work, index) => (
                  <WorkCard
                    key={work.title}
                    item={work}
                    open={active === index}
                    onOpen={() => setActive(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {mounted && item
        ? createPortal(
            <WorkDialog item={item} onClose={() => setActive(null)} />,
            document.body,
          )
        : null}
    </section>
  );
}

function WorkCard({
  item,
  open,
  onOpen,
}: {
  item: ShowcaseItem;
  open: boolean;
  onOpen: () => void;
}) {
  return (
    <article className={styles.card} data-open={open ? "true" : undefined}>
      <button type="button" className={styles.open} onClick={onOpen}>
        <span className={styles.frame}>
          <WorkVisual item={item} />
          <span className={styles.shine} aria-hidden="true" />
          <span className={styles.view}>View Project</span>
        </span>
        <span className="sr-only">{item.title}</span>
      </button>
      <div className={styles.caption}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={`t-label ${styles.cardMeta}`}>
          <span
            aria-hidden="true"
            className="sq"
            style={{ "--sq": markerHex[item.color], width: 8, height: 8 } as CSSProperties}
          />
          {item.discipline}
        </p>
      </div>
    </article>
  );
}

function WorkVisual({ item }: { item: ShowcaseItem }) {
  if (item.image) {
    return <img src={item.image} alt="" className={styles.photo} />;
  }
  return <Artwork variant={item.art} tone={item.tone} className="h-full w-full" />;
}

function WorkDialog({ item, onClose }: { item: ShowcaseItem; onClose: () => void }) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    setScrollLocked(true);
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll<HTMLElement>("a, button")].filter(
        (node) => !node.hasAttribute("disabled"),
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      setScrollLocked(false);
      previous?.focus();
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
          Close
        </button>
        <div className={styles.body} data-lenis-prevent>
          <div className={styles.shot}>
            <WorkVisual item={item} />
          </div>
          <p className={`t-label ${styles.dialogLabel}`}>
            <span
              aria-hidden="true"
              className="sq"
              style={{ "--sq": markerHex[item.color], width: 8, height: 8 } as CSSProperties}
            />
            {item.discipline}
          </p>
          <h2 id={titleId} className={`t-h3 ${styles.dialogTitle}`}>
            {item.title}
          </h2>
          <p className={`t-body text-fg-2 ${styles.blurb}`}>{item.blurb}</p>
          <div
            className={styles.blocks}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) onClose();
            }}
          >
            {item.blocks.map((block, index) =>
              block.kind === "text" ? (
                <p key={index} className="t-body text-pretty text-fg-2">
                  {block.text}
                </p>
              ) : (
                <Button key={index} href={block.href} variant="primary" size="md">
                  {block.label}
                </Button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
