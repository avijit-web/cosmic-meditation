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
          Ready to raise your <em>vibration?</em>
        </h2>
        <p className={styles.lead}>Let&apos;s stay connected</p>

        {done ? (
          <p className={styles.done} aria-live="polite">
            you&apos;re in, lovely ✦ watch your inbox
          </p>
        ) : (
          // The same form that gates the meditations; the wrapper sets its
          // palette so it reads as cream-on-maroon here.
          <div className={styles.formTheme}>
            <LeadForm
              onSubmit={() => setDone(true)}
              submitLabel="Join the community ✦"
              source="debalina"
            />
          </div>
        )}
      </div>
    </section>
  );
}
