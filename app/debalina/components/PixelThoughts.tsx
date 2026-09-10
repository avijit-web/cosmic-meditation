"use client";

import { useCallback, useState } from "react";
import styles from "./PixelThoughts.module.css";
import BeatMascot from "./BeatMascot";
import { BreathDemo, ShrinkDemo, ToolCard } from "./ToolCards";

const BEAT_LINES = [
  "hi, I'm Beat ♥",
  "pick a meditation, I'll come along",
  "one minute is all it takes",
  "breathe with me…",
  "so proud of you",
];

export default function PixelThoughts() {
  const [line, setLine] = useState(BEAT_LINES[0]);
  const [jumpKey, setJumpKey] = useState(0);

  // Beat jumps and says something new whenever you tap him
  const poke = useCallback(() => {
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
        {/* <span className={styles.kicker}>Free mind-calming tools</span> */}
        <h2 className={styles.title}>
          Meditation is very Simple. <em>Let me show you</em>
        </h2>
        {/* <p>
          Certified Silva International instructor with 8+ years training
          meditation practitioners across India and abroad. Specialising in
          intuition development, manifestation, and feminine energy work.
        </p> */}
      </div>

      <div className={styles.grid}>
        <ToolCard
          label="Meditation 1"
          title="Get rid of Overthinking/Worries in 1 minute"
          text="Type the worry looping in your head, then watch it shrink into a tiny star among millions. Sixty seconds to a lighter mind."
          cta="Shrink a worry"
          href="/meditation"
          demo={<ShrinkDemo />}
        />

        <button
          type="button"
          className={styles.mascotSlot}
          onClick={poke}
          aria-label="Say hi to Beat"
        >
          <BeatMascot line={line} jumpKey={jumpKey} />
        </button>

        <ToolCard
          label="Meditation 2"
          title="Universal Breathing"
          text="Inhale… exhale… together. Sync your breathing with women around the world and feel the quiet magic of breathing as one."
          cta="Breathe together"
          href="/connected"
          demo={<BreathDemo />}
        />
      </div>
    </section>
  );
}
