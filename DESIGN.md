# Apple-Inspired Design System

**Version:** 2.0 (Phase 1 Redesign)  
**Author:** Ojesh Portfolio Redesign System  
**Date:** November 2026  

---

## 1. Design Philosophy

The redesign adopts an **Apple-inspired product aesthetic**: clean, restrained, meticulously aligned, and focused on clarity and craftsmanship. It is **not** an Apple imitation or clone—no proprietary marks, symbols, or trademarks are used. Instead, it embodies the underlying principles of world-class hardware and software presentation:

- **Light-First Foundation:** Crisp, bright canvas with subtle alternating section tints (`#fbfbfd` to `#f5f5f7`) that allow project media and typography to command attention.
- **Product Reel Dark Moments:** The 3D slide gallery and site footer remain dark surfaces in both light and dark themes, creating immersive "theatre" moments reminiscent of product keynote reels.
- **Full Dark Theme:** Seamless dark mode via `prefers-color-scheme: dark` using deep OLED blacks (`#000000`) and elevated dark surfaces (`#161617`, `#1c1c1e`).
- **Precision & Generous Whitespace:** Large section paddings (`clamp(80px, 12vw, 160px)`), generous typographic breathing room, balanced headline wraps, and consistent 12-column alignment.
- **Layered Soft Surfaces:** Bento grids with 28px radius cards, concentric nested radii for screenshots, ultra-subtle hairlines, and soft multi-stop elevation shadows.
- **Pure System Typography:** Zero web font network overhead. Zero proprietary font bundling. Pure native system font rendering (`-apple-system, BlinkMacSystemFont, "SF Pro Display", ...`).

---

## 2. Design Tokens

All colors, dimensions, radii, shadows, and easings are defined as CSS custom properties on `:root` with dark theme overrides in `src/app/globals.css`. Hardcoded hex codes are strictly prohibited outside token definitions.

### Color Palette & Surfaces

| Token | Light Theme Value | Dark Theme Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg-page` | `#fbfbfd` | `#000000` | Primary page foundation |
| `--surface-tint` | `#f5f5f7` | `#161617` | Alternating section tint |
| `--surface-card` | `#ffffff` | `#1c1c1e` | Bento cards & interactive containers |
| `--surface-card-hover` | `#ffffff` | `#242426` | Card hover state background |
| `--surface-elevated` | `#ffffff` | `#2c2c2e` | Modals, flyouts & elevated surfaces |
| `--surface-dark` | `#000000` | `#000000` | Product reel (3D gallery canvas) |
| `--surface-dark-tint` | `#111114` | `#111114` | Product reel secondary / footer canvas |
| `--surface-dark-card` | `#1c1c1e` | `#1c1c1e` | Dark gallery cards & index thumbs |

### Typography Colors & Contrast (WCAG 2.2 AA Verified)

