"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { GlobeView } from "./GlobeInner";

// three.js + the topology are client-only and heavy — never prerender them.
const GlobeInner = dynamic(() => import("./GlobeInner"), { ssr: false });

interface GlobeStageProps {
  size: number;
  view: GlobeView;
  onReady?: () => void;
  /** Set by the parent's animation loop; wraps the whole globe + halo. */
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * The globe plus its atmospheric halo, as one scalable unit.
 *
 * The parent drives `wrapperRef`'s transform every frame, which is how the
 * globe swells and relaxes with the breath and how it collapses to a pinpoint
 * star at the start and end of the session.
 */
export function GlobeStage({
  size,
  view,
  onReady,
  wrapperRef,
}: GlobeStageProps) {
  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 flex items-center justify-center will-change-transform"
      style={{ transformOrigin: "center center" }}
    >
      {/* Wide, cool outer bloom — the soft blue wash in the reference art. */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 1.02,
          height: size * 1.02,
          background:
            "radial-gradient(circle at 50% 50%, rgba(120,190,255,0.36) 0%, rgba(80,150,230,0.20) 38%, rgba(40,90,180,0.08) 58%, transparent 72%)",
          filter: "blur(6px)",
        }}
      />

      {/* Thin warm rim, so the sphere reads as lit from a nearby star. */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 0.755,
          height: size * 0.755,
          boxShadow:
            "0 0 0 1.5px rgba(255,186,120,0.55), 0 0 22px 5px rgba(255,150,70,0.30), 0 0 60px 18px rgba(255,130,50,0.12)",
        }}
      />

      <GlobeInner size={size} view={view} onReady={onReady} />
    </div>
  );
}
