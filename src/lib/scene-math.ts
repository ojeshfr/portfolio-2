/**
 * Scene mathematics & physical motion model for the 3D spatial gallery.
 * Provides critically-damped smoothing, eased dwell plateaus, corridor banking,
 * and calibrated camera framing.
 */

export type QualityTier = "high" | "medium" | "low";

/** Shared state between the scroll trigger, user interaction, and the WebGL scene. */
export type SceneScroll = {
  pull: number;
  focus: number;
  targetPull?: number;
  targetFocus?: number;
  velocity?: number;
  quality?: QualityTier;
  invalidate: (() => void) | null;
};

/** Share of the pinned scroll spent opening the overview into the corridor flight. */
export const INTRO = 0.12;

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Critically-damped exponential smoothing towards target, framerate independent.
 * lambda controls stiffness (higher = snappier; 9-11 gives silky, responsive tracking).
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return target + (current - target) * Math.exp(-lambda * Math.max(0, dt));
}

/**
 * Smooth Hermite-like plateau holding each slide still near center,
 * easing seamlessly into flight when scrolling to the next.
 */
export function dwell(focus: number) {
  const base = Math.floor(focus);
  const fraction = focus - base;
  return base + smoothstep(0.20, 0.80, fraction);
}

/**
 * Dynamic bank angle during corridor transit.
 * Tilts into alternating turns with velocity-aware weight.
 */
export function corridorBank(t: number, fromIndex: number, velocity = 0): number {
  const direction = fromIndex % 2 === 0 ? 1 : -1;
  const transitRoll = Math.sin(t * Math.PI) * 0.048 * direction;
  const inertiaRoll = clamp(velocity * 0.04, -0.025, 0.025);
  return transitRoll + inertiaRoll;
}

export function stateForProgress(progress: number, count: number) {
  return {
    pull: 1 - smoothstep(0, INTRO, progress),
    focus: clamp((progress - INTRO) / (1 - INTRO)) * Math.max(0, count - 1),
  };
}

export function progressForItem(index: number | null, count: number) {
  return index === null || count < 2 ? 0 : INTRO + (1 - INTRO) * (index / (count - 1));
}

export function activeIndex(pull: number, focus: number) {
  return pull > 0.5 ? null : Math.round(dwell(focus));
}
