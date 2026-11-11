"use client";

import type { CSSProperties } from "react";
import type { HeadingPart } from "@/content/site";
import { useInView } from "@/lib/useInView";

type Props = {
  parts: HeadingPart[];
  as?: "h1" | "h2" | "h3" | "p";
  /** Type utility + anything else, e.g. "t-h2 max-w-[14ch]" */
  className?: string;
  /** End the heading with the cyan signal dot (default true) */
  dot?: boolean;
  /** Extra delay before the words rise, in ms */
  delay?: number;
  /** Force the visible state from a parent (e.g. a GSAP timeline) instead of scroll */
  show?: boolean;
};

/**
 * Brand heading. Each word rises out of a mask, staggered, when the heading
 * scrolls into view. Accent parts are set in the italic serif.
 */
export function Heading({
  parts,
  as = "h2",
  className = "t-h2",
  dot = true,
  delay = 0,
  show,
}: Props) {
  const { ref, inView } = useInView<HTMLHeadingElement>();
  /* All allowed tags share the same props; treat as h2 for typing */
  const Tag = as as "h2";
  const visible = show ?? inView;

  let i = 0;
  const label = parts
    .map((p) => (typeof p === "string" ? p : p.accent))
    .join("");

  const nodes = parts.flatMap((part, pi) => {
    const isAccent = typeof part !== "string";
    const text = isAccent ? part.accent : part;
    /* Keep whitespace tokens so spacing between parts is preserved exactly */
    return text.split(/(\s+)/).map((token, ti) => {
      if (token === "") return null;
      if (/^\s+$/.test(token)) return " ";
      const index = i++;
      return (
        <span key={`${pi}-${ti}`} className="hw">
          <span
            className={isAccent ? "hwi accent" : "hwi"}
            style={{ "--i": index } as CSSProperties}
          >
            {token}
          </span>
        </span>
      );
    });
  });

  return (
    <Tag
      ref={ref}
      aria-label={label}
      className={`heading ${className} ${visible ? "is-in" : ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      <span aria-hidden="true">
        {nodes}
        {dot && <span className="dot" style={{ "--i": i } as CSSProperties} />}
      </span>
    </Tag>
  );
}
