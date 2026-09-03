"use client";

import { useCallback, useState } from "react";
import styles from "./PixelThoughts.module.css";
import LanternSky from "./LanternSky";
import BeatMascot from "./BeatMascot";
import { BreathDemo, ShrinkDemo, ToolCard } from "./ToolCards";

const BEAT_LINES = [
  "there it goes… ♥",
  "watch it drift away",
  "one worry lighter",
  "the moon grew a little",
  "so proud of you",
];

export default function PixelThoughts() {
  const [released, setReleased] = useState(0);
  const [line, setLine] = useState("I lit these lanterns for you ♥");
  const [jumpKey, setJumpKey] = useState(0);

  const handleRelease = useCallback(() => {
    setReleased((n) => n + 1);
    setLine((prev) => {
      const pool = BEAT_LINES.filter((l) => l !== prev);
      return pool[Math.floor(Math.random() * pool.length)];
    });
    setJumpKey((k) => k + 1);
  }, []);

  return (
    <section className={styles.section} id="apps">
      <div className={styles.stars} aria-hidden="true" />
      <span className={styles.ghost} aria-hidden="true">
        let go
      </span>

      <div className={styles.head}>
        <span className={styles.kicker}>Free mind-calming tools</span>
        <h2 className={styles.title}>
          Pixel <em>Thoughts</em>
        </h2>
        <p>
          Certified Silva International instructor with 8+ years training
          meditation practitioners across India and abroad. Specialising in
          intuition development, manifestation, and feminine energy work.
        </p>
      </div>

      <LanternSky released={released} onRelease={handleRelease} />

      <div className={styles.grid}>
        <ToolCard
          no="no. 01"
          title="Pixel Thoughts"
          text="Type the worry looping in your head, then watch it shrink into a tiny star among millions. Sixty seconds to a lighter mind."
          cta="Shrink a worry"
          href="/meditation"
          demo={<ShrinkDemo />}
        />

        <div className={styles.mascotSlot}>
          <BeatMascot line={line} jumpKey={jumpKey} />
        </div>

        <ToolCard
          no="no. 02"
          title="Connected Breath"
          text="Inhale… exhale… together. Sync your breathing with women around the world and feel the quiet magic of breathing as one."
          cta="Breathe together"
          href="/connected"
          demo={<BreathDemo />}
        />
      </div>
    </section>
  );
}
