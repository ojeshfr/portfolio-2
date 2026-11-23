"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function ScrollReveals() {
  const reduceMotion = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]");
      if (elements.length === 0) return;

      elements.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              once: true,
            },
          },
        );
      });
    });

    return () => context.revert();
  }, [pathname, reduceMotion]);

  return null;
}
