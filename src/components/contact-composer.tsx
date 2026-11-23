"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import styles from "./contact-composer.module.css";

export function ContactComposer() {
  const [draftHref, setDraftHref] = useState("");

  function prepareDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = new FormData(event.currentTarget);
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();

    for (const field of ["name", "message"]) {
      const input = event.currentTarget.elements.namedItem(field);
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        input.setCustomValidity(input.value.trim() ? "" : "Please provide details here.");
      }
    }
    if (!event.currentTarget.reportValidity()) return;

    const subject = `Project note from ${name}`;
    const body = `Hi Ojesh,\n\n${message}\n\n— ${name}\n${email}`;

    setDraftHref(
      `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardBadge}>Project Note / Draft</span>
        <span className={styles.cardSecurity}>Private · Formatted locally</span>
      </div>

      <form
        className={styles.form}
        onChange={(event) => {
          setDraftHref("");
          if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            event.target.setCustomValidity("");
          }
        }}
        onSubmit={prepareDraft}
        noValidate={false}
      >
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="composer-name">
            Your name
          </label>
          <input
            autoComplete="name"
            className={styles.input}
            id="composer-name"
            maxLength={80}
            name="name"
            placeholder="e.g. Maya Lin"
            required
            type="text"
          />
          <span className={styles.fieldHint}>How Ojesh should address you</span>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="composer-email">
            Email address
          </label>
          <input
            autoComplete="email"
            className={styles.input}
            id="composer-email"
            maxLength={160}
            name="email"
            placeholder="name@organization.com"
            required
            type="email"
          />
          <span className={styles.fieldHint}>Where a response should be sent</span>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="composer-message">
            What are you thinking about?
          </label>
          <textarea
            className={styles.textarea}
            id="composer-message"
            maxLength={2000}
            name="message"
            placeholder="Describe your idea, project scope, technical question, or timeline..."
            required
            rows={5}
          />
          <span className={styles.fieldHint}>A few clear lines are plenty to start</span>
        </div>

        <div className={styles.submitRow}>
          <p className={styles.submitDisclaimer}>
            This builds a standard draft in your email app. No data is stored or transmitted by this website.
          </p>
          <button className="btn btn--primary" type="submit">
            Prepare the note <span aria-hidden="true" className="chevron">›</span>
          </button>
        </div>
      </form>

      <div aria-live="polite" className={styles.statusContainer} role="status">
        {draftHref ? (
          <div className={styles.draftCard}>
            <p className={styles.draftTitle}>Draft prepared successfully</p>
            <p className={styles.draftText}>
              Select the button below to launch your email client with your note pre-filled.
            </p>
            <a className={`btn btn--primary ${styles.draftAction}`} href={draftHref}>
              Open in email app <span aria-hidden="true" className="chevron">›</span>
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
