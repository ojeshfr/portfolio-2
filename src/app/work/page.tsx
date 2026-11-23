import type { Metadata } from "next";
import Image from "next/image";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";
import { desktopProjects } from "@/lib/profile";
import { pageMetadata } from "@/lib/seo";
import styles from "./work.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: "Selected web case studies and desktop tools engineered by Ojesh.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <div className={styles.pageWork}>
      {/* 1. Web Case Studies (Apple Store Style) */}
      <section className="section" aria-labelledby="work-heading">
        <div className="container">
          <header className="section-head" data-scroll-reveal>
            <span className="eyebrow">Work Archive</span>
            <h1 className="headline" id="work-heading">
              Crafted in code.
            </h1>
            <p className="subhead">
              Four case studies in web interaction, real-time graphics, and offline reliability.
            </p>
          </header>

          <div className={styles.caseGrid}>
            {projects.map((project, index) => (
              <ProjectCard index={index} key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Windows Tools Section */}
      <section className="section section--tint" id="desktop-tools" aria-labelledby="tools-heading">
        <div className="container">
          <div className="section-head" data-scroll-reveal>
            <span className="eyebrow">Desktop Engineering</span>
            <h2 className="headline" id="tools-heading">
              Built for Windows.
            </h2>
            <p className="subhead">
              Native utilities and screen overlays developed with C# and .NET.
            </p>
          </div>

          <div className={styles.toolsGrid}>
            {desktopProjects.map((tool) => (
              <a
                className={styles.toolCard}
                href={tool.url}
                key={tool.name}
                rel="noreferrer"
                target="_blank"
                data-scroll-reveal
              >
                <div className={styles.toolCardHeader}>
                  <div className={styles.toolCardMeta}>
                    <span className={styles.toolTag}>{tool.kind}</span>
                    <h3 className={styles.toolTitle}>{tool.name}</h3>
                  </div>
                  <span className={styles.toolExternal} aria-hidden="true">↗</span>
                </div>
                <p className={styles.toolDesc}>{tool.description}</p>
                {tool.screenshot && (
                  <div className={styles.toolMedia}>
                    <Image
                      src={tool.screenshot.src}
                      alt={tool.screenshot.alt}
                      fill
                      sizes="(max-width: 820px) 100vw, 50vw"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className={styles.toolFooter}>
                  <span className={styles.toolTech}>{tool.technology}</span>
                  <span className="text-link">
                    View on GitHub <span aria-hidden="true" className="chevron">↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
