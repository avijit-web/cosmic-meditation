"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./LanternSky.module.css";

type Lantern = {
  id: number;
  text: string;
  left: number;
  top: number;
  delay: number;
  releasing: boolean;
  fresh: boolean;
};

const STARTERS: [string, number, number, number][] = [
  ["overthinking…", 6, 24, 0],
  ["that deadline", 26, 58, 1.1],
  ["what if…?", 44, 18, 0.5],
  ["monday again", 60, 56, 1.7],
  ["did I say too much?", 66, 34, 0.8],
];

const DEFAULT_NOTE = "when the moon is full, your mind is clear";
const RELEASE_MS = 2350;

let nextId = 1;
const starterLanterns = (): Lantern[] =>
  STARTERS.map(([text, left, top, delay]) => ({
    id: nextId++,
    text,
    left,
    top,
    delay,
    releasing: false,
    fresh: false,
  }));

type Props = {
  /** number of lanterns released so far (owned by the parent so Beat can react) */
  released: number;
  onRelease: () => void;
};

export default function LanternSky({ released, onRelease }: Props) {
  const [lanterns, setLanterns] = useState<Lantern[]>(starterLanterns);
  const [value, setValue] = useState("");
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [empty, setEmpty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  const pct = Math.min(100, Math.round(released * 12.5));
  // shade slides away: -30% (crescent) → -115% (full moon)
  const shift = -30 - pct * 0.85;
  const full = pct >= 100;

  const release = useCallback(
    (id: number) => {
      setLanterns((ls) =>
        ls.map((l) => (l.id === id ? { ...l, releasing: true } : l)),
      );
      onRelease();
      const t = window.setTimeout(() => {
        setLanterns((ls) => {
          const rest = ls.filter((l) => l.id !== id);
          if (rest.length === 0) {
            setNote("the sky is clear, the moon is bright");
            setEmpty(true);
          }
          return rest;
        });
      }, RELEASE_MS);
      timers.current.push(t);
    },
    [onRelease],
  );

  const add = () => {
    const text = value.trim();
    if (!text) {
      inputRef.current?.focus();
      return;
    }
    setLanterns((ls) => [
      ...ls,
      {
        id: nextId++,
        text,
        left: 8 + Math.random() * 62,
        top: 16 + Math.random() * 52,
        delay: Math.random() * 1.5,
        releasing: false,
        fresh: true,
      },
    ]);
    setEmpty(false);
    setNote("now tap it — and let it rise");
    setValue("");
  };

  const restore = () => {
    setLanterns(starterLanterns());
    setEmpty(false);
    setNote(DEFAULT_NOTE);
  };

  return (
    <div className={styles.game}>
      <div className={styles.hint} aria-live="polite">
        {full
          ? "the moon is full — beautifully done ✦"
          : "tap a lantern to release the worry it carries"}
      </div>

      <div className={styles.sky}>
        <div className={`${styles.moon} ${full ? styles.moonFull : ""}`}>
          <div
            className={styles.shade}
            style={{ transform: `translateX(${shift}%)` }}
          />
        </div>
        <div className={styles.moonLabel}>The calm moon · {pct}%</div>

        {lanterns.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`${styles.lantern} ${l.releasing ? styles.release : ""} ${
              l.fresh && !l.releasing ? styles.arrive : ""
            }`}
            style={
              {
                "--left": `${l.left}%`,
                top: `${l.top}%`,
                animationDelay:
                  l.releasing || l.fresh ? undefined : `${l.delay}s`,
              } as React.CSSProperties
            }
            onClick={() => !l.releasing && release(l.id)}
            aria-label={`Release the worry: ${l.text}`}
          >
            <span className={styles.body}>{l.text}</span>
          </button>
        ))}
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          maxLength={42}
          placeholder="write a worry on a lantern…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Write a worry"
        />
        <button type="submit">Light it ✦</button>
      </form>

      <div className={styles.note}>
        <span>{note}</span>
        {empty && (
          <>
            <br />
            <button type="button" className={styles.restore} onClick={restore}>
              light new lanterns ✦
            </button>
          </>
        )}
      </div>
    </div>
  );
}
