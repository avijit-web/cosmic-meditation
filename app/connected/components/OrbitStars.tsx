"use client";

import React, { useMemo } from "react";

export interface StarView {
  key: string;
  /** Set once when the star joins, so it can bloom in. */
  bornAt: number;
  isYou: boolean;
  size: number;
}

interface OrbitStarsProps {
  stars: StarView[];
  /** Filled by this component; the parent writes transforms into it. */
  nodeRefs: React.RefObject<Map<string, HTMLDivElement>>;
  /** Star currently being called out — gets the orange ring. */
  spotlightKeys: Set<string>;
  /**
   * Dissolve the whole cluster. Done in CSS rather than the animation loop
   * because the loop has already stopped by the time the tally appears.
   */
  fadeOut?: boolean;
}

/**
 * The participant stars.
 *
 * Rendered as plain DOM rather than inside the WebGL scene: positions are
 * written straight to `style.transform` by the session's animation loop, which
 * keeps the orbit → centre finale and the orb hand-off simple and jank-free.
 */
export function OrbitStars({
  stars,
  nodeRefs,
  spotlightKeys,
  fadeOut = false,
}: OrbitStarsProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      // Stays at exactly 1 during the session: any lower value would spawn a
      // stacking context and flatten the per-star depth ordering.
      style={{ opacity: fadeOut ? 0 : 1, transition: "opacity 1.6s ease" }}
    >
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {stars.map((star) => (
          <Star
            key={star.key}
            star={star}
            spotlit={spotlightKeys.has(star.key)}
            nodeRefs={nodeRefs}
          />
        ))}
      </div>
    </div>
  );
}

function Star({
  star,
  spotlit,
  nodeRefs,
}: {
  star: StarView;
  spotlit: boolean;
  nodeRefs: React.RefObject<Map<string, HTMLDivElement>>;
}) {
  const ringSize = useMemo(() => star.size + 12, [star.size]);

  return (
    <div
      ref={(node) => {
        const map = nodeRefs.current;
        if (!map) return;
        if (node) map.set(star.key, node);
        else map.delete(star.key);
      }}
      className="absolute will-change-transform"
      style={{
        left: 0,
        top: 0,
        marginLeft: -star.size / 2,
        marginTop: -star.size / 2,
        width: star.size,
        height: star.size,
        opacity: 0,
      }}
    >
      {/* Your own star keeps a warm corona so it stays findable in the crowd. */}
      {star.isYou && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -star.size * 0.9,
            background:
              "radial-gradient(circle, rgba(255,196,132,0.5) 0%, rgba(255,150,70,0.18) 45%, transparent 72%)",
          }}
        />
      )}

      {/* The star itself. */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: star.isYou
            ? "radial-gradient(circle at 36% 34%, #ffffff 0%, #fff3dc 45%, #ffc478 100%)"
            : "radial-gradient(circle at 36% 34%, #ffffff 0%, #eaf4ff 55%, #b9d6f5 100%)",
          boxShadow: star.isYou
            ? "0 0 12px 3px rgba(255,190,120,0.95), 0 0 26px 8px rgba(255,150,70,0.45)"
            : "0 0 8px 2px rgba(210,232,255,0.8), 0 0 18px 5px rgba(150,200,255,0.28)",
        }}
      />

      {/* Spotlight ring for whoever just joined (or for "this is you"). */}
      <div
        className="absolute rounded-full transition-all duration-700 ease-out"
        style={{
          left: (star.size - ringSize) / 2,
          top: (star.size - ringSize) / 2,
          width: ringSize,
          height: ringSize,
          border: "1.5px solid rgba(255,163,72,0.95)",
          boxShadow: "0 0 14px 3px rgba(255,150,60,0.45)",
          opacity: spotlit ? 1 : 0,
          transform: `scale(${spotlit ? 1 : 0.55})`,
        }}
      />
    </div>
  );
}
