import { desktopProjects } from "./profile";
import type { Project } from "./projects";

/** One slide in the homepage 3D gallery: a web case study or a Windows tool. */
export type SceneItem = {
  id: string;
  title: string;
  type: string;
  kind: "web" | "windows";
  image: { src: string; alt: string; aspect: number };
  href: string;
  external: boolean;
  cta: string;
};

/** Web case studies first, then the Windows tools that have an authentic screenshot. */
export function buildSceneItems(projects: Project[]): SceneItem[] {
  const web: SceneItem[] = projects.map((project) => ({
    id: project.slug,
    title: project.title,
    type: project.type,
    kind: "web",
    image: { src: project.cover.textureSrc ?? project.cover.src, alt: project.cover.alt, aspect: project.cover.aspect },
    href: `/work/${project.slug}`,
    external: false,
    cta: "Explore the case study ↗",
  }));
  const windows: SceneItem[] = desktopProjects.flatMap((tool) => tool.screenshot ? [{
    id: tool.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: tool.name,
    type: tool.kind,
    kind: "windows" as const,
    image: tool.screenshot,
    href: tool.url,
    external: true,
    cta: "View on GitHub ↗",
  }] : []);
  return [...web, ...windows];
}
