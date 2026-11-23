"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  Color,
  Mesh,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import type { RefObject } from "react";
import type { SceneItem } from "@/lib/scene";
import { clamp, corridorBank, damp, dwell } from "@/lib/scene-math";
import type { QualityTier, SceneScroll } from "@/lib/scene-math";

type Vec3 = [number, number, number];

type Layout = {
  width: number;
  height: number;
  distance: number;
  src: string;
  aspect: number;
  overview: Vec3;
  corridor: Vec3;
  overviewRotation: Vec3;
  corridorRotation: Vec3;
};

type HoverState = {
  v: number;
  tx: number;
  ty: number;
};

type SceneProps = {
  items: SceneItem[];
  selected: number | null;
  reduced: boolean;
  driven: boolean;
  scroll: RefObject<SceneScroll>;
  onInvalidate: (callback: (() => void) | null) => void;
  onSelect: (index: number) => void;
  onReady: () => void;
  onLoading: () => void;
  qualityTier?: QualityTier;
  onQualityChange?: (tier: QualityTier) => void;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

const HALF_FOV = Math.tan((20 * Math.PI) / 180);
const LIFT = [0.6, -0.5, 0.9, -0.2, 0.5, -0.8, 0.3, -0.4, 0.7, -0.3];

// Vertex shader shared by panel screens
const PANEL_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vViewPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Precision rounded panel shader with chamfered bezel, hairline edge highlight,
// glass specular sheen, and distance depth falloff.
const PANEL_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform bool uHasTexture;
  uniform vec2 uSize;
  uniform float uRadius;
  uniform float uBezelWidth;
  uniform vec3 uBezelColor;
  uniform vec3 uBorderColor;
  uniform float uBorderWidth;
  uniform float uActiveWeight;
  uniform float uHover;
  uniform vec2 uPointer;
  uniform float uDistanceFalloff;
  uniform float uIntroProgress;

  varying vec2 vUv;
  varying vec3 vViewPosition;
  varying vec3 vNormal;

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  void main() {
    vec2 halfSize = uSize * 0.5;
    vec2 p = (vUv - 0.5) * uSize;

    // Outer panel outline
    float dOuter = roundedBoxSDF(p, halfSize, uRadius);
    float aa = fwidth(dOuter);
    float outerMask = smoothstep(aa, -aa, dOuter);
    if (outerMask <= 0.002) {
      discard;
    }

    // Inner screen aperture
    vec2 innerHalf = halfSize - vec2(uBezelWidth);
    float innerRadius = max(0.01, uRadius - uBezelWidth);
    float dInner = roundedBoxSDF(p, innerHalf, innerRadius);
    float innerMask = smoothstep(aa, -aa, dInner);

    // Hairline boundary
    float borderDist = abs(dInner);
    float borderMask = smoothstep(uBorderWidth + aa, uBorderWidth - aa, borderDist);

    // Screenshot texture sample
    vec4 screenTex = vec4(0.065, 0.065, 0.075, 1.0);
    if (uHasTexture) {
      vec2 screenUv = (p / (innerHalf * 2.0)) + 0.5;
      screenUv = clamp(screenUv, 0.0, 1.0);
      screenTex = texture2D(uTexture, screenUv);
    } else {
      // Shimmer skeleton during initial decode
      float shimmer = sin((p.x + p.y) * 3.5 - uHover * 4.0) * 0.04;
      screenTex.rgb += vec3(shimmer);
    }

    // Dynamic glass specular glare tracking pointer
    vec2 glarePos = uPointer * innerHalf * 0.85;
    float glareDist = length(p - glarePos);
    float glare = exp(-glareDist * glareDist / (innerHalf.y * innerHalf.y * 1.5)) * 0.17 * (1.0 + uHover * 0.4);

    // Diagonal ambient sheen
    float linearSheen = smoothstep(-innerHalf.y, innerHalf.y, p.y + p.x * 0.28) * 0.055;

    vec3 screenColor = screenTex.rgb + vec3(glare + linearSheen);

    // Bezel chamfer highlight
    float topHighlight = smoothstep(-halfSize.y, halfSize.y, p.y) * 0.12;
    vec3 bezelCol = uBezelColor + vec3(topHighlight);

    // Active slide transitions from graphite to electric blue highlight
    vec3 activeBorderColor = vec3(0.16, 0.59, 1.0);
    vec3 borderCol = mix(uBorderColor, activeBorderColor, uActiveWeight);

    vec3 col = mix(bezelCol, screenColor, innerMask);
    col = mix(col, borderCol, borderMask * (0.65 + 0.35 * uActiveWeight));

    // Distance-based atmospheric falloff
    col *= uDistanceFalloff * uIntroProgress;

    gl_FragColor = vec4(col, outerMask * uIntroProgress);
  }
`;

// Floor stage shader: deep OLED black with subtle specular reflection of the corridor
const FLOOR_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const FLOOR_FRAGMENT_SHADER = /* glsl */ `
  uniform float uActiveZ;
  uniform float uActiveX;
  uniform float uCorridorLength;
  uniform float uIntroProgress;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    // Base floor tone
    vec3 floorColor = vec3(0.015, 0.015, 0.022);

    // Longitudinal and lateral fade
    float xFade = smoothstep(24.0, 5.0, abs(vWorldPos.x));
    float zFade = smoothstep(-uCorridorLength - 25.0, -uCorridorLength + 5.0, vWorldPos.z) *
                  smoothstep(18.0, 6.0, vWorldPos.z);

    // Reflection pool under active slide
    float activeDist = length(vec2(vWorldPos.x - uActiveX, vWorldPos.z - uActiveZ));
    float reflectionGlow = exp(-activeDist * activeDist / 34.0) * 0.18;

    // Subtle blue accent in the reflection pool
    vec3 reflectionColor = vec3(0.12, 0.40, 0.85) * reflectionGlow;

    // Subtle runway guidance lines
    float gridLine = abs(fract(vWorldPos.x * 0.35) - 0.5);
    float grid = smoothstep(0.485, 0.495, gridLine) * 0.022;

    vec3 col = (floorColor + reflectionColor + vec3(grid)) * (xFade * zFade * uIntroProgress);
    gl_FragColor = vec4(col, xFade * zFade * 0.88 * uIntroProgress);
  }
