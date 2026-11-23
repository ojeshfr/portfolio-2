import { selectedRepositories } from "@/lib/profile";
import { site } from "@/lib/site";
import styles from "./selected-repositories.module.css";

export function SelectedRepositories() {
  return (
    <section className={styles.section} id="github" aria-labelledby="selected-github-title">
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow">Open Source</span>
            <h2 className={styles.title} id="selected-github-title">
              Selected from GitHub
            </h2>
          </div>
          <a
            className="text-link"
            href={`${site.githubUrl}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            aria-label="View all public repositories on GitHub (opens in new tab)"
          >
            All repositories <span aria-hidden="true" className="chevron">›</span>
          </a>
        </div>
        <ul className={styles.list}>
          {selectedRepositories.map((repository) => (
            <li key={repository.name} className={styles.item}>
              <a
                className={styles.row}
                href={repository.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${repository.name} repository on GitHub (opens in new tab)`}
              >
                <div className={styles.identity}>
                  <h3 className={styles.repoName}>{repository.name}</h3>
                  {"provenance" in repository ? (
                    <p className={styles.provenance}>{repository.provenance}</p>
                  ) : null}
                </div>
                <p className={styles.description}>{repository.description}</p>
                <span className={styles.language}>{repository.language}</span>
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
