import Image from "next/image";
import Link from "next/link";
import { CardTilt3D } from "@/components/card-tilt-3d";
import type { Project } from "@/lib/projects";
import styles from "./project-card.module.css";

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <article className={styles.cardWrapper} data-project={project.slug}>
      <CardTilt3D className={styles.tiltContainer}>
        <Link
          className={styles.card}
          data-scroll-reveal
          href={`/work/${project.slug}`}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardType}>
              {project.type} · {project.year}
            </span>
            <h2 className={styles.cardTitle}>{project.title}</h2>
            <p className={styles.cardSummary}>{project.summary}</p>
          </div>

          <div className={styles.cardMedia}>
            <Image
              alt={project.cover.alt}
              fill
              loading={index === 0 ? "eager" : "lazy"}
              sizes="(max-width: 820px) 100vw, 50vw"
              src={project.cover.src}
            />
          </div>

          <span className={styles.cardCta}>
            View case study <span aria-hidden="true" className="chevron">›</span>
          </span>
        </Link>
      </CardTilt3D>
    </article>
  );
}
