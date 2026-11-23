import Image from "next/image";
import Link from "next/link";
import { PortalHero } from "@/components/portal-hero";
import { HeroParallax3D } from "@/components/hero-parallax-3d";
import { CardTilt3D } from "@/components/card-tilt-3d";
import { buildSceneItems } from "@/lib/scene";
import { projects } from "@/lib/projects";
import { desktopProjects, profile } from "@/lib/profile";
import { site } from "@/lib/site";

export default function HomePage() {
  const featuredTools = desktopProjects.filter((tool) => Boolean(tool.screenshot));

  return (
    <div className="page-home">
      {/* 1. Clean Light Hero Section with subtle layered perspective depth */}
      <section className="home-hero" aria-labelledby="hero-title">
        <HeroParallax3D>
          <div className="container home-hero__inner">
            <span className="home-hero__eyebrow">Creative Development</span>
            <h1 className="home-hero__title" id="hero-title">
              Ojesh
            </h1>
            <p className="home-hero__subhead">
              {profile.introduction} {profile.description}
            </p>
            <div className="home-hero__actions">
              <a className="btn btn--primary" href="#gallery">
                Explore work <span aria-hidden="true" className="chevron">↓</span>
              </a>
              <Link className="btn btn--secondary" href="/about">
                About Ojesh <span aria-hidden="true" className="chevron">›</span>
              </Link>
            </div>
          </div>
        </HeroParallax3D>
      </section>

      {/* 2. 3D Fly-Through Gallery (Dark Product Reel) */}
      <PortalHero items={buildSceneItems(projects)} />

      {/* 3. Selected Work Bento Grid */}
      <section className="section section--tint" id="selected-work" aria-labelledby="work-heading">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Selected Work</span>
            <h2 className="headline" id="work-heading">
              Crafted in code.
            </h2>
            <p className="subhead">
              Four case studies in web interaction, real-time graphics, and offline reliability.
            </p>
          </div>

          <div className="work-bento">
            {projects.map((project) => (
              <CardTilt3D key={project.slug}>
                <Link className="work-bento__card" href={`/work/${project.slug}`}>
                  <div className="work-bento__head">
                    <span className="work-bento__type">
                      {project.type} · {project.year}
                    </span>
                    <h3 className="work-bento__title">{project.title}</h3>
                    <p className="work-bento__summary">{project.summary}</p>
                  </div>
                  <div className="work-bento__media">
                    <Image
                      src={project.cover.src}
                      alt={project.cover.alt}
                      fill
                      sizes="(max-width: 820px) 100vw, 50vw"
                      loading="lazy"
                    />
                  </div>
                  <span className="work-bento__cta">
                    View case study <span aria-hidden="true" className="chevron">›</span>
                  </span>
                </Link>
              </CardTilt3D>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Windows Tools Row */}
      <section className="section" id="windows-tools" aria-labelledby="tools-heading">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Desktop Engineering</span>
            <h2 className="headline" id="tools-heading">
              Built for Windows.
            </h2>
            <p className="subhead">
              Native utilities and screen overlays developed with C# and .NET.
            </p>
          </div>

          <div className="tools-grid">
            {featuredTools.map((tool) => (
              <CardTilt3D key={tool.name}>
                <a
                  className="tool-card"
                  href={tool.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div>
                    <span className="tool-card__tag">{tool.kind}</span>
                    <h3 className="tool-card__title">{tool.name}</h3>
                    <p className="tool-card__desc">{tool.description}</p>
                  </div>
                  {tool.screenshot && (
                    <div className="tool-card__media">
                      <Image
                        src={tool.screenshot.src}
                        alt={tool.screenshot.alt}
                        fill
                        sizes="(max-width: 820px) 100vw, 50vw"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div>
                    <p className="tool-card__tech">{tool.technology}</p>
                    <span className="tool-card__cta">
                      View on GitHub <span aria-hidden="true" className="chevron">↗</span>
                    </span>
                  </div>
                </a>
              </CardTilt3D>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Closing CTA Section */}
      <section className="section section--tint home-cta" id="contact-cta" aria-labelledby="cta-heading">
        <div className="container home-cta__inner">
          <span className="eyebrow">Start a Conversation</span>
          <h2 className="headline" id="cta-heading">
            Have a project in mind?
          </h2>
          <p className="subhead">
            Share the early thought, the almost-finished brief, or the part that still needs solving.
          </p>
          <div className="home-cta__actions">
            <Link className="btn btn--primary" href="/contact">
              Start a conversation <span aria-hidden="true" className="chevron">›</span>
            </Link>
            <a className="btn btn--secondary" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
          </div>
          <p className="home-cta__meta">
            Based in {profile.location} · C# &amp; TypeScript
          </p>
        </div>
      </section>
    </div>
  );
}
