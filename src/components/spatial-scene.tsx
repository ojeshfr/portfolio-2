"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, Color, Mesh, MeshBasicMaterial, SRGBColorSpace, Texture, TextureLoader } from "three";
import type { RefObject } from "react";
import type { SceneItem } from "@/lib/scene";
import { clamp, dwell } from "@/lib/scene-math";
import type { SceneScroll } from "@/lib/scene-math";

type Vec3 = [number, number, number];
type Layout = {
  width: number; height: number; distance: number; src: string; aspect: number;
  overview: Vec3; corridor: Vec3; overviewRotation: Vec3; corridorRotation: Vec3;
};
type Hover = { v: number; tx: number; ty: number };
type SceneProps = {
  items: SceneItem[]; selected: number | null; reduced: boolean; driven: boolean;
  scroll: RefObject<SceneScroll>;
  onInvalidate: (callback: (() => void) | null) => void;
  onSelect: (index: number) => void; onReady: () => void; onLoading: () => void;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const EDGE = new Color("#424247");
const EDGE_FOCUS = new Color("#c8795b");
const HALF_FOV = Math.tan(20 * Math.PI / 180);
// Vertical offsets break the corridor's rhythm so it reads as a path, not a row.
const LIFT = [.6, -.5, .9, -.2, .5, -.8, .3, -.4, .7, -.3];

/** One soft radial falloff, reused as every slide's contact shadow so slides
 * read as layers in depth instead of flat cards. */
function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 6, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,.9)");
    gradient.addColorStop(.55, "rgba(0,0,0,.38)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Sparse paper-coloured dust spread along the whole corridor. Camera travel
 * through it supplies the parallax that makes the flight read as depth. */
function Dust({ length, spread }: { length: number; spread: number }) {
  const positions = useMemo(() => {
    let seed = 7;
    const next = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const count = Math.round(length * 7);
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = (next() - .5) * spread;
      array[i * 3 + 1] = (next() - .5) * 18;
      array[i * 3 + 2] = 10 - next() * (length + 30);
    }
    return array;
  }, [length, spread]);
  return <points>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <pointsMaterial color="#e9e5d8" size={.05} sizeAttenuation transparent opacity={.4} depthWrite={false} toneMapped={false} />
  </points>;
}

