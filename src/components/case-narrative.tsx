import type { Project } from "@/lib/projects";
import type { CaseStudy } from "@/lib/case-studies";
import styles from "./case-study.module.css";

export function CaseNarrative({
  project,
  study,
}: {
  project: Project;
  study: CaseStudy;
}) {
  return (
    <div aria-labelledby="case-story-title">
      <div className={styles.narrativeHead} data-scroll-reveal>
        <span className="eyebrow">Behind the Work</span>
        <h2 className={styles.pullStatement} id="case-story-title">
          {study.line}
        </h2>
        <p className={styles.narrativeLead}>{study.opening}</p>
      </div>

      <div className={styles.decisionsGrid} data-scroll-reveal>
        {study.decisions.map((decision) => (
          <section className={styles.decisionCard} key={decision.title}>
            <h3 className={styles.decisionTitle}>{decision.title}</h3>
            <p className={styles.decisionText}>{decision.text}</p>
          </section>
        ))}
      </div>

      <aside
        className={styles.evidenceCallout}
        aria-label="Project scope and verification evidence"
        data-scroll-reveal
      >
        <span className={styles.evidenceTag}>
          {project.liveUnavailable ? "Local presentation" : "Scope & Evidence"}
        </span>
        <p className={styles.evidenceText}>{study.evidence}</p>
      </aside>
    </div>
  );
}
