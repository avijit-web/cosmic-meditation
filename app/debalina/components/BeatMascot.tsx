"use client";

import { useEffect, useRef } from "react";
import styles from "./BeatMascot.module.css";

type Props = {
  /** current speech-bubble line */
  line: string;
  /** increments every time Beat should jump */
  jumpKey: number;
};

/** Restart a CSS animation class even if it is mid-flight. */
function replay(el: Element | null, cls: string) {
  if (!el) return;
  el.classList.remove(cls);
  void (el as HTMLElement).getBoundingClientRect(); // force reflow
  el.classList.add(cls);
}

export default function BeatMascot({ line, jumpKey }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const speechRef = useRef<HTMLDivElement>(null);

  // Animations are driven on the DOM directly so React's className stays static.
  useEffect(() => {
    if (jumpKey === 0) return;
    replay(svgRef.current, styles.jump);
    replay(speechRef.current, styles.speechPop);
  }, [jumpKey]);

  return (
    <div className={styles.zone}>
      <div ref={speechRef} className={styles.speech} aria-live="polite">
        {line}
      </div>

      <svg
        ref={svgRef}
        className={styles.mascot}
        onAnimationEnd={(e) => {
          // hand back to the idle float once the jump finishes
          if (e.animationName.includes("beatjump")) {
            e.currentTarget.classList.remove(styles.jump);
          }
        }}
        viewBox="0 0 240 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Beat, the heart mascot"
      >
        <path
          d="M42 118 C 20 108, 12 96, 16 84"
          stroke="#F5E4DC"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          className={styles.arm}
          d="M198 118 C 220 108, 228 96, 224 84"
          stroke="#F5E4DC"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M100 208 L96 236"
          stroke="#F5E4DC"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M140 208 L144 236"
          stroke="#F5E4DC"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <ellipse cx="93" cy="240" rx="12" ry="5.5" fill="#EAD5CC" />
        <ellipse cx="147" cy="240" rx="12" ry="5.5" fill="#EAD5CC" />
        <path
          d="M120 214 C 58 176, 30 138, 34 100 C 37 70, 60 52, 86 56 C 102 59, 114 70, 120 84 C 126 70, 138 59, 154 56 C 180 52, 203 70, 206 100 C 210 138, 182 176, 120 214 Z"
          fill="url(#beatHeartGrad)"
          stroke="rgba(255,255,255,.5)"
          strokeWidth="1.5"
        />
        <ellipse cx="78" cy="148" rx="9" ry="5" fill="#EAD5CC" opacity=".8" />
        <ellipse cx="162" cy="148" rx="9" ry="5" fill="#EAD5CC" opacity=".8" />
        <g className={styles.blink}>
          <ellipse cx="96" cy="122" rx="19" ry="22" fill="#401818" />
          <circle cx="100" cy="117" r="5.5" fill="#fff" />
          <circle cx="92" cy="128" r="2.4" fill="#fff" opacity=".7" />
        </g>
        <g className={`${styles.blink} ${styles.b2}`}>
          <ellipse cx="144" cy="122" rx="19" ry="22" fill="#401818" />
          <circle cx="148" cy="117" r="5.5" fill="#fff" />
          <circle cx="140" cy="128" r="2.4" fill="#fff" opacity=".7" />
        </g>
        <path
          d="M108 164 Q 120 174 132 164"
          stroke="#401818"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient
            id="beatHeartGrad"
            x1="60"
            y1="56"
            x2="190"
            y2="214"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#F1DCD2" />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles.caption}>Beat, your heart companion</div>
    </div>
  );
}
