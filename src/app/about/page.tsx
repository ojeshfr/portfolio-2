import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { desktopProjects, profile } from "@/lib/profile";
import { projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import styles from "@/components/profile.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Ojesh, based in India. Engineering with C# and TypeScript, from desktop tools and OCR overlays to web experiences.",
  path: "/about",
});

export default function AboutPage() {
  const featuredTools = desktopProjects.filter((tool) => Boolean(tool.screenshot));
  const companionTools = desktopProjects.filter((tool) => !tool.screenshot);

  return (
    <div className={styles.page}>
      {/* 1. Calm Hero: Meet the Maker */}
      <section className={styles.heroSection} aria-labelledby="about-hero-title">
        <div className="container">
          <div className={styles.heroContent} data-scroll-reveal>
            <span className="eyebrow">Meet the Maker</span>
            <h1 className={styles.heroTitle} id="about-hero-title">
              Ojesh
            </h1>
            <p className={styles.heroStatement}>
              {profile.introduction} {profile.description}
            </p>

            {/* Spec rows */}
            <dl className={styles.specsRow} aria-label="Profile specifications">
              <div className={styles.specCard}>
                <dt className={styles.specLabel}>Based in</dt>
                <dd className={styles.specValue}>{profile.location}</dd>
              </div>
              <div className={styles.specCard}>
                <dt className={styles.specLabel}>Works with</dt>
                <dd className={styles.specValue}>C# &amp; TypeScript</dd>
              </div>
              <div className={styles.specCard}>
                <dt className={styles.specLabel}>Makes</dt>
                <dd className={styles.specValue}>Desktop tools, OCR overlays &amp; web</dd>
              </div>
            </dl>

            <div className={styles.heroAction}>
              <a
                className="text-link"
                href={site.githubUrl}
                rel="noreferrer"
                target="_blank"
                aria-label={`Explore @${profile.handle} on GitHub (opens in new tab)`}
              >
                Explore @{profile.handle} on GitHub <span aria-hidden="true" className="chevron">›</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editorial Narrative: From the browser to the desktop */}
      <section className="section section--tint" aria-labelledby="story-heading">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.stickyCol}>
              <span className="eyebrow">Architecture &amp; Focus</span>
              <h2 className={styles.storyHeadline} id="story-heading">
                From the browser to the desktop.
              </h2>
            </div>
            <div className={styles.storyContent}>
              <p>
                I build software across two complementary environments: interactive, graphics-rich interfaces in the browser, and native, high-performance utilities on the Windows desktop.
              </p>
              <p>
                My web development focuses on deliberate interaction, real-time 3D, and offline-first reliability using <strong>TypeScript, React, and Next.js</strong>. On Windows, I engineer low-latency screen overlays, input automation utilities, and hardware integrations with <strong>C# and .NET</strong>.
              </p>
              <p>
                Whether reading pixels off a live display with Windows OCR in GlyphLens or structuring a campaign archive for LANE, the discipline remains consistent: precise code, unbloated architecture, and tools built with respect for the user.
              </p>
              <div className={styles.storyLinks}>
                <a
                  className="text-link"
                  href={`${site.githubUrl}?tab=repositories`}
                  rel="noreferrer"
                  target="_blank"
                  aria-label="View all public repositories on GitHub (opens in new tab)"
                >
                  All public repositories <span aria-hidden="true" className="chevron">›</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Web Projects Bento Grid */}
      <section className="section" aria-labelledby="web-projects-heading">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Web Engineering</span>
            <h2 className="headline" id="web-projects-heading">
              In the browser.
            </h2>
            <p className="subhead">
              Event platforms, training applications, and media products built with TypeScript, React, and Next.js.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {projects.map((project) => (
              <article className={styles.bentoCard} key={project.slug}>
                <div>
                  <div className={styles.bentoHead}>
                    <span className={styles.bentoType}>
                      {project.type} · {project.year}
                    </span>
                    <h3 className={styles.bentoTitle}>{project.title}</h3>
                    <p className={styles.bentoSummary}>{project.summary}</p>
                  </div>

                  <div className={styles.bentoMedia}>
                    <Image
                      src={project.cover.src}
                      alt={project.cover.alt}
                      fill
                      sizes="(max-width: 820px) 100vw, 50vw"
                      loading="lazy"
                    />
                  </div>

                  {project.repository?.note && (
                    <p className={styles.provenanceNote}>
                      {project.repository.note}
                    </p>
                  )}
                  {project.credit && (
                    <p className={styles.provenanceNote}>
                      {project.credit}
                    </p>
                  )}
                </div>

                <div className={styles.bentoActions}>
                  <Link
                    className="text-link"
                    href={`/work/${project.slug}`}
                    aria-label={`View case study: ${project.title}`}
                  >
                    View case study <span aria-hidden="true" className="chevron">›</span>
                  </Link>
                  {project.repository ? (
                    <a
                      className="text-link"
                      href={project.repository.url}
                      rel="noreferrer"
                      target="_blank"
                      aria-label={`GitHub repository: ${project.title}`}
                    >
                      GitHub repository <span aria-hidden="true" className="chevron">↗</span>
                    </a>
                  ) : project.liveUrl ? (
                    <a
                      className="text-link"
                      href={project.liveUrl}
                      rel="noreferrer"
                      target="_blank"
                      aria-label={`Visit live site: ${project.title}`}
                    >
                      Visit live site <span aria-hidden="true" className="chevron">↗</span>
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Windows Tools Grid & Provenance */}
      <section className="section section--tint" aria-labelledby="desktop-tools-heading">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Desktop Engineering</span>
            <h2 className="headline" id="desktop-tools-heading">
              On the desktop.
            </h2>
            <p className="subhead">
              Native Windows tools, from OCR screen overlays and input automation to virtual pianos and hardware hubs.
            </p>
          </div>

          {/* Primary tools with authentic screenshots */}
          <div className={styles.desktopGrid}>
            {featuredTools.map((tool) => (
              <article className={styles.desktopCard} key={tool.name}>
                <div>
                  <div className={styles.desktopCardHead}>
                    <span className={styles.desktopTag}>{tool.kind}</span>
                    <h3 className={styles.desktopTitle}>{tool.name}</h3>
                    <p className={styles.desktopDesc}>{tool.description}</p>
                  </div>

                  {tool.screenshot && (
                    <div className={styles.desktopMedia}>
                      <Image
                        src={tool.screenshot.src}
                        alt={tool.screenshot.alt}
                        fill
                        sizes="(max-width: 820px) 100vw, 50vw"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                <div className={styles.desktopFoot}>
                  {tool.name === "Sora" && (
                    <span className={styles.provenanceBadge}>
                      Provenance: Originally published as gauravxsuvo/Sora.
                    </span>
                  )}
                  <p className={styles.desktopTech}>{tool.technology}</p>
                  <a
                    className="text-link"
                    href={tool.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {tool.linkLabel} <span aria-hidden="true" className="chevron">↗</span>
                  </a>
                  {tool.release ? (
                    <a
                      className="text-link"
                      href={tool.release.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Latest release {tool.release.label} <span aria-hidden="true" className="chevron">↗</span>
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          {/* Companion utilities & prototypes */}
          <div className={styles.companionSection}>
            <div className={styles.companionHead}>
              <h3>Prototypes &amp; Additional Utilities</h3>
              <p>Specialized Windows prototypes, game tools, and workspace experiments.</p>
            </div>
            <div className={styles.companionGrid}>
              {companionTools.map((tool) => (
                <article className={styles.companionCard} key={tool.name}>
                  <div>
                    <span className={styles.desktopTag}>{tool.kind}</span>
                    <h4>{tool.name}</h4>
                    <p>{tool.description}</p>
                  </div>
                  <div>
                    <p className={styles.desktopTech}>{tool.technology}</p>
                    <a
                      className="text-link"
                      href={tool.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {tool.linkLabel} <span aria-hidden="true" className="chevron">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="section" aria-labelledby="about-cta-heading">
        <div className="container">
          <div className={styles.closingInner}>
            <span className="eyebrow">Start a Conversation</span>
            <h2 className="headline" id="about-cta-heading">
              Have a project in mind?
            </h2>
            <p className="subhead">
              Share the early thought, the almost-finished brief, or the part that still needs solving.
            </p>
            <div className={styles.closingActions}>
              <Link className="btn btn--primary" href="/contact">
                Start a conversation <span aria-hidden="true" className="chevron">›</span>
              </Link>
              <a className="btn btn--secondary" href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>
            </div>
            <p className={styles.closingMeta}>
              Based in {profile.location} · C# &amp; TypeScript · Available for engineering &amp; creative development
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
