import { Star } from "lucide-react";
import styles from "./UpcomingClasses.module.css";

type ClassItem = {
  title: string;
  /** Path under /public. Leave out until a photo exists; the card falls back to a tinted panel. */
  image?: string;
  daysLeft: number;
  tagline: string;
  rating: number;
  reviews: number;
  href: string;
};

/* Day counts, ratings and review counts are placeholders — edit here. */
const CLASSES: ClassItem[] = [
  {
    title: "Healing Through Art Workshop",
    image: "/images/Healing through Art.jpg",
    daysLeft: 3,
    tagline: "Turn your emotions into art & experience inner healing.",
    rating: 4.8,
    reviews: 96,
    href: "https://www.silvamethod.in/healing-through-art/",
  },
  {
    title: "Silva Intuition System Course",
    image: "/images/Silva Intuition System.jpg",
    daysLeft: 3,
    tagline: "Train your mind to recognize and trust intuitive insights.",
    rating: 4.9,
    reviews: 212,
    href: "https://www.silvamethod.in/silva-intuition-course/",
  },
  {
    title: "Silva Method Graduation Course",
    image: "/images/Silva Method Graduation.jpg",
    daysLeft: 10,
    tagline:
      "Go beyond the basics & learn Silva Method techniques at a deeper level.",
    rating: 4.9,
    reviews: 318,
    href: "https://www.silvamethod.in/basic-lecture-series/",
  },
  {
    title: "Millionaire Mindset Workshop",
    image:
      "https://www.silvamethod.in/courses/new_assets/ChatGPT%20Image%20Jul%2031,%202026,%2011_28_07%20AM%20(1).png",
    // No photo yet — drop one in /public/images and add `image: "/images/…"`.
    daysLeft: 18,
    tagline: "Rewire your thinking for wealth, growth & success.",
    rating: 4.8,
    reviews: 71,
    href: "https://www.silvamethod.in/courses/millionaire-mindset/",
  },
  {
    title: "Silva Method Retreat",
    image: "/images/retreat.jpg",
    daysLeft: 49,
    tagline: "Disconnect from the noise & reconnect with yourself.",
    rating: 4.7,
    reviews: 54,
    href: "https://www.silvamethod.in/courses/goa-retreat-2026/",
  },
];

export default function UpcomingClasses() {
  return (
    <section className={styles.section} id="classes">
      <div className={styles.head}>
        <span className={styles.kicker}>Learn with Debalina</span>
        <h2 className={styles.title}>
          Upcoming <em>classes.</em>
        </h2>
      </div>

      <div className={styles.grid}>
        {CLASSES.map((c) => (
          <article key={c.title} className={styles.card}>
            <div className={styles.media}>
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.title}
                  sizes="(max-width: 560px) 92vw, (max-width: 820px) 46vw, (max-width: 1180px) 31vw, 19vw"
                />
              ) : (
                // Stand-in until a photo lands: the title's initial on maroon.
                <span className={styles.placeholder} aria-hidden="true">
                  {c.title.charAt(0)}
                </span>
              )}
              <span className={styles.starts}>
                <b>{c.daysLeft}</b>
                <small>{c.daysLeft === 1 ? "Day left" : "Days left"}</small>
              </span>
            </div>

            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{c.title}</h3>

              <div className={styles.rating}>
                <span className={styles.stars} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={15} strokeWidth={0} />
                  ))}
                </span>
                <span className={styles.score}>({c.rating.toFixed(1)})</span>
                <a className={styles.reviews} href={c.href}>
                  {c.reviews} Reviews
                </a>
              </div>

              <p className={styles.tagline}>{c.tagline}</p>

              <a className={styles.register} href={c.href}>
                Register Now
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
