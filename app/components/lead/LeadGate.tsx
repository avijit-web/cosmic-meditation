"use client";

import React from "react";
import { LeadForm } from "./LeadForm";
import type { Lead } from "./types";

interface LeadGateProps {
  open: boolean;
  /** Fires once the form validates. */
  onCaptured: (lead: Lead) => void;
  title?: string;
  lead?: string;
  submitLabel?: string;
}

/**
 * The introduce-yourself step in front of a meditation.
 *
 * Deliberately has no close button: the games only start once the form is
 * in. It's a plain overlay rather than a dialog element so it behaves the same
 * inside the two very different game layouts (one is a pointer-events-none
 * HUD, the other a fixed stage).
 */
export function LeadGate({
  open,
  onCaptured,
  title = "Before we begin",
  lead = "Tell us who's breathing with us, and we'll take you straight in.",
  submitLabel = "Begin ✦",
}: LeadGateProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-5 pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-gate-title"
    >
      {/* Dimmed, blurred sky behind the card. */}
      <div className="absolute inset-0 bg-[#02030a]/70 backdrop-blur-md animate-fade-up" />

      <div
        className="relative w-full max-w-[440px] rounded-3xl border border-white/10 bg-[#0b0e1a]/85 px-7 py-9 sm:px-10 sm:py-11 shadow-[0_30px_80px_rgba(0,0,0,0.6)] animate-fade-up"
        style={
          {
            // Palette for the shared form: cream on night, amber for errors.
            "--lead-fg": "#f4efe6",
            "--lead-fg-soft": "rgba(244,239,230,0.45)",
            "--lead-line": "rgba(244,239,230,0.35)",
            "--lead-accent": "#ffb86b",
            "--lead-serif": "var(--font-geist-sans), 'Outfit', system-ui, sans-serif",
            "--lead-bg": "#0b0e1a",
            "--lead-btn-fg": "#0b0e1a",
          } as React.CSSProperties
        }
      >
        <p className="text-[11px] uppercase tracking-[0.4em] text-amber-300/80 font-display">
          One small step
        </p>
        <h2
          id="lead-gate-title"
          className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight"
        >
          {title}
        </h2>
        <p className="mt-2 mb-8 text-sm text-slate-300/85 font-display leading-relaxed">
          {lead}
        </p>

        {/* Asked on every start by design, and always blank — nothing is
            remembered between sessions. */}
        <LeadForm onSubmit={onCaptured} submitLabel={submitLabel} />
      </div>
    </div>
  );
}
