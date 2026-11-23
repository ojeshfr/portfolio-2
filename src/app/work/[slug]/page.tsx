import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectGallery } from "@/components/project-gallery";
import { getProject, projects } from "@/lib/projects";
import { caseStudies } from "@/lib/case-studies";
import { CaseNarrative } from "@/components/case-narrative";
import { CaseFeature } from "@/components/case-feature";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import styles from "@/components/case-study.module.css";

type CaseStudyProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    ...pageMetadata({
      title: project.title,
      description: project.summary,
      path: "/work/" + project.slug,
    }),
    openGraph: {
      type: "article",
      siteName: site.name,
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      url: `/work/${project.slug}`,
      images: [project.cover.src],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      images: [project.cover.src],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const study = caseStudies[project.slug];

  return (
    <article
      className={`case-page ${styles.casePage}`}
      data-project={project.slug}
    >
      {/* 1. CSS-Only Scroll Progress Indicator */}
      <div className={styles.scrollProgress} aria-hidden="true">
        <div className={styles.scrollProgressBar} />
      </div>

      {/* 2. Hero Section (Apple Product Page Hero) */}
      <section className="section" aria-labelledby="case-hero-title">
        <div className="container">
          {/* Breadcrumb / Back Navigation */}
          <div className={styles.backNav}>
            <Link className="text-link" href="/work">
              <span aria-hidden="true">‹</span> All Work
            </Link>
          </div>

          {/* Hero Header */}
          <header className={styles.heroHeader} data-scroll-reveal>
            <span className="eyebrow">
              {project.intro?.eyebrow ?? `${project.type} · ${project.year}`}
            </span>
            <h1 className={styles.heroTitle} id="case-hero-title">
              {project.title}
            </h1>
            <p className={styles.heroSummary}>{project.summary}</p>

            <div className={styles.heroActions}>
              {project.liveUnavailable ? (
                <span className={styles.statusBadge}>
                  Local website export · Public deployment unavailable
                </span>
              ) : project.liveUrl ? (
                <a
                  className="btn btn--primary"
                  href={project.liveUrl}
                  rel="noreferrer"
                  target="_blank"
                  aria-label={`Visit the project: ${project.title}`}
                >
                  Visit the project{" "}
                  <span aria-hidden="true" className="chevron">
                    ↗
                  </span>
                </a>
              ) : null}

              {project.repository && (
                <a
                  className="btn btn--secondary"
                  href={project.repository.url}
                  rel="noreferrer"
                  target="_blank"
                  aria-label={`Source repository: ${project.title}`}
                >
                  Source repository{" "}
                  <span aria-hidden="true" className="chevron">
                    ↗
                  </span>
                </a>
              )}
            </div>
          </header>

          {/* Cover & Interactive Product Gallery */}
          <div className={styles.galleryWrapper} data-scroll-reveal>
            <ProjectGallery key={project.slug} project={project} lead />
          </div>

          {/* Facts Strip (Tech Specs) */}
          <div
            className={styles.factsStrip}
            aria-label="Project technical specifications"
            data-scroll-reveal
          >
            <div className={styles.factItem}>
              <span className={styles.factLabel}>Role</span>
              <span className={styles.factValue}>{project.role}</span>
            </div>
            <div className={styles.factItem}>
              <span className={styles.factLabel}>Scope</span>
              <span className={styles.factValue}>{study.scope}</span>
            </div>
            <div className={styles.factItem}>
              <span className={styles.factLabel}>Year</span>
              <span className={styles.factValue}>{project.year}</span>
            </div>
            <div className={styles.factItem}>
              <span className={styles.factLabel}>Status</span>
              <span className={styles.factValue}>
                {project.liveUnavailable ? (
                  "Local website export"
                ) : project.liveUrl ? (
                  <a
                    className="text-link"
                    href={project.liveUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Live deployment{" "}
                    <span aria-hidden="true" className="chevron">
                      ↗
                    </span>
                  </a>
                ) : (
                  "Completed"
                )}
              </span>
            </div>
            {project.credit && (
              <div className={`${styles.factItem} ${styles.factItemFull}`}>
                <span className={styles.factLabel}>Collaboration</span>
                <span className={styles.factValue}>{project.credit}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Narrative Section (Alternating Tint) */}
      <section
        className="section section--tint"
        aria-labelledby="case-story-title"
      >
        <div className="container">
          <CaseNarrative project={project} study={study} />
        </div>
      </section>

      {/* 4. Feature Deep-Dive Section (Light) */}
      <section className="section" aria-labelledby="case-feature-title">
        <div className="container">
          <CaseFeature slug={project.slug} />
        </div>
      </section>

      {/* 5. Repository & Provenance Section (Alternating Tint) */}
      {project.repository && (
        <section
          className="section section--tint"
          aria-labelledby="repo-heading"
        >
          <div className="container">
            <div className={styles.repoCard} data-scroll-reveal>
              <div className={styles.repoInfo}>
                <span className="eyebrow">Public Source</span>
                <h2 className={styles.repoTitle} id="repo-heading">
                  {project.title} on GitHub
                </h2>
                <p className={styles.repoDesc}>
                  {project.repository.description}
                </p>
                <p className={styles.repoNote}>{project.repository.note}</p>
              </div>
              <a
                className="btn btn--secondary"
                href={project.repository.url}
                rel="noreferrer"
                target="_blank"
                aria-label={`Explore repository: ${project.title}`}
              >
                Explore repository{" "}
                <span aria-hidden="true" className="chevron">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 6. Next Project Module & Back Link (Light) */}
      <section className="section" aria-labelledby="next-project-title">
        <div className="container">
          <div className={styles.nextSection} data-scroll-reveal>
            <span className="eyebrow">Next Case Study</span>
            <Link
              className={styles.nextCard}
              href={`/work/${nextProject.slug}`}
            >
              <div className={styles.nextInfo}>
                <span className={styles.nextType}>
                  {nextProject.type} · {nextProject.year}
                </span>
                <h2 className={styles.nextTitle} id="next-project-title">
                  {nextProject.title}
                </h2>
                <p className={styles.nextSummary}>{nextProject.summary}</p>
                <span className={styles.nextCta}>
                  View case study{" "}
                  <span aria-hidden="true" className="chevron">
                    ›
                  </span>
                </span>
              </div>
              <div className={styles.nextMedia}>
                <Image
                  alt={nextProject.cover.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 860px) 100vw, 340px"
                  src={nextProject.cover.src}
                />
              </div>
            </Link>

            <div className={styles.backRow}>
              <Link className="text-link" href="/work">
                <span aria-hidden="true">‹</span> Back to all work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