`;

// Adaptive post-processing shader: subtle highlight bloom, cinema vignette, film micro-grain
const POST_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new Vector2(1, 1) },
    uTime: { value: 0 },
    uBloomIntensity: { value: 0.12 },
    uVignetteIntensity: { value: 0.28 },
    uGrainIntensity: { value: 0.012 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uBloomIntensity;
    uniform float uVignetteIntensity;
    uniform float uGrainIntensity;
    varying vec2 vUv;

    void main() {
      vec4 base = texture2D(tDiffuse, vUv);

      // Light bloom sampling surrounding texels
      vec2 texel = 1.0 / uResolution;
      vec3 bloom = vec3(0.0);
      bloom += max(vec3(0.0), texture2D(tDiffuse, vUv + texel * vec2(1.5, 1.5)).rgb - 0.55);
      bloom += max(vec3(0.0), texture2D(tDiffuse, vUv + texel * vec2(-1.5, -1.5)).rgb - 0.55);
      bloom += max(vec3(0.0), texture2D(tDiffuse, vUv + texel * vec2(-1.5, 1.5)).rgb - 0.55);
      bloom += max(vec3(0.0), texture2D(tDiffuse, vUv + texel * vec2(1.5, -1.5)).rgb - 0.55);
      bloom *= 0.25 * uBloomIntensity;

      // Cinema vignette
      vec2 uvCenter = vUv - 0.5;
      float dist = length(uvCenter);
      float vig = smoothstep(0.85, 0.32, dist);
      vec3 col = (base.rgb + bloom) * mix(1.0, vig, uVignetteIntensity);

      // Micro film grain to eliminate dark gradient banding
      float grain = (fract(sin(dot(vUv * 500.0 + uTime * 0.1, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * uGrainIntensity;
      col += grain;

      gl_FragColor = vec4(col, base.a);
    }
  `,
};

