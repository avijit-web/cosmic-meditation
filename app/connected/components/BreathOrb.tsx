"use client";

import React from "react";

interface BreathOrbProps {
  /** Base diameter in px, before the animated scale is applied. */
  size: number;
  /** Written to by the session loop every frame. */
  orbRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * The luminous orb from the single-player meditation, reused here as the
 * "you" avatar before it collapses into a star and joins the orbit.
 *
 * Visual treatment is intentionally identical to `ThoughtMeditationGame` so the
 * two experiences feel like the same universe.
 */
export function BreathOrb({ size, orbRef }: BreathOrbProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        ref={orbRef}
        className="relative flex items-center justify-center will-change-transform"
        style={{
          width: size,
          height: size,
          transformOrigin: "center center",
          transform: "translate3d(0,0,0) scale(1)",
          opacity: 0,
        }}
      >
        {/* Ethereal corona — pure atmospheric falloff, no borders. */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -size * 0.15,
            background:
              "radial-gradient(circle at 50% 50%, rgba(255, 210, 150, 0.42) 0%, rgba(255, 160, 90, 0.18) 45%, rgba(255, 120, 50, 0.05) 65%, transparent 75%)",
          }}
        />

        {/* Radiant core. */}
        <div
          className="relative w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at 38% 38%, #ffffff 0%, #fffcf5 32%, #f8e5c8 62%, #f0a754 88%, #d97828 100%)",
            filter:
              "drop-shadow(0 0 25px rgba(255, 180, 90, 0.85)) drop-shadow(0 0 60px rgba(255, 130, 40, 0.45))",
          }}
        >
          {/* Core shimmer highlight. */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.3) 35%, transparent 60%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
