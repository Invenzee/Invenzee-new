"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { faq } from "@/content/site";
import styles from "./FaqList.module.css";

const WHEEL = 36; // keep in sync with the CSS
const R = WHEEL / 2;
const STIFFNESS = 140;
const DAMPING = 24; // 2 * sqrt(140) is about 23.7, so this never overshoots

type Ctl = {
  full: () => number; // natural height of the answer
  set: (h: number, v: number) => void; // reveal h px, moving at v px per progress unit
};

function Wheel() {
  return (
    <svg viewBox="0 0 36 36" width={WHEEL} height={WHEEL} fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="16.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="11.5" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {[0, 60, 120].map((deg) => (
        <line
          key={deg}
          x1="18"
          y1="3"
          x2="18"
          y2="33"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          transform={`rotate(${deg} 18 18)`}
        />
      ))}
      <circle cx="18" cy="18" r="3.25" fill="currentColor" />
    </svg>
  );
}

type ItemProps = {
  item: (typeof faq.items)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
  register: (index: number, ctl: Ctl) => () => void;
  onResize: (index: number) => void;
};

function FaqItem({ item, index, open, onToggle, register, onResize }: ItemProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const beadRef = useRef<HTMLButtonElement>(null);

  const buttonId = `faq-q-${index}`;
  const panelId = `faq-a-${index}`;

  useEffect(() => {
    return register(index, {
      full: () => textRef.current?.offsetHeight ?? 0,
      set: (h, v) => {
        const full = textRef.current?.offsetHeight || 1;
        if (panelRef.current) panelRef.current.style.height = `${h}px`;
        if (textRef.current) textRef.current.style.opacity = String(Math.min(1, h / (full * 0.6)));
        rowRef.current?.style.setProperty("--drop", `${h}px`);
        // The bead swings a little on its rope as it speeds up and slows down.
        const swing = Math.max(-10, Math.min(10, -v * 0.012));
        beadRef.current?.style.setProperty("rotate", `${swing}deg`);
      },
    });
  }, [index, register]);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    const observer = new ResizeObserver(() => onResize(index));
    observer.observe(text);
    return () => observer.disconnect();
  }, [index, onResize]);

  return (
    <Reveal delay={index * 50} className={styles.item}>
      <div
        ref={rowRef}
        className={styles.row}
        data-open={open}
        style={{ "--drop": "0px" } as CSSProperties}
      >
        <h3>
          <button
            id={buttonId}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            className={styles.head}
          >
            <span className="t-h4 text-fg">{item.q}</span>
          </button>
        </h3>

        {/* Wheel, the stretch of rope this row has pulled out, and its bead. */}
        <div className={styles.station} aria-hidden="true">
          <span className={styles.wheel}>
            <Wheel />
          </span>
        </div>
        <span className={styles.taut} aria-hidden="true" />
        <button
          ref={beadRef}
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={onToggle}
          className={styles.bead}
        />

        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          inert={!open}
          className={styles.panel}
        >
          <p ref={textRef} className={`t-body ${styles.text}`}>
            {item.a}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function FaqList() {
  const listRef = useRef<HTMLDivElement>(null);
  const ctls = useRef<(Ctl | undefined)[]>([]);
  const revealed = useRef<number[]>([]); // current revealed height per answer
  const from = useRef<number[]>([]);
  const to = useRef<number[]>([]);
  const sp = useRef({ p: 1, v: 0, raf: 0, last: 0 });
  const openRef = useRef<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /** One progress value p drives every answer, the rope and every wheel. */
  const render = useCallback((p: number, pv: number) => {
    let travel = 0;
    faq.items.forEach((_, i) => {
      const a = from.current[i] ?? 0;
      const t = to.current[i] ?? 0;
      const h = a + (t - a) * p;
      revealed.current[i] = h;
      travel += h;
      ctls.current[i]?.set(h, (t - a) * pv);
    });
    const list = listRef.current;
    if (!list) return;
    list.style.setProperty("--travel", `${travel}px`);
    list.style.setProperty("--spin", `${(travel / R) * (180 / Math.PI)}deg`);
  }, []);

  const run = useCallback(() => {
    const s = sp.current;
    cancelAnimationFrame(s.raf);
    s.raf = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      s.p = 1;
      s.v = 0;
      render(1, 0);
      return;
    }

    s.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - s.last) / 1000);
      s.last = now;
      const steps = Math.max(1, Math.ceil(dt / 0.008));
      const h = dt / steps;
      for (let k = 0; k < steps; k++) {
        s.v += (-STIFFNESS * (s.p - 1) - DAMPING * s.v) * h;
        s.p += s.v * h;
      }
      if (Math.abs(1 - s.p) < 0.0005 && Math.abs(s.v) < 0.005) {
        s.p = 1;
        s.v = 0;
        s.raf = 0;
        render(1, 0);
        return;
      }
      render(s.p, s.v);
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  }, [render]);

  useEffect(() => () => cancelAnimationFrame(sp.current.raf), []);

  const register = useCallback((index: number, ctl: Ctl) => {
    ctls.current[index] = ctl;
    return () => {
      ctls.current[index] = undefined;
    };
  }, []);

  // If an answer re-wraps (resize, fonts), the rope follows the new height.
  const onResize = useCallback(
    (index: number) => {
      if (sp.current.raf || openRef.current !== index) return;
      const full = ctls.current[index]?.full() ?? 0;
      from.current = faq.items.map((_, i) => (i === index ? full : 0));
      to.current = from.current.slice();
      render(1, 0);
    },
    [render],
  );

  const toggle = (index: number) => {
    const next = openRef.current === index ? null : index;
    openRef.current = next;
    setOpenIndex(next);

    // Start from wherever everything is right now, so a mid-pull click stays continuous.
    from.current = faq.items.map((_, i) => revealed.current[i] ?? 0);
    to.current = faq.items.map((_, i) => (i === next ? (ctls.current[i]?.full() ?? 0) : 0));
    sp.current.p = 0;
    sp.current.v = 0;
    run();
  };

  return (
    <div
      ref={listRef}
      className={styles.list}
      style={{ "--spin": "0deg", "--travel": "0px" } as CSSProperties}
    >
      <span className={styles.rope} aria-hidden="true" />
      {faq.items.map((item, index) => (
        <FaqItem
          key={item.q}
          item={item}
          index={index}
          open={openIndex === index}
          onToggle={() => toggle(index)}
          register={register}
          onResize={onResize}
        />
      ))}
    </div>
  );
}