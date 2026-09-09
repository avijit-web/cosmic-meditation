import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Hero.module.css";
import shared from "./shared.module.css";

const ROLES = [
  "Silva Method Instructor",
  "Manifestation Specialist",
  "Mindfulness Facilitator",
];

/** Shadow-texture background shared by the nav and the hero. */
export function HeroBand({ children }: { children: ReactNode }) {
  return <div className={styles.band}>{children}</div>;
}

export default function Hero() {
  return (
    <header className={styles.hero} id="top">
      <div className={styles.copy}>
        <div className={styles.eyebrow}>
          <span>Meditate with</span>
          <span className={styles.line} aria-hidden="true" />
          <Sparkle />
        </div>

        <h1 className={styles.wordmark}>Debalina</h1>

        <div className={styles.roles}>
          {ROLES.map((r, i) => (
            <span key={r} style={{ display: "contents" }}>
              {i > 0 && <span className={styles.dot} aria-hidden="true" />}
              <span>{r}</span>
            </span>
          ))}
        </div>

        <div className={styles.bio}>
          <p className={styles.quote}>
            Meditation allows the Caterpillar to know it is a butterfly.
          </p>
          <p className={styles.invite}>
            Let&apos;s try a 1 Minute guided Meditation together?
          </p>
          {/* Scrolls to "Meditation is very Simple" further down the page. */}
          <Link className={shared.btn} href="#apps">
            Start The Meditation
          </Link>
        </div>

        <div className={styles.signature}>
          <Image
            src="/images/Artboard-3.png"
            alt="Debalina Chatterjee signature"
            fill
            sizes="(max-width: 900px) 70vw, 34vw"
          />
        </div>
      </div>

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.ring} />
        <div className={styles.disc} />
        <Image
          className={styles.portrait}
          src="/images/Artboard-2.png"
          alt=""
          width={785}
          height={590}
          priority
          sizes="(max-width: 900px) 104vw, 52vw"
        />
      </div>
    </header>
  );
}

function Sparkle() {
  return (
    <svg
      className={styles.sparkle}
      viewBox="0 0 40 40"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20 0c1.2 10.6 5.4 15.6 20 20-14.6 4.4-18.8 9.4-20 20-1.2-10.6-5.4-15.6-20-20C14.6 15.6 18.8 10.6 20 0z" />
    </svg>
  );
}
