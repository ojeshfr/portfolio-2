import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";
import { Atmosphere } from "@/components/atmosphere";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: "Selected web projects by Ojesh: campaign, product and event websites.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <div className="page-work">
      <Atmosphere variant="gallery" />
      <section className="page-intro page-intro--work">
        <Atmosphere variant="profile" />
        <p className="eyebrow">Project archive / 2026</p>
        <h1>Worlds<br />in progress.</h1>
        <p className="page-intro__summary">Four studies in making the web more expressive, more useful, and more alive.</p>
      </section>
      <div className="page-work__note"><span>Move through the archive</span><span>{String(projects.length).padStart(2, "0")} projects / selected work</span></div>
      <section aria-label="Selected projects" className="work-sequence">
        {projects.map((project, index) => (
          <ProjectCard index={index} key={project.slug} project={project} />
        ))}
      </section>
    </div>
  );
}