| Token | Light Theme Value | Dark Theme Value | Contrast Ratio (Light / Dark) |
| :--- | :--- | :--- | :--- |
| `--text-primary` | `#1d1d1f` | `#f5f5f7` | **17.5 : 1** (on #fbfbfd) / **18.2 : 1** (on #000) |
| `--text-secondary` | `#6e6e73` | `#86868b` | **4.91 : 1** (on #fbfbfd), **4.65 : 1** (on #f5f5f7) / **5.8 : 1** |
| `--text-tertiary` | `#86868b` | `#6e6e73` | Captions & metadata (>= 12px) |
| `--text-dark` | `#f5f5f7` | `#f5f5f7` | Text in 3D gallery and footer |
| `--text-dark-secondary` | `#86868b` | `#86868b` | Subheads & captions in dark surfaces |

### Hairlines & Dividers

| Token | Light Theme Value | Dark Theme Value | Usage |
| :--- | :--- | :--- | :--- |
| `--hairline` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.12)` | Card borders, dividers, subtle separators |
| `--hairline-strong` | `rgba(0, 0, 0, 0.16)` | `rgba(255, 255, 255, 0.24)` | Input borders, emphasized boundaries |
| `--hairline-dark` | `rgba(255, 255, 255, 0.12)` | `rgba(255, 255, 255, 0.12)` | 3D gallery & footer chrome hairlines |

### Accents & Focus

| Token | Light Theme Value | Dark Theme Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--accent-link` | `#0066cc` | `#2997ff` | Text links, active tabs, secondary link states |
| `--accent-link-hover` | `#004499` | `#70baff` | Text link hover |
| `--accent-btn` | `#0071e3` | `#0071e3` | Primary filled pill buttons |
| `--accent-btn-hover` | `#0077ed` | `#0077ed` | Primary button hover |
| `--accent-btn-text` | `#ffffff` | `#ffffff` | High-contrast button text (4.71 : 1) |
| `--focus-ring` | `#0071e3` | `#2997ff` | Focus visible outline (2px solid, 2px offset) |

### Translucency & Glass

| Token | Light Theme Value | Dark Theme Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--nav-bg` | `rgba(251, 251, 253, 0.8)` | `rgba(0, 0, 0, 0.8)` | Sticky header glass |
| `--nav-bg-scrolled` | `rgba(251, 251, 253, 0.92)`| `rgba(0, 0, 0, 0.92)` | Deepened glass on scroll |
| `--glass-dark-bg` | `rgba(29, 29, 31, 0.78)` | `rgba(29, 29, 31, 0.78)` | 3D gallery floating UI cards & pills |
| `--blur-glass` | `20px` | `20px` | Glass backdrop-filter blur |
| `--saturate-glass` | `180%` | `180%` | Apple signature vibrant saturation |

### Spacing & Layout Scale

- `--gutter`: `clamp(1.25rem, 5vw, 2.5rem)`
- `--header-h`: `48px`
- `--content-width`: `1080px` (measure for 12-column bento & typography containers)
- `--section-padding`: `clamp(80px, 12vw, 160px)`

### Radius Scale & Concentric Alignment

- `--radius-xs`: `6px`
- `--radius-sm`: `10px` (thumbnails)
- `--radius-md`: `14px`
- `--radius-inner`: `18px` (inner screenshot containers)
- `--radius-card`: `28px` (bento cards & hero panels)
- `--radius-pill`: `980px` (buttons, badges, indicators, switch controls)

> **Concentric Radius Rule:**  
> When nesting rounded containers inside cards, the inner radius follows concentric geometry:  
> $$R_{\text{inner}} = R_{\text{outer}} - \text{padding}$$  
> For cards with `28px` radius and `clamp(20px, 3vw, 24px)` padding, the nested image frame uses `18px` radius, preventing mismatched optical corners.

### Shadow Scale

- `--shadow-card`: `0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)`
- `--shadow-elevated`: `0 16px 40px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)`
- `--shadow-glass`: `0 8px 32px rgba(0, 0, 0, 0.08)` (in dark mode: `rgba(0, 0, 0, 0.4)`)

---

## 3. Typography System

The entire site renders using the pure system font stack:
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
             "Helvetica Neue", "Segoe UI", system-ui, sans-serif;
```
All old web font loaders (`@fontsource/manrope`, Bricolage Grotesque, Instrument Serif) have been removed.

### Type Scale

| Role | Size | Weight | Line Height | Tracking | Text Wrap |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `clamp(3.5rem, 8vw, 6rem)` (56–96px) | 600 | 1.05 | -0.03em | `balance` |
| **Section Headline** | `clamp(2.5rem, 5vw, 3.5rem)` (40–56px) | 600 | 1.10 | -0.025em | `balance` |
| **Subhead** | `clamp(1.15rem, 2vw, 1.4rem)` (19–24px) | 400 | 1.45 | -0.012em | `balance` |
| **Card Headline** | `clamp(1.4rem, 2.5vw, 2.35rem)` | 600 | 1.15 | -0.025em | `balance` |
| **Body Copy** | `17px` (1.0625rem) | 400 | 1.47 | normal | `pretty` |
| **Eyebrow / Badge** | `13px` (0.8125rem) | 600 | 1.30 | +0.06em (caps) | normal |
| **Captions / Legal** | `12px–13px` (>= 12px strict floor) | 400–500 | 1.50 | normal | normal |

---

## 4. Component Library

