"use client";

import { useState, type FormEvent } from "react";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!email) return;
    // No backend wired yet — swap this for a real signup call when ready.
    setDone(true);
  };

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
          <form className={styles.form} onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              required
              placeholder="your email, lovely…"
              aria-label="Email address"
            />
            <button type="submit">Join ✦</button>
          </form>
        )}
      </div>
    </section>
  );
}
