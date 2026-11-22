import Image from "next/image";
import { desktopProjects } from "@/lib/profile";
import { site } from "@/lib/site";
import { Atmosphere } from "./atmosphere";
import styles from "./desktop-tools.module.css";

/** The Windows tools that have an authentic interface capture, shown as an
 * archive section beside the web case studies. */
export function DesktopTools() {
  const tools = desktopProjects.filter((tool) => tool.screenshot);
  return (
    <section className={styles.section} aria-labelledby="desktop-tools-title">
      <Atmosphere variant="grid" />
      <div className={styles.head}>
        <h2 id="desktop-tools-title">On the desktop.</h2>
        <p>Native Windows tools. Each capture is the application&apos;s own interface, taken from its public repository.</p>
      </div>
      <ul className={styles.grid}>
        {tools.map((tool) => tool.screenshot ? (
          <li key={tool.name}>
            <a className={styles.card} href={tool.url} target="_blank" rel="noreferrer" aria-label={`${tool.name} on GitHub`}>
              <span className={styles.shot}>
                <Image src={tool.screenshot.src} alt={tool.screenshot.alt} width={1200} height={Math.round(1200 / tool.screenshot.aspect)} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 30vw" quality={90} />
              </span>
              <span className={styles.kind}>{tool.kind}</span>
              <span className={styles.name}>{tool.name} <span aria-hidden="true">↗</span></span>
              <span className={styles.description}>{tool.description}</span>
              <span className={styles.tech}>{tool.technology}</span>
            </a>
          </li>
        ) : null)}
      </ul>
      <a className={styles.more} href={`${site.githubUrl}?tab=repositories`} target="_blank" rel="noreferrer">All repositories on GitHub <span aria-hidden="true">↗</span></a>
    </section>
  );
}
