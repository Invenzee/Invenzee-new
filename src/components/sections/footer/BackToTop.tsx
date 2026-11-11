"use client";

import { ArrowIcon } from "@/components/ui/Button";
import { scrollToTarget } from "@/components/providers/SmoothScroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      className="t-label inline-flex items-center gap-2 text-fg-2 transition-colors duration-300 hover:text-fg"
    >
      Back to top
      <ArrowIcon className="-rotate-90" />
    </button>
  );
}
