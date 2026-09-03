"use client";

import React, { useEffect, useState } from "react";

interface LiveCountProps {
  /** The headcount the session will actually open with. */
  base: number;
}

/** Never let the room look emptier than this, whatever the drift does. */
const FLOOR = 2;
/** How far the reading is allowed to wander from `base`. */
const BELOW = 3;
const ABOVE = 4;

/**
 * "N people breathing right now", styled like a live presence indicator.
 *
 * The number wanders up and down by one (occasionally two) every few seconds,
 * the way a real room's headcount would as people come and go. It stays within
 * a few of `base` so the count you're promised on this screen and the circle
 * you meet inside never disagree by more than a person or two.
 */
export function LiveCount({ base }: LiveCountProps) {
  // The parent keys this component on `base`, so a re-rolled session simply
  // remounts it with the new starting number — no syncing effect needed.
  const [count, setCount] = useState(base);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      // Irregular cadence reads as human; a metronome reads as a script.
      const wait = 2400 + Math.random() * 3800;
      timer = setTimeout(() => {
        setCount((prev) => {
          const magnitude = Math.random() < 0.18 ? 2 : 1;
          const step = Math.random() < 0.5 ? -magnitude : magnitude;
          const lo = Math.max(FLOOR, base - BELOW);
          const hi = base + ABOVE;
          const next = Math.min(hi, Math.max(lo, prev + step));
          // Drifted into a wall? Bounce the other way rather than sit still.
          return next === prev ? Math.min(hi, Math.max(lo, prev - step)) : next;
        });
        setTick((t) => t + 1);
        schedule();
      }, wait);
    };

    schedule();
    return () => clearTimeout(timer);
  }, [base]);

  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 text-[11px] sm:text-xs font-display tracking-wide shadow-[0_0_24px_rgba(52,211,153,0.15)]">
      {/* Live dot: a steady core with a soft ping ring, like a presence light. */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
      </span>

      <span>
        {/* Re-keyed on every change so the number visibly ticks over. */}
        <span
          key={tick}
          className="inline-block font-semibold text-emerald-300 tabular-nums animate-count-tick"
        >
          {count}
        </span>{" "}
        {count === 1 ? "person" : "people"} breathing right now
      </span>
    </span>
  );
}
