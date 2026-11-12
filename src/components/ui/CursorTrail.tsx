"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorTrail.module.css";

const KINDS = ["logo", "marketing", "design", "code", "video", "draw"] as const;
type Kind = (typeof KINDS)[number];

const LIFE = 760;
const GAP = 40;
const MAX = 28;
const BURST = 16;

function paint(node: HTMLElement, kind: Kind) {
  node.dataset.kind = kind;
}

function Icons() {
  return (
    <>
      <svg data-icon="logo" viewBox="0 0 32 32" className={styles.icon}>
        <path fill="#ffffff" d="M0 0h18c8.5 0 14 5.5 14 14v18H14C5.5 32 0 26.5 0 18V0z" />
        <path fill="#4bc5de" d="M0 0h15L0 15z" />
        <path fill="#101145" d="M9 22.2 22.2 8.2l3.2 3.4L12.2 25.6z" />
        <path fill="#4bc5de" d="M22 4h6.2v6.2H22z" />
      </svg>
      <svg data-icon="marketing" viewBox="0 0 32 32" className={styles.icon}>
        <path
          fill="currentColor"
          d="M5 11h6.4L24.5 4.2v23.6L11.4 21H5a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3z"
        />
        <path fill="currentColor" d="M7.4 22.4 9.2 29h4.4l-1.9-6.6z" />
        <path
          fill="currentColor"
          d="M26.6 11c2.6 1.5 4.2 3.4 4.2 5s-1.6 3.5-4.2 5c-.7.4-1.6-.1-1.6-.9v-8.2c0-.8.9-1.3 1.6-.9z"
        />
      </svg>
      <svg data-icon="design" viewBox="0 0 32 32" className={styles.icon}>
        <path fill="currentColor" d="M20.8 2.2 29.8 11.2 12.4 28.6 3.4 19.6 20.8 2.2z" />
        <path fill="currentColor" d="M2.6 21.2 1 31l9.8-1.6-8.2-8.2z" />
      </svg>
      <svg data-icon="code" viewBox="0 0 32 32" className={styles.icon}>
        <path fill="currentColor" d="M11 4 1 16l10 12 4-3.6L7.2 16 15 7.6z" />
        <path fill="currentColor" d="M21 4 31 16 21 28l-4-3.6L24.8 16 17 7.6z" />
      </svg>
      <svg data-icon="video" viewBox="0 0 32 32" className={styles.icon}>
        <path fill="currentColor" d="M0 0h18c8.5 0 14 5.5 14 14v18H14C5.5 32 0 26.5 0 18V0z" />
        <path fill="#07081c" d="M12.2 10.2 23.2 16l-11 5.8z" />
      </svg>
      <svg data-icon="draw" viewBox="0 0 32 32" className={styles.icon}>
        <path fill="currentColor" d="M7.6 19.8 19.8 7.6 25.4 13.2 13.2 25.4z" />
        <path fill="currentColor" d="M5.8 21.6 1.6 30.4 10.4 26.2z" />
        <path fill="currentColor" d="M21.2 5.4 26.6 0l5.4 5.4-5.4 5.4z" />
      </svg>
    </>
  );
}

/** Shapes are born at the pointer. The hero mark throws them out on every side. */
export function CursorTrail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const nodes = [...root.querySelectorAll<HTMLElement>("[data-piece]")];
    const born = nodes.map(() => 0);
    const active = nodes.map(() => false);
    const from = nodes.map(() => ({ x: 0, y: 0 }));
    const to = nodes.map(() => ({ x: 0, y: 0 }));
    const timers = new Set<number>();
    let slot = 0;
    let lastX = -999;
    let lastY = -999;
    let frame = 0;

    const spawn = (x: number, y: number, now: number, originX = x, originY = y) => {
      const index = slot % nodes.length;
      slot += 1;
      const node = nodes[index];
      paint(node, KINDS[index % KINDS.length]);
      born[index] = now;
      active[index] = true;
      from[index].x = originX;
      from[index].y = originY;
      to[index].x = x;
      to[index].y = y;
      node.style.opacity = "1";
      node.style.transform = `translate3d(${originX}px, ${originY}px, 0) translate(-50%, -50%) scale(1)`;
    };

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    const onMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const dx = x - lastX;
      const dy = y - lastY;
      if (dx * dx + dy * dy < GAP * GAP) return;
      lastX = x;
      lastY = y;
      spawn(x, y, performance.now());
    };

    const onDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const dot = target.closest<HTMLElement>("[data-anim='dot']");
      if (!dot) return;
      const box = dot.getBoundingClientRect();
      const ox = box.left + box.width / 2;
      const oy = box.top + box.height / 2;
      dot.removeAttribute("data-burst");
      void dot.offsetWidth;
      dot.setAttribute("data-burst", "");
      for (let i = 0; i < BURST; i += 1) {
        const angle = (Math.PI * 2 * i) / BURST;
        const dist = i % 2 === 0 ? 96 : 156;
        later(() => {
          spawn(
            ox + Math.cos(angle) * dist,
            oy + Math.sin(angle) * dist,
            performance.now(),
            ox,
            oy,
          );
        }, (i % 4) * 30);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    const tick = (now: number) => {
      nodes.forEach((node, index) => {
        if (!active[index]) return;
        const age = (now - born[index]) / LIFE;
        if (age >= 1) {
          active[index] = false;
          node.style.opacity = "0";
          return;
        }
        const travel = Math.min(age / 0.42, 1);
        const ease = 1 - (1 - travel) * (1 - travel);
        const px = from[index].x + (to[index].x - from[index].x) * ease;
        const py = from[index].y + (to[index].y - from[index].y) * ease;
        const scale = age < 0.14 ? age / 0.14 : 1 - (age - 0.14) / 0.86;
        node.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = "1";
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      {Array.from({ length: MAX }, (_, index) => (
        <span key={index} data-piece="" className={styles.piece}>
          <Icons />
        </span>
      ))}
    </div>
  );
}
