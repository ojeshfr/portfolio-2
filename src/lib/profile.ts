// Public GitHub profile (github.com/ojeshfr), profile README and repository READMEs, checked 2026-11-22.
// Source URLs and attribution limits: qa/profile-refresh-2026-11-22/README.md.
export const profile = {
  handle: "ojeshfr",
  location: "India",
  introduction: "I turn rabbit holes into repos.",
  description: "I mostly build with C# and TypeScript, from desktop tools and OCR overlays to web experiences.",
};

// README purpose + repository contents verified on GitHub, 2026-11-22.
// Keep this selection small; the case studies remain the primary work showcase.
export const selectedRepositories = [
  {
    name: "glyphlens",
    description: "A privacy-first, offline Windows screen translator in development. It captures a display or window and reads the text with Windows OCR.",
    language: "C#",
    url: "https://github.com/ojeshfr/glyphlens",
  },
  {
    name: "larpiano",
    description: "A Windows MIDI-to-keyboard piano player for virtual pianos, with a floating overlay, song library and mapping profiles.",
    language: "C#",
    url: "https://github.com/ojeshfr/larpiano",
  },
  {
    name: "ClickForge",
    description: "Windows mouse-click and key-repeat utility with global shortcuts and profiles, built with WPF.",
    language: "C#",
    url: "https://github.com/ojeshfr/ClickForge",
  },
  {
    name: "lane-studio",
    description: "Campaign-led event curation site for LANE, built with the Next.js App Router and TypeScript.",
    language: "CSS",
    url: "https://github.com/ojeshfr/lane-studio",
  },
  {
    name: "teen-fiesta-red-room",
    description: "Next.js event website with local media and a Three.js starburst rendered with React Three Fiber.",
    language: "TypeScript",
    provenance: "Originally from gauravxsuvo/teen-fiesta-red-room",
    url: "https://github.com/ojeshfr/teen-fiesta-red-room",
  },
  {
    name: "portfolio-website",
    description: "An earlier OVIO studio portfolio built with Next.js App Router, React, TypeScript and plain CSS.",
    language: "TypeScript",
    url: "https://github.com/ojeshfr/portfolio-website",
  },
] as const;

export type DesktopProject = {
  name: string;
  kind: string;
  description: string;
  technology: string;
  url: string;
  linkLabel: string;
  /** An unedited capture of the app's own interface, taken from its public repository. */
  screenshot?: { src: string; alt: string; aspect: number };
};

export const desktopProjects: DesktopProject[] = [
  {
    name: "GlyphLens",
    kind: "Windows utility / In development",
    description:
      "A privacy-first, offline screen translator. It captures a display or window with a live preview and reads text with Windows OCR; translation is not implemented yet.",
    technology: "C# / Windows OCR / Python worker",
    url: "https://github.com/ojeshfr/glyphlens",
    linkLabel: "View repository",
    screenshot: {
      src: "/work/repos/glyphlens-capture.webp",
      alt: "GlyphLens capture page with screen-capture controls, text recognition and translation panels, and no capture running.",
      aspect: 1479 / 984,
    },
  },
  {
    name: "ClickForge",
    kind: "Windows utility",
    description:
      "A mouse-click and key-repeat utility with global shortcuts, profiles, and foreground-window checks.",
    technology: "C# / WPF / .NET",
    url: "https://github.com/ojeshfr/ClickForge",
    linkLabel: "View repository",
    screenshot: {
      src: "/work/repos/clickforge-dashboard.webp",
      alt: "ClickForge dashboard with click-speed controls, start, pause and emergency stop buttons, and a selected-target panel.",
      aspect: 1280 / 880,
    },
  },
  {
    name: "larpiano",
    kind: "Windows app / Public beta",
    description:
      "Plays MIDI files on virtual pianos by dispatching Windows keyboard scan codes, with a dark desktop interface, floating overlay and customizable mapping profiles.",
    technology: "C# / .NET",
    url: "https://github.com/ojeshfr/larpiano",
    linkLabel: "View repository",
    screenshot: {
      src: "/work/repos/larpiano-player.webp",
      alt: "larpiano's piano player window with its Roblox window and song pickers, quick actions and playback controls.",
      aspect: 1536 / 1024,
    },
  },
  {
    name: "larpiano Overlay",
    kind: "Prototype",
    description:
      "A standalone WPF prototype for larpiano's floating overlay, built to explore its visuals and interaction in isolation.",
    technology: "C# / WPF",
    url: "https://github.com/ojeshfr/larpiano-overlay-prototype",
    linkLabel: "View repository",
  },
  {
    name: "Screen Circle Click Tester",
    kind: "Windows utility",
    description:
      "Draw a detection circle on the game screen, pick a target colour, and arm clicking with hotkeys. It runs only while another window is focused and accounts for display scaling.",
    technology: "Python / Windows executable",
    url: "https://github.com/ojeshfr/screen-circle-click-tester",
    linkLabel: "View repository",
  },
  {
    name: "Sora",
    kind: "Windows hardware hub",
    description:
      "A native hub for supported cooler displays, keyboards, mice, lighting, fans, storage health and Wi-Fi measurements. Originally published as gauravxsuvo/Sora.",
    technology: "C# / .NET",
    url: "https://github.com/ojeshfr/sora",
    linkLabel: "View repository",
    screenshot: {
      src: "/work/repos/sora-updates.webp",
      alt: "Sora's Updates page with the installed version, update checks and the device navigation sidebar.",
      aspect: 1288 / 782,
    },
  },
  {
    name: "Forklight",
    kind: "Experimental",
    description:
      "A Windows desktop workspace for local coding agents that inspects Git repositories and run history. Task execution is disabled in the interface.",
    technology: "JavaScript / Electron",
    url: "https://github.com/ojeshfr/forklight",
    linkLabel: "View repository",
  },
];
