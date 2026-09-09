"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import styles from "./VideoTestimonials.module.css";

const LIBRARY_ID = "684567";
const PULL_ZONE = "https://vz-59d58bd6-d7f.b-cdn.net";

const VIDEO_IDS = [
  "2fbed20d-f8e4-4046-abe4-6606a9943513",
  "a5c7f8a4-e231-40c4-9617-3c10a4875ab0",
  "32352410-41d0-4fd4-aef7-0b3be1f3695d",
  "5da6710f-209f-4367-9b34-b6a695c06805",
  "5991f76a-78cc-4429-954c-0efbdaa97e0a",
  "b31e9a69-4a6d-4f1f-a8bc-ea7bea969873",
  "acc44796-e102-4a51-9588-f82e4f796449",
  "824835ae-bed6-45d3-a1bb-fbfa82636fdd",
  "9f640e25-b820-4a71-9d89-cdfc7b0a705f",
  "fa5bfe3e-9016-4837-bd66-2e46f4467c46",
  "b9077a88-2118-4acd-8360-03a7299d87e9",
  "f8f6b5ea-c2b7-497f-b816-b929e810495d",
  "67520f05-63f5-4348-a34d-d219c4f25c10",
  "f8ae31c9-7518-4d48-bfa2-9b367d057b99",
];

const posterUrl = (id: string) => `${PULL_ZONE}/${id}/thumbnail.jpg`;
const embedUrl = (id: string) =>
  `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${id}?autoplay=true`;

/**
 * Video testimonials, as a native scroll-snap carousel.
 *
 * Every card is a lightweight poster until it's clicked; only one Bunny
 * embed exists at a time, so fourteen videos never mean fourteen iframes.
 */
export default function VideoTestimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const scrollByPage = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="stories" aria-labelledby="stories-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <span className={styles.kicker}>
            <i />
            Testimonials
            <i />
          </span>
          <h2 id="stories-title" className={styles.title}>
            Hear it straight from <em>our graduates.</em>
          </h2>
          <p className={styles.lead}>
            Real people, real shifts — a few words from those who have already
            sat on this shore.
          </p>
        </header>

        <div className={styles.carousel}>
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="Previous testimonials"
            className={`${styles.arrow} ${styles.arrowPrev}`}
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <div ref={trackRef} className={styles.track}>
            {VIDEO_IDS.map((id, i) => (
              <div key={id} className={styles.slide}>
                <div className={styles.frame}>
                  {activeId === id ? (
                    <iframe
                      src={embedUrl(id)}
                      className={styles.player}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      title={`Testimonial ${i + 1}`}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveId(id)}
                      aria-label={`Play testimonial ${i + 1}`}
                      className={styles.poster}
                    >
                      {/* Plain <img>: posters come from a third-party CDN and
                          next/image would need a remotePatterns entry for no
                          real gain on a lazy thumbnail. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={posterUrl(id)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <span className={styles.shade} aria-hidden="true" />
                      <span className={styles.play} aria-hidden="true">
                        <Play fill="currentColor" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="Next testimonials"
            className={`${styles.arrow} ${styles.arrowNext}`}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
