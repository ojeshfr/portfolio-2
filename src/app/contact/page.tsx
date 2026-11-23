import type { Metadata } from "next";
import { ContactComposer } from "@/components/contact-composer";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { profile } from "@/lib/profile";
import styles from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Start a conversation with Ojesh about web development, desktop engineering, or creative coding.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className={styles.page}>
      {/* 1. Focused Intro Hero */}
      <section className={styles.introSection} aria-labelledby="contact-heading">
        <div className="container">
          <div className={styles.introContent} data-scroll-reveal>
            <span className="eyebrow">Contact</span>
            <h1 className={styles.headline} id="contact-heading">
              Start a conversation.
            </h1>
            <p className={styles.subhead}>
              Share the early thought, the almost-finished brief, or the part that still needs solving.
            </p>
            <div className={styles.actions}>
              <a className="btn btn--primary" href={`mailto:${site.contactEmail}`}>
                Email {site.contactEmail} <span aria-hidden="true" className="chevron">›</span>
              </a>
              <a className="text-link" href={`mailto:${site.contactEmail}`}>
                Direct mailto link <span aria-hidden="true" className="chevron">›</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Workbench Note Composer */}
      <section className="section section--tint" aria-labelledby="workbench-heading">
        <div className="container">
          <div className={styles.workbenchGrid}>
            <div className={styles.workbenchIntro} data-scroll-reveal>
              <span className="eyebrow">Project Note</span>
              <h2 className={styles.workbenchHeadline} id="workbench-heading">
                Give the idea somewhere to start.
              </h2>
              <p className={styles.workbenchBody}>
                A few lines are enough. The useful detail is usually the one you are still figuring out.
              </p>
              <div className={styles.privacyCallout}>
                <p className={styles.privacyTitle}>Local &amp; Private</p>
                <p className={styles.privacyText}>
                  This composer operates entirely in your browser to format your note into a standard email draft. No personal details or message content are transmitted to any server.
                </p>
              </div>
            </div>

            <div className={styles.composerWrapper} data-scroll-reveal>
              <ContactComposer />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Elsewhere Row */}
      <section className="section" aria-labelledby="elsewhere-heading">
        <div className="container">
          <div className={styles.elsewhereRow} data-scroll-reveal>
            <div>
              <span className="eyebrow" id="elsewhere-heading">Elsewhere</span>
              <p className={styles.elsewhereSub}>Connect directly or inspect public work.</p>
            </div>
            <div className={styles.elsewhereLinks}>
              <a
                className="text-link"
                href={site.githubUrl}
                rel="noreferrer"
                target="_blank"
                aria-label={`GitHub profile: @${profile.handle} (opens in new tab)`}
              >
                GitHub (@{profile.handle}) <span aria-hidden="true" className="chevron">↗</span>
              </a>
              <a
                className="text-link"
                href={`mailto:${site.contactEmail}`}
                aria-label={`Send email to ${site.contactEmail}`}
              >
                Email ({site.contactEmail}) <span aria-hidden="true" className="chevron">›</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
