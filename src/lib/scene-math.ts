/** Shared state between the pinned scroll section and the WebGL scene.
 * `pull` is 1 in the overview cascade and 0 once the camera is flying the gallery.
 * `focus` is a continuous slide index along the gallery. */
export type SceneScroll = { pull: number; focus: number; invalidate: (() => void) | null };

/** Share of the pinned scroll spent opening the overview into the gallery. */
export const INTRO = 0.12;

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Holds each slide still for a moment, then glides to the next one. */
export function dwell(focus: number) {
  const base = Math.floor(focus);
  return base + smoothstep(0.22, 0.78, focus - base);
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