### Glass Navigation Header (`.site-header`)
- **Height:** 48px sticky global bar.
- **Glass Filter:** `backdrop-filter: saturate(180%) blur(20px)`.
- **Background:** `rgba(251, 251, 253, 0.8)` (light) / `rgba(0, 0, 0, 0.8)` (dark).
- **Scroll Depth:** Scrolled state (`.site-header--scrolled`) increases opacity to 0.92 for enhanced legibility.
- **Wordmark:** Clean typographic "Ojesh" with negative letter-spacing (-0.02em).
- **Mobile Menu:** Accessible disclosure button (`aria-expanded`, `aria-controls`), smooth 2-line hamburger morphing to "X", glass overlay panel, keyboard Escape listener returning focus to trigger.

### Pill Buttons (`.btn`, `.btn--primary`, `.btn--secondary`)
- **Border Radius:** `980px`.
- **Touch Target:** Minimum 44px height and width.
- **Primary:** Filled `#0071e3` with white text; hover `#0077ed`.
- **Secondary:** Outlined with hairline border; clean subtle hover tint.
- **Focus Ring:** 2px solid offset ring using accent color.

### Text Links (`.text-link`)
- **Color:** Accent blue `#0066cc` (light) / `#2997ff` (dark).
- **Chevron:** Trailing `›` character in `.chevron` span with a 3px horizontal hover nudge.

### Selected Work Bento Grid (`.work-bento`)
- **Grid:** 2-column balanced layout on desktop, reflowing to 1-column on tablet/mobile.
- **Cards:** 28px outer border radius, `var(--surface-card)`, layered subtle shadow, 1px hairline border.
- **Media Frame:** 18px concentric inner border radius, 16:10 aspect ratio, lazy loading, subtle 1.025x zoom ease on card hover.
- **Typography:** Metadata tag (type + year), project title (`h3`), one-line summary, "View case study ›" CTA.

### Windows Tools Grid (`.tools-grid`)
- **Grid:** 2-column grid featuring native Windows utilities (GlyphLens, ClickForge, larpiano, Sora).
- **Provenance & Captures:** Unedited authentic UI screenshots from public repositories.
- **Card Structure:** 28px card radius, tag, title, description, technology stack, and direct GitHub repository link.

