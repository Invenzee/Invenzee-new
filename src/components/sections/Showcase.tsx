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
/** Scroll, in viewport heights, while "Our Work" grows from the center to the top. */
const TITLE_SCROLL = 1.05;
/** A short rest once the title is parked, before the yard and cards arrive. */
const TITLE_HOLD = 0.12;
/** Scroll, in viewport heights, while the yard and cards come in. */
const REVEAL_SCROLL = 0.5;
const REVEAL_RISE = 56;
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

function offsetWithin(node: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let current: HTMLElement | null = node;
  while (current && current !== ancestor) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  if (current !== ancestor) return null;
  return { x, y };
}

/** Layout box of the words and the mark, ignoring scroll transforms. */
function inkBox(title: HTMLElement, stage: HTMLElement) {
  const nodes = [...title.querySelectorAll<HTMLElement>(".hw, .dot")];
  if (!nodes.length) return null;
  let left = Infinity;
  let right = -Infinity;
  let top = Infinity;
  let bottom = -Infinity;
  for (const node of nodes) {
    const o = offsetWithin(node, stage);
    if (!o) return null;
    left = Math.min(left, o.x);
    right = Math.max(right, o.x + node.offsetWidth);
    top = Math.min(top, o.y);
    bottom = Math.max(bottom, o.y + node.offsetHeight);
  }
  if (!Number.isFinite(left) || right <= left) return null;
  return { left, top, width: right - left, height: bottom - top };
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
  const headRef = useRef<HTMLElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
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
      if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) viewport.scrollLeft = 0;
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

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const stage = stageRef.current;
        const viewport = viewportRef.current;
        const rail = railRef.current;
        const head = headRef.current;
        const enter = enterRef.current;
        const title = head?.querySelector<HTMLElement>(".t-h2");
        if (!track || !stage || !viewport || !rail || !head || !enter || !title) return;

        let alive = true;
        const revealEase = gsap.parseEase("power2.out");

        const resetNativeScroll = () => {
          if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
        };

        const metrics = () => {
          const vh = window.innerHeight;
          const titleSpan = vh * TITLE_SCROLL;
          const hold = vh * TITLE_HOLD;
          const reveal = vh * REVEAL_SCROLL;
          const travel = horizontalDistance(rail, viewport);
          return { titleSpan, hold, reveal, travel, total: titleSpan + hold + reveal + travel };
        };

        const phase = (px: number, start: number, span: number) => {
          if (span <= 0) return px >= start ? 1 : 0;
          return gsap.utils.clamp(0, 1, (px - start) / span);
        };

        /* 0 → title parks at the top. Then a beat. Then the yard and cards. Then the rail. */
        const apply = (progress: number) => {
          const { titleSpan, hold, reveal, travel, total } = metrics();
          const px = gsap.utils.clamp(0, 1, progress) * total;
          const titleP = phase(px, 0, titleSpan);

          gsap.set(title, {
            fontSize: `${gsap.utils.interpolate(10.3, 23.3, titleP)}cqw`,
            marginTop: 0,
          });
          /* Measure from a known origin so the entrance transform is ignored. */
          gsap.set(head, { top: 0, x: 0, y: 0, yPercent: 0 });
          const box = inkBox(title, stage);
          if (box) {
            const navH =
              Number.parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
              ) || 0;
            /* Keep the whole word inside the stage: centered, then parked
               just under the nav. A negative pull was slicing the caps off. */
            const startTop = (stage.clientHeight - box.height) / 2 - box.top;
            const endTop = navH + 16 - box.top;
            gsap.set(head, {
              top: gsap.utils.interpolate(startTop, endTop, titleP),
              x: (stage.clientWidth - box.width) / 2 - box.left,
              y: 0,
              opacity: gsap.utils.interpolate(1, 0.5, titleP),
            });
          }

          const revealP = phase(px, titleSpan + hold, reveal);
          const eased = revealEase(revealP);
          gsap.set(viewport, {
            autoAlpha: eased,
            y: gsap.utils.interpolate(REVEAL_RISE, 0, eased),
            pointerEvents: revealP >= 1 ? "auto" : "none",
          });

          const moved = Math.min(travel, Math.max(0, px - titleSpan - hold - reveal));
          gsap.set(rail, { x: -moved });
        };

        const syncHeight = () => {
          resetNativeScroll();
          const trackHeight = Math.max(stage.offsetHeight, window.innerHeight) + metrics().total;
          gsap.set(track, { height: trackHeight });
        };

        viewport.addEventListener("scroll", resetNativeScroll);

        syncHeight();
        ScrollTrigger.addEventListener("refreshInit", syncHeight);

        const playhead = { p: 0 };
        const tween = gsap.to(playhead, {
          p: 1,
          ease: "none",
          onUpdate: () => apply(playhead.p),
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        apply(tween.scrollTrigger?.progress ?? 0);

        const playEnter = () => {
          gsap.fromTo(
            enter,
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 1.15, ease: "expo.out", overwrite: "auto" },
          );
        };
        let entered = track.getBoundingClientRect().top < window.innerHeight * 0.86;
        if (entered) gsap.set(enter, { autoAlpha: 1, y: 0 });
        const intro = ScrollTrigger.create({
          trigger: track,
          start: "top 86%",
          onEnter: () => {
            if (entered) return;
            entered = true;
            playEnter();
          },
          onEnterBack: () => {
            entered = true;
            playEnter();
          },
          onLeaveBack: () => {
            entered = false;
            gsap.set(enter, { autoAlpha: 0, y: 36 });
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
          intro.kill();
          tween.scrollTrigger?.kill();
          tween.kill();
          ScrollTrigger.removeEventListener("refreshInit", syncHeight);
          gsap.set([head, enter, title, viewport, rail], { clearProps: "all" });
          gsap.set(track, { clearProps: "height" });
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
          <header ref={headRef} className={styles.head}>
            <div ref={enterRef} className={styles.enter}>
              <Heading parts={showcase.heading} as="h2" className="t-h2" show />
            </div>
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
          <WorkVisual item={item} hero />
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

function WorkVisual({ item, hero = false }: { item: ShowcaseItem; hero?: boolean }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt=""
        className={hero && item.long ? `${styles.photo} ${styles.hero}` : styles.photo}
      />
    );
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
          <div className={item.long ? styles.longShot : styles.shot}>
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