function Installation({ items, selected, reduced, driven, scroll, onInvalidate, onSelect, onReady, onLoading }: SceneProps) {
  const { size, camera, gl, invalidate } = useThree();
  const mobile = size.width < 760 || size.width / size.height < .95;
  const meshes = useRef<(Mesh | null)[]>([]);
  const materials = useRef<(MeshBasicMaterial | null)[]>([]);
  const borders = useRef<(MeshBasicMaterial | null)[]>([]);
  const hovers = useRef<Hover[]>([]);
  const [textures, setTextures] = useState<(Texture | null)[]>([]);
  const pointer = useRef({ px: 0, py: 0 });
  const shadow = useMemo(() => createShadowTexture(), []);
  const idle = !reduced && !mobile;
  const hover = (index: number) => (hovers.current[index] ??= { v: 0, tx: 0, ty: 0 });

  const viewAspect = size.width / size.height;
  const layouts = useMemo<Layout[]>(() => {
    const sized = items.map((item) => {
      const width = Math.min(mobile ? 4.7 : 8.2, (mobile ? 3.2 : 5.3) * item.image.aspect);
      const height = width / item.image.aspect;
      // How far back the camera must sit to fit this slide on both axes.
      const distance = Math.max(width / (2 * HALF_FOV * viewAspect * .76), height / (2 * HALF_FOV * .64)) + .5;
      return { item, width, height, distance };
    });
    // Slides must sit farther apart than the camera's framing distance, or the
    // previous slide would hang between the camera and the one being shown.
    const step = Math.max(mobile ? 9 : 13, Math.max(...sized.map((entry) => entry.distance)) + 5);
    return sized.map(({ item, width, height, distance }, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const lift = LIFT[i % LIFT.length] * (mobile ? .6 : 1);
      // The first four slides keep the established diagonal cascade; later ones
      // continue it up and back so the overview hints at more.
      const tail = Math.max(0, i - 3);
      const overview: Vec3 = mobile
        ? (i < 4 ? [[-.7, -2.55, 1.4], [.45, -.8, .2], [-.25, .95, -.9], [.65, 2.6, -2]][i] as Vec3 : [.4, 2.6 + tail * 1.7, -2 - tail * 1.4])
        : (i < 4 ? [[-4, -2, -.3], [-.65, -.25, .4], [1.8, 1.1, -.8], [4.6, 3.35, -2.3]][i] as Vec3 : [4.6 + tail * 2.8, 3.35 + tail * 2.1, -2.3 - tail * 1.4]);
      return {
        width, height, distance, src: item.image.src, aspect: item.image.aspect,
        overview,
        corridor: [side * (mobile ? 1.1 : 3.4), lift, -i * step],
        overviewRotation: mobile ? [.03, -.22, -.1] : [.05, -.38, -.12],
        corridorRotation: [.03, -side * (mobile ? .2 : .3), -side * .035],
      };
    });
  }, [items, mobile, viewAspect]);

  const corridorLength = Math.abs(layouts[layouts.length - 1]?.corridor[2] ?? 0);

  useEffect(() => () => shadow.dispose(), [shadow]);
  useEffect(() => {
    onInvalidate(invalidate);
    invalidate();
    return () => onInvalidate(null);
  }, [onInvalidate, invalidate]);

  useEffect(() => {
    let cancelled = false;
    onLoading();
    const bank: (Texture | null)[] = items.map(() => null);
    let pending = items.length;
    const loader = new TextureLoader();
    items.forEach((item, i) => {
      loader.load(item.image.src, (texture) => {
        if (cancelled) { texture.dispose(); return; }
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        bank[i] = texture;
        if (--pending === 0) { setTextures([...bank]); invalidate(); }
      }, undefined, () => {
        if (--pending === 0 && !cancelled) { setTextures([...bank]); invalidate(); }
      });
    });
    return () => { cancelled = true; bank.forEach((texture) => texture?.dispose()); };
  }, [items, gl, invalidate, onLoading]);

  useEffect(() => {
    // Adding a texture after the placeholder requires a new material program.
    materials.current.forEach((material) => { if (material) material.needsUpdate = true; });
    invalidate();
    if (textures.length === items.length && textures.every(Boolean)) onReady();
  }, [textures, items.length, invalidate, onReady]);

  useEffect(() => {
    // Without scroll driving (touch, narrow or reduced motion) the selection
    // flies the camera itself. With scroll driving, the pinned section owns these values.
    if (driven) return;
    const state = scroll.current;
    const tween = gsap.to(state, {
      pull: selected === null ? 1 : 0, focus: selected ?? state.focus,
      duration: reduced ? 0 : 1.1, ease: "power3.inOut", onUpdate: invalidate,
    });
    invalidate();
    return () => { tween.kill(); };
  }, [driven, selected, reduced, scroll, invalidate]);

  useEffect(() => {
    const element = gl.domElement;
    const values = pointer.current;
    const moveX = gsap.quickTo(values, "px", { duration: .8, ease: "power2.out", onUpdate: invalidate });
    const moveY = gsap.quickTo(values, "py", { duration: .8, ease: "power2.out", onUpdate: invalidate });
    const move = (event: PointerEvent) => {
      if (reduced || mobile || event.pointerType !== "mouse") return;
      const bounds = element.getBoundingClientRect();
      moveX(((event.clientX - bounds.left) / bounds.width - .5) * .6);
      moveY(-((event.clientY - bounds.top) / bounds.height - .5) * .4);
    };
    const leave = () => { moveX(0); moveY(0); };
    values.px = values.py = 0;
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    invalidate();
    return () => {
      moveX.tween.kill(); moveY.tween.kill();
      element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave);
      element.style.cursor = "";
    };
  }, [gl, reduced, mobile, invalidate]);

  useEffect(() => {
    // Idle drift needs frames while nothing else is animating. Run at ~30fps,
    // only while the canvas is on screen, never under reduced motion or on touch layouts.
    if (!idle) return;
    let frame = 0, last = 0, visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(gl.domElement);
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (visible && !document.hidden && time - last > 33) { last = time; invalidate(); }
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [idle, gl, invalidate]);

  useFrame(() => {
    const count = layouts.length;
    if (!count) return;
    const seconds = performance.now() / 1000;
    const state = scroll.current;
    const open = clamp(1 - state.pull);
    const g = dwell(clamp(state.focus, 0, count - 1));
    const from = Math.min(Math.floor(g), Math.max(0, count - 2));
    const to = Math.min(from + 1, count - 1);
    const t = to === from ? 0 : g - from;
    const here = lerp3(layouts[from].corridor, layouts[to].corridor, t);
    const distance = lerp(layouts[from].distance, layouts[to].distance, t);
    const overviewZ = mobile ? 14 : size.width / size.height < 1.3 ? 19 : 16;
    const { px, py } = pointer.current;

    camera.position.set(
      lerp(0, here[0] + px, open),
      lerp(0, here[1] + py, open),
      lerp(overviewZ, here[2] + distance, open),
    );
    // A slight bank while crossing between sides gives the flight weight.
    const bank = Math.sin(t * Math.PI) * open * .05 * (from % 2 === 0 ? 1 : -1);
    camera.up.set(Math.sin(bank), Math.cos(bank), 0);
    camera.lookAt(here[0] * open * .96, here[1] * open * .96, here[2] * open);

    layouts.forEach((layout, i) => {
      const mesh = meshes.current[i];
      const weight = Math.max(0, 1 - Math.abs(i - g));
      const lift = hover(i);
      if (mesh) {
        const position = lerp3(layout.overview, layout.corridor, open);
        const drift = idle ? 1 : 0;
        mesh.position.set(
          position[0],
          position[1] + Math.sin(seconds * .55 + i * 1.7) * .13 * drift,
          position[2] + lift.v * .7,
        );
        mesh.scale.setScalar(1 + lift.v * .022);
        // The focused slide squares up to the camera; the rest keep their angle.
        const flatten = 1 - weight * open;
        const rotation = lerp3(layout.overviewRotation, layout.corridorRotation, open);
        mesh.rotation.set(
          rotation[0] * flatten + lift.ty * .11 * lift.v,
          rotation[1] * flatten + lift.tx * .15 * lift.v,
          rotation[2] * flatten + Math.sin(seconds * .4 + i * 2.3) * .011 * drift,
        );
      }
      const light = lerp(1, .32 + .68 * weight, open);
      materials.current[i]?.color.setRGB(light, light, light);
      // The focused slide's edge warms toward copper; the others stay graphite.
      borders.current[i]?.color.copy(EDGE).lerp(EDGE_FOCUS, weight * open);
    });
  });

  return <>
    <Dust length={corridorLength} spread={mobile ? 14 : 40} />
    {layouts.map((layout, i) => (
      <mesh key={layout.src} ref={(mesh) => { meshes.current[i] = mesh; }}
        position={layout.overview} rotation={layout.overviewRotation}
        onClick={(event) => { event.stopPropagation(); onSelect(i); }}
        onPointerOver={(event) => {
          event.stopPropagation();
          gl.domElement.style.cursor = "pointer";
          if (!idle) return;
          gsap.to(hover(i), { v: 1, duration: .45, ease: "power2.out", onUpdate: invalidate });
        }}
        onPointerMove={(event) => {
          if (!idle || !event.uv) return;
          gsap.to(hover(i), { tx: event.uv.x - .5, ty: .5 - event.uv.y, duration: .5, ease: "power2.out", overwrite: "auto", onUpdate: invalidate });
        }}
        onPointerOut={() => {
          gl.domElement.style.cursor = "";
          gsap.to(hover(i), { v: 0, tx: 0, ty: 0, duration: .6, ease: "power2.out", overwrite: "auto", onUpdate: invalidate });
        }}>
        <planeGeometry args={[layout.width, layout.height]} />
        <meshBasicMaterial ref={(material) => { materials.current[i] = material; }}
          map={textures[i] ?? null} color={textures[i] ? "white" : "#101012"} toneMapped={false} />
        <mesh position={[0, 0, -.012]} scale={[1.006, 1.01, 1]}>
          <planeGeometry args={[layout.width, layout.height]} />
          <meshBasicMaterial ref={(material) => { borders.current[i] = material; }} color="#424247" toneMapped={false} />
        </mesh>
        {/* Contact shadow: offset down and away, never part of hit testing. */}
        <mesh position={[layout.width * .035, -layout.height * .06, -.08]} scale={[1.22, 1.3, 1]} raycast={() => null}>
          <planeGeometry args={[layout.width, layout.height]} />
          <meshBasicMaterial map={shadow} transparent opacity={.75} depthWrite={false} toneMapped={false} />
        </mesh>
      </mesh>
    ))}
  </>;
}

export default function SpatialScene(props: SceneProps) {
  return <Canvas camera={{ position: [0, 0, 16], fov: 40, near: .1, far: 260 }}
    style={{ touchAction: "pan-y pinch-zoom" }}
    dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}>
    <Installation {...props} />
  </Canvas>;
}
