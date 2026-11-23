"use client";

import { useRef, useState, useCallback, useSyncExternalStore } from "react";
import type { ReactNode, MouseEvent } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const hoverQuery = "(hover: hover) and (pointer: fine)";
const subscribeHover = (onChange: () => void) => {
  const media = window.matchMedia(hoverQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const hoverSnapshot = () => window.matchMedia(hoverQuery).matches;
const hoverServerSnapshot = () => false;

type CardTilt3DProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
};

/**
 * Tasteful 3D perspective tilt and dynamic specular glare for cards.
 * Active exclusively on fine pointer hover devices, completely disabled under
 * reduced motion. Uses pure transforms without shifting layout.
 */
export function CardTilt3D({
  children,
  className = "",
  maxTilt = 3.2,
  glareOpacity = 0.16,
}: CardTilt3DProps) {
  const container = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({});
  const reduced = usePrefersReducedMotion();
  const canHover = useSyncExternalStore(subscribeHover, hoverSnapshot, hoverServerSnapshot);

  const handlePointerMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (reduced || !canHover || !container.current) return;
      const rect = container.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (0.5 - y) * maxTilt * 2;
      const tiltY = (x - 0.5) * maxTilt * 2;

      setStyle({
        transform: `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(3px)`,
        transition: "transform 0.12s ease-out",
      });

      setGlareStyle({
        opacity: glareOpacity,
        background: `radial-gradient(circle 300px at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%, rgba(255, 255, 255, 0.28), transparent 75%)`,
      });
    },
    [reduced, canHover, maxTilt, glareOpacity],
  );

  const handlePointerLeave = useCallback(() => {
    if (reduced || !canHover) return;
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      transition: "transform 0.45s cubic-bezier(0.28, 0.11, 0.32, 1)",
    });
    setGlareStyle({
      opacity: 0,
      transition: "opacity 0.45s cubic-bezier(0.28, 0.11, 0.32, 1)",
    });
  }, [reduced, canHover]);

  return (
    <div
      ref={container}
      className={`tilt-3d-wrapper ${className}`.trim()}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        willChange: canHover && !reduced ? "transform" : "auto",
        ...style,
      }}
    >
      {children}
      {canHover && !reduced && (
        <div
          aria-hidden="true"
          className="tilt-3d-glare"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            mixBlendMode: "overlay",
            opacity: 0,
            zIndex: 4,
            ...glareStyle,
          }}
        />
      )}
    </div>
  );
}
