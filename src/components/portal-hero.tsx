"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Component, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneItem } from "@/lib/scene";
import { activeIndex, progressForItem, stateForProgress } from "@/lib/scene-math";
import type { SceneScroll } from "@/lib/scene-math";
import { site } from "@/lib/site";
import { AmbientField } from "@/components/ambient-field";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const SpatialScene = dynamic(() => import("@/components/spatial-scene"), { ssr: false });
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const wideQuery = "(min-width: 1000px) and (min-aspect-ratio: 1/1)";
const subscribeWide = (onChange: () => void) => {
  const list = window.matchMedia(wideQuery);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
};
const wideSnapshot = () => window.matchMedia(wideQuery).matches;
const wideServerSnapshot = () => false;

const pad = (value: number) => String(value).padStart(2, "0");

export function PortalHero({ items }: { items: SceneItem[] }) {
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [indexPresent, setIndexPresent] = useState(false);
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const scroll = useRef<SceneScroll>({ pull: 1, focus: 0, invalidate: null });
  const registerInvalidation = useCallback((callback: (() => void) | null) => { scroll.current.invalidate = callback; }, []);
  const reduced = usePrefersReducedMotion();
  const wide = useSyncExternalStore(subscribeWide, wideSnapshot, wideServerSnapshot);
  // Wide screens with motion allowed fly the gallery by scrolling; everything
  // else selects a slide and the camera glides there.
  const driven = wide && !reduced;
  const markReady = useCallback(() => setReady(true), []);
  const markFailed = useCallback(() => setReady(false), []);
  const item = active === null ? null : items[active];
  const count = items.length;

  useEffect(() => {
    const canvas = root.current?.querySelector("canvas");
    if (!ready || !canvas) return;
    canvas.addEventListener("webglcontextlost", markFailed);
    return () => canvas.removeEventListener("webglcontextlost", markFailed);
  }, [ready, markFailed]);

  useEffect(() => {
    if (!indexOpen) return;
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIndexOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [indexOpen]);

  useLayoutEffect(() => {
    if (!driven || !ready) return;
    gsap.registerPlugin(ScrollTrigger);
    const state = scroll.current;
    const apply = (progress: number) => {
      Object.assign(state, stateForProgress(progress, count));
      state.invalidate?.();
      const next = activeIndex(state.pull, state.focus);
      setActive((current) => (current === next ? current : next));
    };
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ scrollTrigger: {
        id: "portfolio-flight", trigger: root.current, start: "top top",
        // Roughly 0.6 screens of scrolling per slide, plus the opening.
        end: () => `+=${Math.round(window.innerHeight * (1.2 + count * .62))}`,
        pin: true, scrub: .65, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      } });
      timeline.to(".spatial-note, .spatial-scroll", { autoAlpha: 0, y: -18, duration: .06 }, 0)
        .fromTo(".spatial-progress span", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
    }, root);
    // Textures become ready after the chapter triggers have measured their
    // positions. Re-measure after inserting the pin spacer, with the pin first.
    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refreshFrame);
      context.revert();
      Object.assign(state, { pull: 1, focus: 0 });
      state.invalidate?.();
      setActive(null);
    };
  }, [driven, ready, count]);

  const focus = useCallback((index: number | null) => {
    if (!driven) { setActive(index); return; }
    const trigger = ScrollTrigger.getById("portfolio-flight");
    if (!trigger) return;
    const top = trigger.start + (trigger.end - trigger.start) * progressForItem(index, count);
    window.scrollTo({ top, behavior: "smooth" });
  }, [driven, count]);

  const open = useCallback((target: SceneItem) => {
    if (target.external) window.open(target.href, "_blank", "noopener,noreferrer");
    else router.push(target.href);
  }, [router]);

  // First click flies to a slide; clicking the slide you are already on opens it.
  const select = useCallback((index: number) => {
    if (index === active) open(items[index]);
    else focus(index);
  }, [active, focus, open, items]);

  const link = (target: SceneItem, label: ReactNode) => target.external
    ? <a href={target.href} target="_blank" rel="noreferrer">{label}</a>
    : <Link href={target.href}>{label}</Link>;

  return (
    <section className="spatial-hero" ref={root} aria-label="Spatial project gallery">
      <AmbientField className="ambient-field--cosmic" />
      <h2 className="visually-hidden">Selected web projects and Windows tools in three dimensions</h2>
      <div className="spatial-note">Inside the work<br /><span>{count} projects · {driven ? "Scroll to fly through" : "Tap a slide to explore"}</span></div>
      <div className="spatial-stage">
        <div className={"spatial-fallback" + (ready ? " is-hidden" : "")}>
          {items.slice(0, 4).map((entry, i) => <Link href={entry.href} key={entry.id}
            style={{ "--plane": i, "--aspect": entry.image.aspect } as CSSProperties}>
            <Image src={entry.image.src} alt={entry.image.alt} fill sizes="(max-width: 760px) 75vw, 42vw" loading="lazy" />
          </Link>)}
        </div>
        <div className={"spatial-webgl" + (ready ? " is-ready" : "")} aria-hidden="true"><SceneBoundary onFailure={markFailed}>
          <SpatialScene items={items} selected={active} reduced={reduced} driven={driven} scroll={scroll} onInvalidate={registerInvalidation} onSelect={select} onReady={markReady} onLoading={markFailed} />
        </SceneBoundary></div>
      </div>
      <div className={"spatial-arrival" + (item ? " is-open" : "")}>
        <span>{item ? `${item.kind === "web" ? "Web project" : "Windows tool"} / ${pad((active ?? 0) + 1)} of ${pad(count)}` : ""}</span>
        <p>{item?.title}</p>
        <small>{item?.type}</small>
        {item ? link(item, item.cta) : null}
      </div>
      <div className="spatial-progress" aria-hidden="true"><span /></div>
      <nav className="spatial-rail" aria-label="Gallery chapters">
        {items.map((entry, i) => <button key={entry.id} type="button" data-label={`${pad(i + 1)} ${entry.title}`}
          aria-label={`Go to ${entry.title}`} aria-current={active === i} onClick={() => focus(i)}><span /></button>)}
      </nav>
      <div className={"spatial-focus" + (item ? " is-hidden" : "")} aria-live="polite" aria-atomic="true">
        <p>Selected digital work<span>{driven ? "Scroll to fly through, or open the index." : "Tap a slide or open the index."}</span></p>
      </div>
      <div className="spatial-footer">
        <a className="spatial-contact" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        <div className="spatial-switch" role="group" aria-label="Project views">
          <button type="button" aria-pressed={active === null && !indexOpen} onClick={() => { focus(null); setIndexOpen(false); }}>Overview</button>
          <button type="button" ref={toggle} aria-expanded={indexOpen} aria-controls="spatial-index" onClick={() => {
            if (indexOpen) setIndexOpen(false);
            else { setIndexPresent(true); setIndexOpen(true); }
          }}>Index <span>{indexOpen ? "−" : "+"}</span></button>
        </div>
      </div>
      <AnimatePresence initial={false} onExitComplete={() => { if (!indexOpen) setIndexPresent(false); }}>
        {indexOpen && <motion.div
          className="spatial-index"
          id="spatial-index"
          ref={panel}
          role="region"
          aria-label="Project index"
          data-present={indexPresent}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 32, mass: 0.7 }}
        >
          <div className="spatial-index__head"><span>Selected work / {pad(count)}</span><button aria-label="Close project index" type="button" onClick={() => { setIndexOpen(false); toggle.current?.focus(); }}>×</button></div>
          {items.map((entry, i) => <div className="spatial-index__row" key={entry.id}>
            <button className="spatial-index__select" type="button" aria-pressed={active === i} onClick={() => focus(i)}>
              <span className="spatial-index__thumb" aria-hidden="true">
                <Image alt="" fill loading="lazy" sizes="72px" src={entry.image.src} />
              </span>
              <span className="spatial-index__details">
                <span className="spatial-index__title"><span>{pad(i + 1)}</span>{entry.title}</span>
                <small>{entry.type}</small>
              </span>
            </button>
            {entry.external
              ? <a href={entry.href} target="_blank" rel="noreferrer" aria-label={`Open ${entry.title} on GitHub`}>↗</a>
              : <Link href={entry.href} aria-label={`Open ${entry.title} case study`}>↗</Link>}
          </div>)}
        </motion.div>}
      </AnimatePresence>
      <a href="#about" className="spatial-scroll" aria-label="Continue to about and contact"><span>Continue below</span> ↓</a>
    </section>
  );
}
