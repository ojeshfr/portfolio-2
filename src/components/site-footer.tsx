import Link from "next/link";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="site-footer__sitemap">
          <div className="site-footer__col">
            <h3>Selected Work</h3>
            <ul>
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/work/${project.slug}`}>{project.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/work">
                  All Case Studies <span aria-hidden="true">›</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3>Windows Tools</h3>
            <ul>
              <li>
                <a href="https://github.com/ojeshfr/glyphlens" rel="noreferrer" target="_blank">
                  GlyphLens <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/ojeshfr/ClickForge" rel="noreferrer" target="_blank">
                  ClickForge <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/ojeshfr/larpiano" rel="noreferrer" target="_blank">
                  larpiano <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/ojeshfr/sora" rel="noreferrer" target="_blank">
                  Sora <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3>About</h3>
            <ul>
              <li>
                <Link href="/about">Overview</Link>
              </li>
              <li>
                <a href={site.githubUrl} rel="noreferrer" target="_blank">
                  GitHub Profile <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <span>C# &amp; TypeScript</span>
              </li>
              <li>
                <span>India</span>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3>Contact</h3>
            <ul>
              <li>
                <Link href="/contact">Start a Conversation</Link>
              </li>
              <li>
                <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
              </li>
              <li>
                <a href={site.githubUrl} rel="noreferrer" target="_blank">
                  @ojeshfr <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="site-footer__legal">
            <p>© 2026 Ojesh. All rights reserved.</p>
          </div>
          <div className="site-footer__tech">
            <span>India · Personal Portfolio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
