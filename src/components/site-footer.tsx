import Link from "next/link";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import { desktopProjects } from "@/lib/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__sitemap">
          <div className="site-footer__col">
            <h2>Selected Work</h2>
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
            <h2>Windows Tools</h2>
            <ul>
              {desktopProjects.filter((tool) => Boolean(tool.screenshot)).map((tool) => (
                <li key={tool.name}>
                  <a href={tool.url} rel="noreferrer" target="_blank">
                    {tool.name} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h2>About</h2>
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
            <h2>Contact</h2>
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