function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,0.85)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0.32)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Luminous dust motes floating along the corridor with soft depth attenuation */
function AtmosphericDust({ length, spread }: { length: number; spread: number }) {
  const { positions, scales } = useMemo(() => {
    let seed = 42;
    const next = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const count = Math.round(length * 8);
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (next() - 0.5) * spread;
      pos[i * 3 + 1] = (next() - 0.5) * 16;
      pos[i * 3 + 2] = 12 - next() * (length + 32);
      scl[i] = 0.04 + next() * 0.05;
    }
    return { positions: pos, scales: scl };
  }, [length, spread]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[scales, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e5e5ed"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.35}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/** Post-processing pass manager */
function PostProcessingEffect({ tier }: { tier: QualityTier }) {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer | null>(null);
  const pass = useRef<ShaderPass | null>(null);

  const active = tier === "high";

  useEffect(() => {
    if (!active) {
      if (composer.current) {
        composer.current.dispose();
        composer.current = null;
      }
      return;
    }

    const comp = new EffectComposer(gl);
    comp.setSize(size.width, size.height);
    comp.setPixelRatio(gl.getPixelRatio());

    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    const shaderPass = new ShaderPass(POST_SHADER);
    shaderPass.uniforms.uResolution.value.set(size.width, size.height);
    comp.addPass(shaderPass);
    pass.current = shaderPass;

    const outputPass = new OutputPass();
    comp.addPass(outputPass);

    composer.current = comp;

    return () => {
      comp.dispose();
      composer.current = null;
    };
  }, [gl, scene, camera, active, size.width, size.height]);

  useFrame((state) => {
    if (active && composer.current) {
      if (pass.current) {
        pass.current.uniforms.uTime.value = state.clock.getElapsedTime();
      }
      composer.current.render();
    } else {
      gl.render(scene, camera);
    }
  }, 1);

  return null;
}

function Installation({
  items,
  selected,
  reduced,
  driven,
  scroll,
  onInvalidate,
  onSelect,
  onReady,
  onLoading,
  qualityTier = "high",
  onQualityChange,
}: SceneProps) {
  const { size, camera, gl, invalidate } = useThree();
  const mobile = size.width < 760 || size.width / size.height < 0.95;
  const meshes = useRef<(Mesh | null)[]>([]);
  const materials = useRef<(ShaderMaterial | null)[]>([]);
  const floorMaterial = useRef<ShaderMaterial | null>(null);
  const hovers = useRef<HoverState[]>([]);
  const [textures, setTextures] = useState<(Texture | null)[]>([]);

  // Physics & smoothing refs
  const smoothedPull = useRef(scroll.current.pull);
  const smoothedFocus = useRef(scroll.current.focus);
  const targetPointer = useRef({ px: 0, py: 0 });
  const smoothedPointer = useRef({ px: 0, py: 0 });
  const introProgress = useRef(0);
  const frameTimes = useRef<number[]>([]);
  const currentTier = useRef<QualityTier>(qualityTier);

  const shadow = useMemo(() => createShadowTexture(), []);
  const idle = !reduced && !mobile;
  const hover = (index: number) => (hovers.current[index] ??= { v: 0, tx: 0, ty: 0 });

  const viewAspect = size.width / size.height;

  const layouts = useMemo<Layout[]>(() => {
    const sized = items.map((item) => {
      const width = Math.min(mobile ? 4.7 : 8.2, (mobile ? 3.2 : 5.3) * item.image.aspect);
      const height = width / item.image.aspect;
      const distance =
        Math.max(width / (2 * HALF_FOV * viewAspect * 0.76), height / (2 * HALF_FOV * 0.64)) + 0.5;
      return { item, width, height, distance };
    });

    const step = Math.max(mobile ? 9.5 : 13.5, Math.max(...sized.map((e) => e.distance)) + 5.2);

    return sized.map(({ item, width, height, distance }, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const lift = LIFT[i % LIFT.length] * (mobile ? 0.6 : 1);
      const tail = Math.max(0, i - 3);
      const overview: Vec3 = mobile
        ? ((i < 4
            ? [
                [-0.7, -2.55, 1.4],
                [0.45, -0.8, 0.2],
                [-0.25, 0.95, -0.9],
                [0.65, 2.6, -2],
              ][i]
            : [0.4, 2.6 + tail * 1.7, -2 - tail * 1.4]) as Vec3)
        : ((i < 4
            ? [
                [-4, -2, -0.3],
                [-0.65, -0.25, 0.4],
                [1.8, 1.1, -0.8],
                [4.6, 3.35, -2.3],
              ][i]
            : [4.6 + tail * 2.8, 3.35 + tail * 2.1, -2.3 - tail * 1.4]) as Vec3);

      return {
        width,
        height,
        distance,
        src: item.image.src,
        aspect: item.image.aspect,
        overview,
        corridor: [side * (mobile ? 1.1 : 3.4), lift, -i * step],
        overviewRotation: mobile ? [0.03, -0.22, -0.1] : [0.05, -0.38, -0.12],
        corridorRotation: [0.03, -side * (mobile ? 0.2 : 0.3), -side * 0.035],
      };
    });
  }, [items, mobile, viewAspect]);

  const corridorLength = Math.abs(layouts[layouts.length - 1]?.corridor[2] ?? 0);

  // Intro settle animation
  useEffect(() => {
    const tween = gsap.to(introProgress, {
      current: 1,
      duration: reduced ? 0 : 1.2,
      ease: "power3.out",
      onUpdate: invalidate,
    });
    return () => {
      tween.kill();
    };
  }, [reduced, invalidate]);

  useEffect(() => () => shadow.dispose(), [shadow]);

  useEffect(() => {
    onInvalidate(invalidate);
    invalidate();
    return () => onInvalidate(null);
  }, [onInvalidate, invalidate]);

  // Texture preloading
  useEffect(() => {
    let cancelled = false;
    onLoading();
    const bank: (Texture | null)[] = items.map(() => null);
    let pending = items.length;
    const loader = new TextureLoader();

    items.forEach((item, i) => {
      loader.load(
        item.image.src,
        (texture) => {
          if (cancelled) {
            texture.dispose();
            return;
          }
          texture.colorSpace = SRGBColorSpace;
          texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
          bank[i] = texture;
          if (--pending === 0) {
            setTextures([...bank]);
            invalidate();
          }
        },
        undefined,
        () => {
          if (--pending === 0 && !cancelled) {
            setTextures([...bank]);
            invalidate();
          }
        },
      );
    });

    return () => {
      cancelled = true;
      bank.forEach((t) => t?.dispose());
    };
  }, [items, gl, invalidate, onLoading]);

  useEffect(() => {
    materials.current.forEach((mat, i) => {
      if (mat && textures[i]) {
        mat.uniforms.uTexture.value = textures[i];
        mat.uniforms.uHasTexture.value = true;
        mat.needsUpdate = true;
      }
    });
    invalidate();
    if (textures.length === items.length && textures.every(Boolean)) {
      onReady();
    }
  }, [textures, items.length, invalidate, onReady]);

  // Non-driven slide flight
  useEffect(() => {
    if (driven) return;
    const state = scroll.current;
    const tween = gsap.to(state, {
      pull: selected === null ? 1 : 0,
      focus: selected ?? state.focus,
      duration: reduced ? 0 : 1.1,
      ease: "power3.inOut",
      onUpdate: invalidate,
    });
    invalidate();
    return () => {
      tween.kill();
    };
  }, [driven, selected, reduced, scroll, invalidate]);

  // Pointer tracking
  useEffect(() => {
    const element = gl.domElement;
    const values = targetPointer.current;

    const move = (event: PointerEvent) => {
      if (reduced || mobile || event.pointerType !== "mouse") return;
      const bounds = element.getBoundingClientRect();
      values.px = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.65;
      values.py = -((event.clientY - bounds.top) / bounds.height - 0.5) * 0.45;
      invalidate();
    };

    const leave = () => {
      values.px = 0;
      values.py = 0;
      invalidate();
    };

    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.style.cursor = "";
    };
  }, [gl, reduced, mobile, invalidate]);

  // Idle drift loop (Intersection-observed)
  useEffect(() => {
    if (!idle) return;
    let frame = 0;
    let last = 0;
    let visible = true;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(gl.domElement);

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (visible && !document.hidden && time - last > 30) {
        last = time;
        invalidate();
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [idle, gl, invalidate]);

  // Render & physics loop
  useFrame((_, delta) => {
    const count = layouts.length;
    if (!count) return;

    // Constrain delta to prevent spikes after backgrounding
    const dt = clamp(delta, 0.001, 0.1);
    const seconds = performance.now() / 1000;

    // Performance tracking & automatic tier fallback
    const times = frameTimes.current;
    times.push(dt);
    if (times.length > 35) {
      times.shift();
      const avgDt = times.reduce((a, b) => a + b, 0) / times.length;
      if (avgDt > 0.032 && currentTier.current === "high") {
        currentTier.current = "medium";
        onQualityChange?.("medium");
      }
    }

    // Critically-damped smoothing towards target scroll values
    const targetState = scroll.current;
    smoothedPull.current = damp(smoothedPull.current, targetState.pull, 9.5, dt);
    smoothedFocus.current = damp(smoothedFocus.current, targetState.focus, 9.0, dt);

    // Damped pointer parallax
    smoothedPointer.current.px = damp(smoothedPointer.current.px, targetPointer.current.px, 6.5, dt);
    smoothedPointer.current.py = damp(smoothedPointer.current.py, targetPointer.current.py, 6.5, dt);

    const open = clamp(1 - smoothedPull.current);
    const g = dwell(clamp(smoothedFocus.current, 0, count - 1));
    const from = Math.min(Math.floor(g), Math.max(0, count - 2));
    const to = Math.min(from + 1, count - 1);
    const t = to === from ? 0 : g - from;

    const here = lerp3(layouts[from].corridor, layouts[to].corridor, t);
    const distance = lerp(layouts[from].distance, layouts[to].distance, t);
    const overviewZ = mobile ? 14 : size.width / size.height < 1.3 ? 19 : 16;

    const { px, py } = smoothedPointer.current;

    // Velocity-aware banking
    const velocity = (targetState.focus - smoothedFocus.current) / dt;
    const bank = corridorBank(t, from, velocity) * open;

    camera.position.set(
      lerp(0, here[0] + px, open),
      lerp(0, here[1] + py, open),
      lerp(overviewZ, here[2] + distance, open),
    );
    camera.up.set(Math.sin(bank), Math.cos(bank), 0);
    camera.lookAt(
      here[0] * open * 0.96 + px * 0.25,
      here[1] * open * 0.96 + py * 0.25,
      here[2] * open,
    );

    // Update floor reflection tracking
    if (floorMaterial.current) {
      floorMaterial.current.uniforms.uActiveX.value = here[0] * open;
      floorMaterial.current.uniforms.uActiveZ.value = here[2] * open;
      floorMaterial.current.uniforms.uIntroProgress.value = introProgress.current;
    }

    // Update slides
    layouts.forEach((layout, i) => {
      const mesh = meshes.current[i];
      const mat = materials.current[i];
      const weight = Math.max(0, 1 - Math.abs(i - g));
      const lift = hover(i);

      if (mesh) {
        const position = lerp3(layout.overview, layout.corridor, open);
        const drift = idle ? 1 : 0;
        mesh.position.set(
          position[0],
          position[1] + Math.sin(seconds * 0.55 + i * 1.7) * 0.12 * drift,
          position[2] + lift.v * 0.65,
        );
        mesh.scale.setScalar(1 + lift.v * 0.024);

        const flatten = 1 - weight * open;
        const rotation = lerp3(layout.overviewRotation, layout.corridorRotation, open);
        mesh.rotation.set(
          rotation[0] * flatten + lift.ty * 0.12 * lift.v,
          rotation[1] * flatten + lift.tx * 0.15 * lift.v,
          rotation[2] * flatten + Math.sin(seconds * 0.4 + i * 2.3) * 0.01 * drift,
        );
      }

      if (mat) {
        mat.uniforms.uActiveWeight.value = weight * open;
        mat.uniforms.uHover.value = lift.v;
        mat.uniforms.uPointer.value.set(lift.tx, lift.ty);
        mat.uniforms.uIntroProgress.value = introProgress.current;

        // Depth falloff for distant slides
        const distFromCam = Math.abs(i - g);
        const falloff = clamp(1.0 - (distFromCam - 1.2) * 0.28, 0.25, 1.0);
        mat.uniforms.uDistanceFalloff.value = falloff;
      }
    });
  });

  return (
    <>
      <AtmosphericDust length={corridorLength} spread={mobile ? 14 : 42} />

      {/* Reflective floor stage underneath the corridor */}
      <mesh position={[0, -4.0, -corridorLength * 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[mobile ? 28 : 56, corridorLength + 40]} />
        <shaderMaterial
          ref={(m) => {
            floorMaterial.current = m;
          }}
          vertexShader={FLOOR_VERTEX_SHADER}
          fragmentShader={FLOOR_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          uniforms={{
            uActiveZ: { value: 0 },
            uActiveX: { value: 0 },
            uCorridorLength: { value: corridorLength },
            uIntroProgress: { value: 1.0 },
          }}
        />
      </mesh>

      {/* Slide panels */}
      {layouts.map((layout, i) => (
        <mesh
          key={layout.src}
          ref={(mesh) => {
            meshes.current[i] = mesh;
          }}
          position={layout.overview}
          rotation={layout.overviewRotation}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(i);
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            gl.domElement.style.cursor = "pointer";
            if (!idle) return;
            gsap.to(hover(i), { v: 1, duration: 0.4, ease: "power2.out", onUpdate: invalidate });
          }}
          onPointerMove={(event) => {
            if (!idle || !event.uv) return;
            gsap.to(hover(i), {
              tx: event.uv.x - 0.5,
              ty: 0.5 - event.uv.y,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
              onUpdate: invalidate,
            });
          }}
          onPointerOut={() => {
            gl.domElement.style.cursor = "";
            gsap.to(hover(i), {
              v: 0,
              tx: 0,
              ty: 0,
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
              onUpdate: invalidate,
            });
          }}
        >
          <planeGeometry args={[layout.width, layout.height]} />
          <shaderMaterial
            ref={(material) => {
              materials.current[i] = material;
            }}
            transparent
            vertexShader={PANEL_VERTEX_SHADER}
            fragmentShader={PANEL_FRAGMENT_SHADER}
            uniforms={{
              uTexture: { value: textures[i] ?? null },
              uHasTexture: { value: Boolean(textures[i]) },
              uSize: { value: new Vector2(layout.width, layout.height) },
              uRadius: { value: Math.min(0.24, layout.height * 0.055) },
              uBezelWidth: { value: 0.045 },
              uBezelColor: { value: new Color("#1c1c1f") },
              uBorderColor: { value: new Color("#424247") },
              uBorderWidth: { value: 0.014 },
              uActiveWeight: { value: 0 },
              uHover: { value: 0 },
              uPointer: { value: new Vector2(0, 0) },
              uDistanceFalloff: { value: 1.0 },
              uIntroProgress: { value: 1.0 },
            }}
          />

          {/* Backplate physical slab thickness */}
          <mesh position={[0, 0, -0.022]} scale={[1.002, 1.002, 1]}>
            <planeGeometry args={[layout.width, layout.height]} />
            <meshBasicMaterial color="#161619" toneMapped={false} />
          </mesh>

          {/* Directional contact shadow below */}
          <mesh
            position={[layout.width * 0.03, -layout.height * 0.065, -0.08]}
            scale={[1.24, 1.32, 1]}
            raycast={() => null}
          >
            <planeGeometry args={[layout.width, layout.height]} />
            <meshBasicMaterial
              map={shadow}
              transparent
              opacity={0.72}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </mesh>
      ))}

      {/* Adaptive post-processing */}
      <PostProcessingEffect tier={qualityTier} />
    </>
  );
}

export default function SpatialScene(props: SceneProps) {
  const isTouchOrReduced = props.reduced;
  const dpr: [number, number] = props.qualityTier === "high" ? [1, 1.5] : [1, 1.2];

  return (
    <Canvas
      camera={{ position: [0, 0, 16], fov: 40, near: 0.1, far: 280 }}
      style={{ touchAction: "pan-y pinch-zoom" }}
      dpr={dpr}
      frameloop={isTouchOrReduced ? "demand" : "always"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: props.qualityTier === "high" ? "high-performance" : "low-power",
      }}
    >
      <Installation {...props} />
    </Canvas>
  );
}