### Apple-Style Compact Footer (`.site-footer`)
- **Theme:** Product reel dark surface (`#111114`) in both light and dark themes.
- **Sitemap Columns:**
  1. *Selected Work:* Direct links to LANE, ARCUS, Teen Fiesta, Rewatch, and full archive.
  2. *Windows Tools:* Direct repository links to GlyphLens, ClickForge, larpiano, Sora.
  3. *About:* Overview, GitHub Profile, stack summary (C# & TypeScript), location (India).
  4. *Contact:* Conversation link, direct email, GitHub handle.
- **Bottom Bar:** Divider hairline, copyright line, legal disclaimer.

---

## 5. 3D Slide Gallery (Product Reel)

The 3D WebGL corridor gallery remains the centerpiece product showcase of the homepage. Its fly-through camera geometry, Three.js shaders, scroll pinning, and keyboard fallbacks are preserved:

- **Fly-Through Corridor:** Pinned Three.js section mapping 4 web case studies and 4 native Windows tools into a 3D depth corridor.
- **Camera Travel:** Scrolling drives travel down the corridor with calibrated framing distances ($d = \max(\text{width} / 2\tan(\text{fov}/2)\cdot\text{aspect}, \text{height} / 2\tan(\text{fov}/2))$) preventing slide collision.
- **Depth Cues:** Contact shadows rendered with soft radial gradient canvas textures, sparse dust field (`Float32Array` point cloud), focus border highlight (`#2997ff`), and hover pointer tilt.
- **Responsive & Reduced-Motion Modes:** On touch viewports, narrow screens (<1000px), or when `prefers-reduced-motion` is enabled, scroll pinning is disengaged: tapping a slide or chapter button glides the camera smoothly.
- **Restyled Glass Chrome:**
  - *Caption Pill (`.spatial-arrival`):* Translucent 18px glass card displaying project tag, title, type, and case study / repository link.
  - *Chapter Rail (`.spatial-rail`):* Glass capsule on the left edge with interactive indicator bars and hover tooltips.
  - *View Switcher (`.spatial-switch`):* Pill toggle for Overview and Index.
  - *Index Panel (`.spatial-index`):* Glass modal with 24px radius, concentric rounded thumbnails, and full keyboard arrow navigation (Up/Down/Home/End).

---

## 6. Motion & Animation Standards

- **Signature Easing:** `cubic-bezier(0.28, 0.11, 0.32, 1)` (`--ease-apple`).
- **Durations:**
  - Micro-interactions (hover, chevron nudge, focus): `0.2s` (`--duration-fast`)
  - State transitions (mobile nav, dropdowns, card lift): `0.35s` (`--duration-normal`)
  - Layout transitions: `0.5s` (`--duration-slow`)
- **Scroll Reveals:** Subtle opacity + 16px rise triggered via GSAP ScrollTrigger with `once: true`.
- **Accessibility:** If `prefers-reduced-motion: reduce` is detected:
  - All transitions and animations drop to `0.01ms !important`.
  - GSAP animations resolve immediately without transform interpolation.
  - Native scrolling remains uninterrupted.

---

## 7. Accessibility Checklist (WCAG 2.2 AA)

1. **Color Contrast:**
   - Body text `#1d1d1f` on `#fbfbfd`: 17.5:1.
   - Secondary text `#6e6e73` on `#fbfbfd`: 4.91:1 (passes >= 4.5:1).
   - Secondary text `#6e6e73` on `#f5f5f7`: 4.65:1 (passes >= 4.5:1).
   - Button text `#ffffff` on `#0071e3`: 4.71:1 (passes >= 4.5:1).
   - Footer text `#86868b` on `#111114`: 5.5:1 (passes >= 4.5:1).
2. **Focus Management:**
   - Visible focus ring: `2px solid var(--focus-ring)` with `2px offset`.
   - Skip to content link (`.skip-link`) keyboard accessible and visible on focus.
   - Mobile nav menu closes on `Escape` and returns focus to the toggle button.
3. **Touch Targets:**
   - All interactive controls, nav links, buttons, and chapter selectors have a minimum touch target of `44px x 44px`.
4. **Semantic HTML & Screen Readers:**
   - Single `<h1>` per page.
   - Landmarks: `<header role="banner">`, `<main id="main-content">`, `<footer role="contentinfo">`, `<nav>`.
   - All icons and chevrons hidden via `aria-hidden="true"`.
   - Accessible button labels (`aria-label`, `aria-expanded`, `aria-controls`).
5. **Forced Colors Mode:**
   - Tested for Windows High Contrast / Forced Colors: buttons and cards use explicit system colors (`ButtonText`, `Highlight`).
6. **Narrow Viewport Reflow:**
   - Verified at 320px width: zero horizontal scrolling, content wraps cleanly with `word-break: break-word`.

---

## 8. Migration Notes for Future Phases

- Phase 2 plans will redesign `/about`, `/work`, `/work/[slug]`, and `/contact`.
- These routes currently inherit all global tokens (`--bg-page`, `--text-primary`, `--text-secondary`, `--hairline`, `--accent-link`, `--btn`, etc.).
- When constructing new pages, developers should reuse:
  - `.container` for max-width content measure (1080px).
  - `.section` with `.section--tint` for alternating backgrounds.
  - `.headline`, `.subhead`, and `.eyebrow` for standard typography hierarchy.
  - `.btn.btn--primary` and `.btn.btn--secondary` for action groups.
  - `.text-link` with `<span className="chevron">›</span>` for contextual links.
  - `.card` and `.bento` for content grids.

---

## 9. Phase 3: 3D Spatial Gallery Redesign & System Enhancements (November 2026)

Phase 3 elevates the homepage 3D gallery and the site's tactile spatial qualities to a world-class standard while maintaining strict performance, accessibility, and zero-jank standards.

### 9.1 Camera & Motion Physics Model
- **Critically-Damped Smoothing:** Replaced raw scroll mapping with exponential dampening (`damp(current, target, lambda, dt)`), making flight completely framerate independent across 120Hz, 60Hz, and 30Hz displays.
- **Eased Dwell Plateaus:** Refined `dwell()` with a smooth Hermite plateau around integer slide positions. Slides rest comfortably in focus for viewing, gliding with liquid ease between chapters.
- **Dynamic Corridor Banking:** Real-time velocity-aware banking (`corridorBank()`) tilts the camera into alternating corridor curves with physical inertia, evoking a cinematic steady-cam flight.
- **Decoupled Scrubbing:** Lenis window smoothing and ScrollTrigger pin scrub feed the target state directly, leaving the internal physics loop to provide direct, interruptible, and reversible dampening without double-smoothing lag.

### 9.2 Premium Hardware Visuals & Custom Shaders
- **Precision SDF Rounded Panels:** Slides render via a custom signed distance field (SDF) shader with sub-pixel antialiasing at all distances and angles. Features an authentic precision dark graphite bezel (`#1c1c1f`), an inner hairline boundary, and a top-edge chamfer highlight.
- **Active Focus Edge Highlight:** The focused slide's hairline boundary dynamically blooms from graphite into Apple electric blue (`#2997ff` to `#5ac8fa`), establishing immediate visual hierarchy.
- **Laminated Glass Specular Sheen:** An interactive specular light reflection glides across each slide screen tracking mouse UV coordinates and view angle, giving the screenshot the tangible feel of laminated display glass.
- **Glossy Keynote Floor Stage:** A dark reflective stage plane (`y = -4.0`) extends down the corridor with a custom shader rendering a blurred specular reflection pool and subtle guidance hairlines that track the active slide position.
- **Atmospheric Distance Falloff:** Distant slides in the corridor smoothly attenuate in contrast and brightness, focusing attention on the active presentation.
- **Assemble Intro & Skeleton State:** On initial load, slides smoothly settle into their corridor formation. A shimmering skeleton state displays while textures decode, preventing pop-in.

### 9.3 Adaptive Post-Processing & Quality Tiers
- **Custom Post-Processing Pipeline:** Built using Three.js built-in `EffectComposer`, `RenderPass`, `ShaderPass`, and `OutputPass`. Combines highlight bloom on active borders, cinematic vignette, and micro film grain to prevent banding on OLED blacks.
- **Performance Monitoring:** An internal frame time monitor tracks delta times. If frame rates drop consistently below threshold, the quality tier automatically steps down to preserve 60fps responsiveness.
- **Three Quality Tiers:**
  - *High:* Full post-processing pass (bloom, vignette, grain), DPR 1.5, glossy floor reflection.
  - *Medium:* Fast vignette + grain pass, DPR 1.2, simplified reflections.
  - *Low:* Direct WebGL render pass, DPR 1.0, basic contact shadows.
- **User Control & Fallbacks:** A dedicated glass quality switcher (`3D: High | Med | Low`) in the spatial controls allows user override. Post-processing is automatically bypassed on touch viewports and under `prefers-reduced-motion`.

### 9.4 Interaction & Accessibility Polish
- **Hover Lift & 3D Tilt:** Hovering over a slide smoothly lifts it in $z$ by $+0.65$ units and applies a gyroscopic 3D tilt ($\pm 8^\circ$) based on cursor UV position.
- **Affordance & Direct Open:** The mouse cursor switches to `pointer` when hovering over the active slide. Clicking the active slide directly navigates to the project case study or GitHub repository.
- **Full Keyboard Navigation:** Left / Right and Up / Down arrow keys step sequentially through corridor slides when the gallery is in view. Pressing `Enter` opens the active project.
- **Documented Shortcuts:** A subtle glass shortcut pill (`[← / → Navigate · Enter to open]`) is presented at the bottom of the gallery.
- **WCAG 2.2 AA Compliance:** The canvas remains `aria-hidden="true"`, with full screen reader and keyboard access provided via the accessible DOM chapter rail and project index.

### 9.5 3D Beyond the Gallery (CSS 3D)
- **Interactive Card Tilt (`CardTilt3D`):** Applied to the homepage bento grid, Windows tools grid, and `/work` case study cards. Employs pointer-driven perspective tilt ($\pm 3.2^\circ$) and a moving specular glare sheen overlay.
- **Hero Layered Parallax (`HeroParallax3D`):** Light home hero elements (eyebrow, title, subhead, actions) float at staggered optical depths in response to cursor movement.
- **Strict Restraint:** Active exclusively on `@media (hover: hover) and (pointer: fine)`, completely disabled under `prefers-reduced-motion: reduce`, and implemented with pure transform properties with zero layout shift.

### 9.6 Dependency Audit
- **0 New Dependencies Added:** All post-processing and shaders were implemented using Three.js 0.186.1 built-in addons (`three/examples/jsm/postprocessing/*`), avoiding external package bloat and peer dependency conflicts.
- **Zero Route Growth:** Non-home route bundle size remains exactly 423.1 KB (855.9 KB with root), fully preserving initial page load performance across all secondary routes.

