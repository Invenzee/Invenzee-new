"use client";

import { useEffect, useState, type CSSProperties, type PointerEvent } from "react";
import { useInView } from "@/lib/useInView";
import styles from "./Wordmark.module.css";

const LETTERS = ["\u0131", "n", "v", "e", "n", "z", "e", "e"] as const;

/** The first n keeps the braces. The n before "ee" does not. */
const isN = (index: number) => index === 1;

function Braces() {
  return (
    <span className={`${styles.decor} ${styles.braces}`}>
      <svg viewBox="0 0 22 28" width="100%" height="100%" overflow="visible">
        <rect className={styles.pad} x="1" y="1" width="20" height="26" rx="4" />
        <path
          className={styles.bl}
          d="M9 4 C6 4 6 6 6 9 V11 C6 13 5 14 3 14 C5 15 6 16 6 18 V20 C6 23 6 24 9 24"
        />
        <path
          className={styles.br}
          d="M13 4 C16 4 16 6 16 9 V11 C16 13 17 14 19 14 C17 15 16 16 16 18 V20 C16 23 16 24 13 24"
        />
        <rect className={styles.caret} x="10.2" y="8" width="1.6" height="12" rx="0.8" />
      </svg>
    </span>
  );
}

/** Small details cut into / drawn on the letters. Index matches LETTERS. */
function Decor({ index }: { index: number }) {
  if (isN(index)) return <Braces />;

  switch (index) {
    // v: fountain-pen nib in the vertex. On hover it writes a cyan ink line.
    case 2:
      return (
        <>
          <span className={`${styles.decor} ${styles.nib}`}>
            <svg viewBox="0 0 24 36" width="100%" height="100%" overflow="visible">
              <path
                className={styles.nibBody}
                d="M9 0 H15 L15.5 8 C15.5 11 22 14 21 22 C20.5 27 15 31 12 35 C9 31 3.5 27 3 22 C2 14 8.5 11 8.5 8 Z"
              />
              <circle className={styles.nibHole} cx="12" cy="17" r="2.5" />
              <path className={styles.nibSlit} d="M12 19.5 V34" />
              <path className={styles.nibShine} d="M10.6 2 V7" />
            </svg>
          </span>
          <span className={styles.scribble}>
            <svg viewBox="0 0 50 6" width="100%" height="100%" overflow="visible">
              <path
                className={styles.ink}
                pathLength="1"
                d="M1 3 C5 0 8 6 12 3 S19 0 24 3 S31 6 36 3 S43 0 49 3"
              />
            </svg>
          </span>
        </>
      );

    // e: a bigger target in the eye.
    case 3:
      return (
        <span className={`${styles.decor} ${styles.target}`}>
          <svg viewBox="0 0 40 40" width="100%" height="100%">
            <circle className={styles.r0} cx="20" cy="20" r="20" />
            <circle className={styles.r1} cx="20" cy="20" r="14.5" />
            <circle className={styles.r2} cx="20" cy="20" r="9" />
            <circle className={styles.r3} cx="20" cy="20" r="4.5" />
          </svg>
        </span>
      );

    default:
      return null;
  }
}

export function Wordmark() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [settled, setSettled] = useState(false);

  // After the letters finish rising, stop clipping them so hover animations can overshoot,
  // and let the details appear.
  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setSettled(true), reduce ? 0 : 1500);
    return () => window.clearTimeout(timer);
  }, [inView]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = e.currentTarget;
    const box = frame.getBoundingClientRect();
    const nx = (e.clientX - box.left) / box.width - 0.5;
    const ny = (e.clientY - box.top) / box.height - 0.5;

    // Whole word tilts toward the pointer.
    frame.style.setProperty("--ry", `${(nx * 10).toFixed(2)}deg`);
    frame.style.setProperty("--rx", `${(-ny * 8).toFixed(2)}deg`);
  };

  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    const frame = e.currentTarget;
    ["--rx", "--ry"].forEach((name) => frame.style.removeProperty(name));
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`${styles.frame} ${inView ? styles.isIn : ""} ${settled ? styles.settled : ""}`}
    >
      <div className={styles.word}>
        {LETTERS.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={`${styles.slot} ${styles[`l${index}`]} ${isN(index) ? styles.nn : ""}`}
            style={{ "--i": index } as CSSProperties}
          >
            <span className={styles.mask}>
              <span className={styles.ch}>
                <span className={styles.glyph}>
                  {letter}
                  <Decor index={index} />
                </span>
              </span>
            </span>
            {index === 0 ? (
              <button
                type="button"
                className={styles.dot}
                data-anim="dot"
                aria-label="Pop the mark"
                onClick={(e) => {
                  const el = e.currentTarget;
                  el.removeAttribute("data-burst");
                  void el.offsetWidth;
                  el.setAttribute("data-burst", "");
                }}
                onAnimationEnd={(e) => e.currentTarget.removeAttribute("data-burst")}
              />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}
