"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fraction of the element that must be visible before it reveals. */
  threshold?: number;
  /** Shifts the trigger line; negative bottom fires slightly before entry. */
  rootMargin?: string;
};

/**
 * Fires once when the element enters the viewport, then stops observing.
 * Reveals never replay on scroll-back.
 *
 * Roughly 1KB of behaviour — the reason this project carries no animation
 * library on the critical path.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    /* No support check is needed here: the boot script in the root layout
       only adds `.reveal-ready` when IntersectionObserver exists, so without
       it nothing is ever hidden in the first place. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin, threshold]);

  return { ref, inView };
}
