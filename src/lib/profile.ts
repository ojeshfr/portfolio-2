// Public GitHub profile (github.com/ojeshfr), profile README and repository READMEs, checked 2026-11-22; GlyphLens and larpiano re-checked against their releases on 2026-11-23.
// Source URLs and attribution limits: qa/profile-refresh-2026-11-22/README.md.
export const profile = {
  handle: "ojeshfr",
  location: "India",
  introduction: "I turn rabbit holes into repos.",
  description: "I mostly build with C# and TypeScript, from desktop tools and OCR overlays to web experiences.",
};

export type DesktopProject = {
  name: string;
  kind: string;
  description: string;
  technology: string;
  url: string;
  linkLabel: string;
  /** Latest GitHub release, when the repository publishes one. */
  release?: { label: string; url: string };
  /** An unedited capture of the app's own interface, taken from its public repository. */
  screenshot?: { src: string; alt: string; aspect: number };
};

export const desktopProjects: DesktopProject[] = [
  {
    name: "GlyphLens",
    kind: "Windows utility / Developer preview",
    description:
      "A privacy-first, offline screen translator for Windows 11. It reads text on a window or display with local OCR and shows an English translation in a floating panel. Chinese-first, with gist-level quality.",
    technology: "C# / WPF / Windows OCR / Python worker",
    url: "https://github.com/ojeshfr/glyphlens",
    linkLabel: "View repository",
    release: { label: "v0.1.2-preview (unsigned)", url: "https://github.com/ojeshfr/glyphlens/releases/tag/v0.1.2-preview" },
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
    kind: "Windows app / v1.1.0",
    description:
      "Plays MIDI files on virtual pianos by dispatching Windows keyboard scan codes, with a dark desktop interface, floating overlay and customizable mapping profiles. Version 1.1.0 adds 50 calibrated piano tracks for 61-key virtual pianos.",
    technology: "C# / .NET",
    url: "https://github.com/ojeshfr/larpiano",
    linkLabel: "View repository",
    release: { label: "v1.1.0", url: "https://github.com/ojeshfr/larpiano/releases/tag/v1.1.0" },
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
