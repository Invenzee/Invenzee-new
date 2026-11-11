"use client";

import type { CSSProperties } from "react";
import { useInView } from "@/lib/useInView";
import styles from "./Wordmark.module.css";

const LETTERS = ["\u0131", "n", "v", "e", "n", "z", "e", "e"] as const;

export function Wordmark() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${styles.frame} ${inView ? styles.isIn : ""}`}
    >
      <div className={styles.word}>
        {LETTERS.map((letter, index) => (
          <span key={`${letter}-${index}`} className={styles.slot}>
            <span className={styles.mask}>
              <span
                className={styles.ch}
                style={{ "--i": index } as CSSProperties}
              >
                {letter}
              </span>
            </span>
            {index === 0 ? <span className={styles.dot} /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}
