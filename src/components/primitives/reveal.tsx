"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  /** "scale" adds a slight settle alongside the rise. */
  variant?: "rise" | "scale";
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/**
 * Reveals its children once, when they first enter the viewport.
 *
 * The hidden state lives in CSS under `.reveal-ready`, a class an inline boot
 * script adds in the root layout — so with JavaScript disabled nothing is ever
 * left invisible. `prefers-reduced-motion` disables the whole effect.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "rise",
  as: Tag = "div",
  className,
  style,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-visible={inView ? "true" : "false"}
      className={cn(className)}
      style={{ ...style, "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
