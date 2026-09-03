import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ToolCards.module.css";
import shared from "./shared.module.css";

type ToolCardProps = {
  no: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  demo: ReactNode;
};

export function ToolCard({ no, title, text, cta, href, demo }: ToolCardProps) {
  return (
    <Link className={styles.tool} href={href}>
      <div className={styles.window}>{demo}</div>
      <span className={styles.no}>{no}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <span className={shared.link}>
        {cta} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

/* ---- demos ---- */

const MINI_STARS: { left: string; top: string; warm?: boolean; delay?: string }[] = [
  { left: "16%", top: "30%" },
  { left: "32%", top: "58%", warm: true, delay: "0.8s" },
  { left: "50%", top: "22%", delay: "1.5s" },
  { left: "68%", top: "48%", warm: true, delay: "0.4s" },
  { left: "82%", top: "30%", delay: "1.1s" },
  { left: "26%", top: "76%", delay: "2s" },
];

export function ShrinkDemo() {
  return (
    <>
      <span className={styles.cap}>Now playing</span>
      {MINI_STARS.map((s, i) => (
        <span
          key={i}
          className={`${styles.miniStar} ${s.warm ? styles.warm : ""}`}
          style={{ left: s.left, top: s.top, animationDelay: s.delay }}
        />
      ))}
      <span className={styles.shrink}>that deadline</span>
    </>
  );
}

export function BreathDemo() {
  return (
    <>
      <span className={styles.cap}>Breathe along</span>
      <span className={styles.dot} style={{ left: "20%", top: "36%" }} />
      <span
        className={styles.dot}
        style={{ left: "28%", top: "66%", animationDelay: "0.2s" }}
      />
      <span
        className={styles.dot}
        style={{ right: "20%", top: "34%", animationDelay: "0.35s" }}
      />
      <span
        className={styles.dot}
        style={{ right: "27%", top: "64%", animationDelay: "0.15s" }}
      />
      <div className={styles.orb} />
      <div className={styles.word}>
        <span className={styles.in}>inhale…</span>
        <span className={styles.out}>exhale…</span>
      </div>
    </>
  );
}
