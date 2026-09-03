import styles from "./Offerings.module.css";
import shared from "./shared.module.css";

const OFFERS = [
  {
    no: "— 01",
    title: "Free guided meditations",
    text: "Start softly. A library of free meditations for calm, clarity, and confidence — plus the Pixel Thoughts and Connected Breath tools.",
    cta: "Start Free",
    href: "#apps",
  },
  {
    no: "— 02",
    title: "The Silva Method Immersion",
    text: "Learn the full Silva system — intuition development, visualisation, and manifestation — live with Debalina over transformative weekends.",
    cta: "Learn More",
    href: "#",
  },
  {
    no: "— 03",
    title: "Feminine energy coaching",
    text: "Private sessions and intimate women's circles for chakra healing, art therapy, and reclaiming your soft, magnetic power.",
    cta: "Apply Now",
    href: "#",
  },
];

export default function Offerings() {
  return (
    <section className={styles.offers} id="offers">
      <div className={styles.head}>
        <span className={styles.kicker}>Ways to work together</span>
        <h2 className={styles.title}>
          Choose your <em>path.</em>
        </h2>
      </div>

      <div className={styles.grid}>
        {OFFERS.map((o) => (
          <article key={o.title} className={styles.offer}>
            <span className={styles.no}>{o.no}</span>
            <h3>{o.title}</h3>
            <p>{o.text}</p>
            <a className={shared.link} href={o.href}>
              {o.cta} <span aria-hidden="true">→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
