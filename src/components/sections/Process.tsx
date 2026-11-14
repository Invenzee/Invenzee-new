"use client";

import { useRef } from "react";
import { process } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { getLenis } from "@/components/providers/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./Process.module.css";

const CORNER = 22; // radius of the route bends
const TOP = 44; // how far below a high card's top edge the route runs
const DROP = 0.2; // low cards: the route leaves 20% down from the card's top
const BORDER_WEIGHT = 420; // scroll distance (px) spent drawing each card's border
const R_FALLBACK = 20;

type Box = { x: number; y: number; w: number; h: number };

/** Layout position in the rail, in real CSS pixels. offsetLeft rounds, which
 *  left every card after the first about 1px outside its fill. */
function relBox(el: HTMLElement, root: HTMLElement) {
  const a = el.getBoundingClientRect();
  const b = root.getBoundingClientRect();
  return {
    x: a.left - b.left,
    y: a.top - b.top,
    w: a.width,
    h: a.height,
    inside: root.contains(el),
  };
}

const px = (n: number) => Math.round(n * 10) / 10;

/** The route: runs behind the cards, zig-zagging high / low. */
function weave(boxes: Box[], railW: number) {
  if (!boxes.length) return "";
  const parts: string[] = [];
  const highY = (b: Box) => b.y + TOP;

  parts.push(`M 0 ${px(highY(boxes[0]))}`);

  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    const right = b.x + b.w;
    const next = boxes[i + 1];

    if (i % 2 === 0) {
      const y = highY(b);
      parts.push(`L ${px(right)} ${px(y)}`);
      if (!next) parts.push(`L ${px(railW)} ${px(y)}`);
    } else {
      const vx = b.x + b.w / 2;
      const fromY = highY(boxes[i - 1]);
      const exitY = b.y + b.h * DROP;

      parts.push(`L ${px(vx - CORNER)} ${px(fromY)}`);
      parts.push(`Q ${px(vx)} ${px(fromY)}, ${px(vx)} ${px(fromY + CORNER)}`);
      parts.push(`L ${px(vx)} ${px(exitY - CORNER)}`);
      parts.push(`Q ${px(vx)} ${px(exitY)}, ${px(vx + CORNER)} ${px(exitY)}`);
      parts.push(`L ${px(right)} ${px(exitY)}`);

      if (next) {
        const nextY = highY(next);
        const gap = next.x - right;
        parts.push(
          `C ${px(right + gap * 0.6)} ${px(exitY)}, ${px(next.x - gap * 0.6)} ${px(nextY)}, ${px(next.x)} ${px(nextY)}`,
        );
      } else {
        parts.push(`L ${px(railW)} ${px(exitY)}`);
      }
    }
  }

  return parts.join(" ");
}

/** 0..1 along the route where it first touches each card's edge. */
function entryMarks(path: SVGPathElement, boxes: Box[]) {
  const len = path.getTotalLength();
  const marks = boxes.map(() => 1);
  if (!len) return marks;
  const found = boxes.map(() => false);
  const steps = 1400;

  for (let s = 0; s <= steps; s++) {
    const at = (s / steps) * len;
    const p = path.getPointAtLength(at);
    boxes.forEach((b, i) => {
      if (found[i]) return;
      const hit =
        i % 2 === 0
          ? p.x >= b.x // high card: touches the left edge
          : p.y >= b.y && p.x >= b.x + b.w / 2 - 2; // low card: touches the top edge
      if (hit) {
        found[i] = true;
        marks[i] = at / len;
      }
    });
  }
  return marks;
}

/* ---------- card border, measured clockwise from the top edge's start ---------- */

function perimeterPoint(b: Box, r: number, sIn: number) {
  const { x, y, w, h } = b;
  const top = w - 2 * r;
  const side = h - 2 * r;
  const arc = (Math.PI * r) / 2;
  const P = 2 * (top + side) + 4 * arc;
  let s = ((sIn % P) + P) % P;

  if (s < top) return { x: x + r + s, y };
  s -= top;
  if (s < arc) {
    const t = s / r;
    return { x: x + w - r + r * Math.sin(t), y: y + r - r * Math.cos(t) };
  }
  s -= arc;
  if (s < side) return { x: x + w, y: y + r + s };
  s -= side;
  if (s < arc) {
    const t = s / r;
    return { x: x + w - r + r * Math.cos(t), y: y + h - r + r * Math.sin(t) };
  }
  s -= arc;
  if (s < top) return { x: x + w - r - s, y: y + h };
  s -= top;
  if (s < arc) {
    const t = s / r;
    return { x: x + r - r * Math.sin(t), y: y + h - r + r * Math.cos(t) };
  }
  s -= arc;
  if (s < side) return { x, y: y + h - r - s };
  s -= side;
  const t = s / r;
  return { x: x + r - r * Math.cos(t), y: y + r - r * Math.sin(t) };
}

