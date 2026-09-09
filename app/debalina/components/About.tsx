import Image from "next/image";
import styles from "./About.module.css";

/** Portrait shown in the arch. Drop the file in /public/images to swap it. */
const PORTRAIT = "/images/image.png";

const BADGES = [
  "TEDx Speaker",
  "Entrepreneur",
  "Certified Silva Instructor",
  "Manifestation Coach",
  "Chakra Healer",
  "Art Therapy Practitioner",
];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.visual}>
        <div className={styles.arch}>
          <Image
            src={PORTRAIT}
            alt="Debalina Chatterjee"
            fill
            sizes="(max-width: 700px) 78vw, 320px"
            priority
          />
        </div>
        <div className={styles.est}>
          <span>
            EST.
            <br />
            2018
          </span>
        </div>
      </div>

      <div className={styles.copy}>
        <span className={styles.kicker}>Meet your guide</span>
        <h2 className={styles.title}>
          Your manifestation fairygodmother is here.
        </h2>
        <p>
          I&apos;m Debalina — a TEDx speaker, certified Silva International
          instructor, and lifelong believer that a woman who calms her mind can
          create anything.
        </p>
        <p>
          For 8+ years I&apos;ve guided practitioners across India and abroad
          through deep meditation, intuition development, chakra healing, and
          art therapy — blending ancient practice with playful, modern tools.
        </p>
        <div className={styles.badges}>
          {BADGES.map((b) => (
            <span key={b} className={styles.badge}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
