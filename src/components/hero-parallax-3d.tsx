"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Subtle perspective depth parallax for the light home hero.
 * Eyebrow, headline, subhead, and actions float at staggered optical depths.
 * Active exclusively on fine pointer hover devices; inert under reduced motion.
 */
export function HeroParallax3D({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!media.matches) return;

    const eyebrow = el.querySelector<HTMLElement>(".home-hero__eyebrow");
    const title = el.querySelector<HTMLElement>(".home-hero__title");
    const subhead = el.querySelector<HTMLElement>(".home-hero__subhead");
    const actions = el.querySelector<HTMLElement>(".home-hero__actions");

    const moveEyebrowX = eyebrow ? gsap.quickTo(eyebrow, "x", { duration: 0.8, ease: "power2.out" }) : null;
    const moveEyebrowY = eyebrow ? gsap.quickTo(eyebrow, "y", { duration: 0.8, ease: "power2.out" }) : null;

    const moveTitleX = title ? gsap.quickTo(title, "x", { duration: 0.8, ease: "power2.out" }) : null;
    const moveTitleY = title ? gsap.quickTo(title, "y", { duration: 0.8, ease: "power2.out" }) : null;

    const moveSubheadX = subhead ? gsap.quickTo(subhead, "x", { duration: 0.9, ease: "power2.out" }) : null;
    const moveSubheadY = subhead ? gsap.quickTo(subhead, "y", { duration: 0.9, ease: "power2.out" }) : null;

    const moveActionsX = actions ? gsap.quickTo(actions, "x", { duration: 1.0, ease: "power2.out" }) : null;
    const moveActionsY = actions ? gsap.quickTo(actions, "y", { duration: 1.0, ease: "power2.out" }) : null;

    const handlePointerMove = (e: PointerEvent) => {
      const bounds = el.getBoundingClientRect();
      const nx = (e.clientX - bounds.left) / bounds.width - 0.5;
      const ny = (e.clientY - bounds.top) / bounds.height - 0.5;

      moveEyebrowX?.(nx * 4);
      moveEyebrowY?.(ny * 3);

      moveTitleX?.(nx * 8);
      moveTitleY?.(ny * 6);

      moveSubheadX?.(nx * 12);
      moveSubheadY?.(ny * 9);

      moveActionsX?.(nx * 16);
      moveActionsY?.(ny * 12);
    };

    const handlePointerLeave = () => {
      moveEyebrowX?.(0);
      moveEyebrowY?.(0);
      moveTitleX?.(0);
      moveTitleY?.(0);
      moveSubheadX?.(0);
      moveSubheadY?.(0);
      moveActionsX?.(0);
      moveActionsY?.(0);
    };

    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      gsap.killTweensOf([eyebrow, title, subhead, actions]);
    };
  }, [reduced]);

  return (
    <div className="home-hero-parallax" ref={root}>
      {children}
    </div>
  );
}