function perimeter(b: Box, r: number) {
  return 2 * (b.w - 2 * r + b.h - 2 * r) + 2 * Math.PI * r;
}

/** Perimeter position of the point on the left edge at height yEdge. */
function leftEdgeS(b: Box, r: number, yEdge: number) {
  const top = b.w - 2 * r;
  const side = b.h - 2 * r;
  const arc = (Math.PI * r) / 2;
  const start = 2 * top + side + 3 * arc; // bottom of the left edge
  return start + (b.y + b.h - r - yEdge);
}

/** Half of the border: from the entry point round to the opposite point. */
function halfPath(b: Box, r: number, s0: number, dir: 1 | -1) {
  const half = perimeter(b, r) / 2;
  const n = Math.max(24, Math.ceil(half / 3));
  const pts: string[] = [];
  for (let k = 0; k <= n; k++) {
    const p = perimeterPoint(b, r, s0 + dir * (half * k) / n);
    pts.push(`${k === 0 ? "M" : "L"} ${px(p.x)} ${px(p.y)}`);
  }
  return pts.join(" ");
}

type Stage = { kind: "route" | "border"; i: number; from: number; to: number; s: number; e: number };

export function Process() {
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const edgeSvgRef = useRef<SVGSVGElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const edgeRefs = useRef<(SVGPathElement | null)[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const rail = railRef.current;
      const svg = svgRef.current;
      const edgeSvg = edgeSvgRef.current;
      const draw = drawRef.current;
      const root = scope.current;
      if (!rail || !svg || !edgeSvg || !draw || !root) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-step]", root);

      type Layout = {
        length: number;
        marks: number[];
        lens: number[];
        stages: Stage[];
        total: number;
      };

      const layout = (): Layout | null => {
        const boxes: Box[] = [];
        cards.forEach((card) => {
          const b = relBox(card, rail);
          if (b.inside) boxes.push({ x: b.x, y: b.y, w: b.w, h: b.h });
        });
        const d = weave(boxes, rail.offsetWidth);
        if (!d) return null;

        draw.setAttribute("d", d);
        [svg, edgeSvg].forEach((el) => {
          el.setAttribute("width", String(rail.offsetWidth));
          el.setAttribute("height", String(rail.offsetHeight));
        });

        const length = draw.getTotalLength() || 1;
        const marks = entryMarks(draw, boxes);
        const radius = parseFloat(getComputedStyle(cards[0]).borderTopLeftRadius) || R_FALLBACK;
        /* Sit the stroke on the fill. A centered stroke on the outer edge leaves a hairline. */
        const seam = 1.15;

        // Each card's border: two strokes leave the entry point and meet opposite.
        const lens = boxes.map((b, i) => {
          const edge = {
            x: b.x + seam,
            y: b.y + seam,
            w: b.w - seam * 2,
            h: b.h - seam * 2,
          };
          const r = Math.max(4, radius - seam);
          const s0 = i % 2 === 0 ? leftEdgeS(edge, r, edge.y + TOP - seam) : edge.w / 2 - r;
          const cw = edgeRefs.current[i * 2];
          const ccw = edgeRefs.current[i * 2 + 1];
          cw?.setAttribute("d", halfPath(edge, r, s0, 1));
          ccw?.setAttribute("d", halfPath(edge, r, s0, -1));
          const len = cw?.getTotalLength() || 1;
          [cw, ccw].forEach((el) => {
            if (el) el.style.strokeDasharray = `${len}`;
          });
          return len;
        });

        // Scroll timeline: route -> border -> route -> border ...
        const stages: Stage[] = [];
        let acc = 0;
        let prev = 0;
        boxes.forEach((_, i) => {
          const entry = marks[i] * length;
          stages.push({ kind: "route", i, from: prev, to: entry, s: acc, e: acc + (entry - prev) });
          acc += entry - prev;
          stages.push({ kind: "border", i, from: 0, to: 1, s: acc, e: acc + BORDER_WEIGHT });
          acc += BORDER_WEIGHT;
          prev = entry;
        });
        stages.push({ kind: "route", i: boxes.length, from: prev, to: length, s: acc, e: acc + (length - prev) });
        acc += length - prev;

        return { length, marks, lens, stages, total: acc || 1 };
      };

      /** progress 0..1 across the whole timeline. */
      const render = (L: Layout, progress: number) => {
        const at = progress * L.total;
        let routeDrawn = 0;
        const amt = cards.map(() => 0);

        for (const st of L.stages) {
          if (at >= st.e) {
            if (st.kind === "route") routeDrawn = st.to;
            else amt[st.i] = 1;
          } else if (at > st.s) {
            const f = (at - st.s) / (st.e - st.s);
            if (st.kind === "route") routeDrawn = st.from + (st.to - st.from) * f;
            else amt[st.i] = f;
            break;
          } else break;
        }

        draw.style.strokeDasharray = `${L.length}`;
        draw.style.strokeDashoffset = `${L.length - routeDrawn}`;

        cards.forEach((card, i) => {
          const f = amt[i];
          [edgeRefs.current[i * 2], edgeRefs.current[i * 2 + 1]].forEach((el) => {
            if (!el) return;
            el.style.strokeDashoffset = `${L.lens[i] * (1 - f)}`;
            el.style.opacity = f > 0 ? "1" : "0";
          });
          card.classList.toggle(styles.on, f >= 0.999);
        });

        return routeDrawn;
      };

      // Reduced motion: native horizontal scroll, everything drawn.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const drawFull = () => {
          gsap.set(rail, { x: 0 });
          const L = layout();
          if (L) render(L, 1);
        };
        drawFull();
        ScrollTrigger.addEventListener("refreshInit", drawFull);
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", drawFull);
          gsap.set(rail, { clearProps: "transform" });
        };
      });

      // Pinned stage on every screen: scroll draws the route, the borders, then the glass.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const viewport = viewportRef.current;
        if (!track || !viewport) return;

        let L: Layout | null = null;
        let progress = 0;
        let overflow = 0;
        const stage = viewport.parentElement;

        /* How far the stage hangs below the screen. Horizontal scroll waits
           until that part has come up, so the full cards are on screen. */
        const place = () => {
          if (!stage) return 0;
          const stageHeight = stage.offsetHeight;
          overflow = Math.max(0, stageHeight - window.innerHeight);
          stage.style.top = `${-overflow}px`;
          return stageHeight;
        };

        const apply = (next: number) => {
          if (!L) return;
          progress = gsap.utils.clamp(0, 1, next);
          const routeDrawn = render(L, progress);
          const travel = Math.max(0, rail.offsetWidth - viewport.clientWidth);
          const tip = draw.getPointAtLength(routeDrawn);
          const shift = gsap.utils.clamp(0, travel, tip.x - viewport.clientWidth * 0.62);
          gsap.set(rail, { x: -shift });
        };

        const rebuild = () => {
          L = layout();
          if (!L) return;
          const stageHeight = place();
          gsap.set(track, { height: Math.max(stageHeight, window.innerHeight) + L.total });
          apply(progress);
        };

        rebuild();
        ScrollTrigger.addEventListener("refreshInit", rebuild);

        const playhead = { p: 0 };
        const tween = gsap.to(playhead, {
          p: 1,
          ease: "none",
          onUpdate: () => apply(playhead.p),
          scrollTrigger: {
            trigger: track,
            start: () => `top top-=${overflow}`,
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
        apply(tween.scrollTrigger?.progress ?? 0);

        void document.fonts?.ready.then(() => {
          rebuild();
          getLenis()?.resize();
          ScrollTrigger.refresh();
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          ScrollTrigger.removeEventListener("refreshInit", rebuild);
          gsap.set(rail, { clearProps: "transform" });
          gsap.set(track, { clearProps: "height" });
          if (stage) stage.style.top = "";
          cards.forEach((card) => card.classList.remove(styles.on));
        };
      });
    },
    { scope },
  );

  return (
    <section id={process.id} ref={scope} className={`theme-light sheet relative z-10 ${styles.section}`}>
      <div ref={trackRef} className={styles.track}>
        <div className={styles.stage}>
          <div className={`${styles.head} wrap`}>
            <div className="grid-12 items-end gap-y-6">
              <div className="col-span-12 lg:col-span-7">
                <Label>{process.label}</Label>
                <Heading parts={process.heading} as="h2" className="t-h2 mt-4 max-w-[16ch]" />
              </div>
              <p className={`${styles.intro} col-span-12 text-fg-2 lg:col-span-4 lg:col-start-9`}>{process.intro}</p>
            </div>
          </div>

          <div ref={viewportRef} className={styles.viewport}>
            <div ref={railRef} className={styles.rail}>
              {/* Route: under the cards. */}
              <svg ref={svgRef} className={styles.route} aria-hidden="true">
                <path ref={drawRef} className={styles.draw} />
              </svg>

              <ol className={styles.cards}>
                {process.steps.map((step) => (
                  <li key={step.n} data-step className={styles.card}>
                    <span className={styles.num}>{step.n}</span>
                    <h3 className={`t-h3 ${styles.title}`}>{step.title}</h3>
                    <p className={`t-body ${styles.copy}`}>{step.text}</p>
                  </li>
                ))}
              </ol>

              {/* Card borders: on top of the cards, two strokes per card. */}
              <svg ref={edgeSvgRef} className={styles.edges} aria-hidden="true">
                {process.steps.flatMap((step, i) =>
                  [0, 1].map((k) => (
                    <path
                      key={`${step.n}-${k}`}
                      ref={(node) => {
                        edgeRefs.current[i * 2 + k] = node;
                      }}
                      className={styles.edge}
                    />
                  )),
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}