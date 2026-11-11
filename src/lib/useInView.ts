"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element scrolls into view.
 * Attach `ref` to the element; `inView` flips to true and stays true.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: { rootMargin?: string; threshold?: number } = {},
) {
  const { rootMargin = "0px 0px -12% 0px", threshold = 0.05 } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin, threshold]);

  return { ref, inView };
}
