"use client";

import { useState } from "react";
import styles from "./Newsletter.module.css";
import { LeadForm } from "../../components/lead/LeadForm";

export default function Newsletter() {
  const [done, setDone] = useState(false);

  return (
    <section className={styles.section} id="join">
      <div className={styles.inner}>
        <span className={styles.kicker}>The weekly letter</span>
        <h2 className={styles.title}>
          Ready to feel <em>magnetic?</em>
        </h2>
        <p className={styles.lead}>
          One gentle note a week — a meditation, a manifestation prompt, and a
          little love from Beat. No noise, ever.
        </p>

        {done ? (
          <p className={styles.done} aria-live="polite">
            you&apos;re in, lovely ✦ watch your inbox
          </p>
        ) : (
          // The same form that gates the meditations; the wrapper sets its
          // palette so it reads as cream-on-maroon here.
          <div className={styles.formTheme}>
            <LeadForm onSubmit={() => setDone(true)} submitLabel="Join ✦" />
          </div>
        )}
      </div>
    </section>
  );
}
