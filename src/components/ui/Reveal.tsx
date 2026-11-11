"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/useInView";

type Props = {
  children: ReactNode;
  className?: string;
  /** Delay in ms, use for staggering siblings (e.g. index * 80) */
  delay?: number;
  /** Starting offset in px (default 28) */
  y?: number;
  as?: "div" | "li" | "span" | "p" | "section" | "article";
};

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  as = "div",
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  /* All allowed tags share the same props; treat as div for typing */
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={
        { "--reveal-delay": `${delay}ms`, "--reveal-y": `${y}px` } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
