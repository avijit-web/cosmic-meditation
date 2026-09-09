"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Link2,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Wind,
} from "lucide-react";

interface CompletionPanelProps {
  visible: boolean;
  onReset: () => void;
  onOpenCustomize: () => void;
}

const SHARE_TEXT =
  "I just let a stressful thought dissolve into the cosmos with a 1-minute meditation. Try it and feel a little lighter today:";

const HOW_IT_WORKS = [
  "Write what is bothering you. Any thought, any recent conversation, any moment.",
  "Submit it with your details and click Done.",
  "Watch your thought become smaller and smaller, and release all the physical and mental tension along with it. Read whatever appears on the screen.",
  "Finally, see your thought disappear. It dissolves into the infinite cosmos.",
  "Share it with your loved ones and on social media to help them feel a little lighter today.",
];

const shareUrl = () =>
  typeof window === "undefined" ? "" : `${window.location.origin}/meditation`;

const openWindow = (url: string) =>
  window.open(url, "_blank", "noopener,noreferrer");

export const CompletionPanel: React.FC<CompletionPanelProps> = ({
  visible,
  onReset,
  onOpenCustomize,
}) => {
  const [copied, setCopied] = useState(false);
  const [howOpen, setHowOpen] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${shareUrl()}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — nothing else to do */
    }
  };

  const nativeShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Pixel Thoughts",
          text: SHARE_TEXT,
          url: shareUrl(),
        });
        return;
      } catch {
        /* user dismissed the share sheet */
        return;
      }
    }
    copyLink();
  };

  const message = () => encodeURIComponent(`${SHARE_TEXT} ${shareUrl()}`);

  const socialBtn =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 hover:text-white text-xs font-display font-medium tracking-wide transition-all";

  return (
    <div
      className={`absolute inset-0 z-[35] overflow-y-auto pointer-events-auto transition-all duration-1000 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="min-h-full flex flex-col items-center justify-center px-6 pt-24 pb-10">
        <div className="w-full max-w-xl text-center flex flex-col items-center gap-6">
          {/* headline */}
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-display font-medium tracking-wider shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Thought Dissolved</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-white font-medium tracking-wide drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              Life is much bigger than this moment.
            </h2>
            <p className="font-display text-xs sm:text-sm text-slate-300 max-w-lg font-light tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Your thought has dissolved into the infinite cosmos. Take a deep
              breath and carry this quiet peace with you.
            </p>
          </div>

          {/* share */}
          <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md px-5 py-5 flex flex-col items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <p className="font-display text-sm text-slate-100 leading-relaxed max-w-md">
              Share it with your loved ones &amp; in your Social Media to help
              them feel a little lighter today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={nativeShare}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#a85832] hover:bg-[#ba6339] text-white text-xs font-display font-semibold tracking-wider uppercase transition-all shadow-[0_4px_25px_rgba(168,88,50,0.5)]"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              <button
                onClick={() => openWindow(`https://wa.me/?text=${message()}`)}
                className={socialBtn}
                title="Share on WhatsApp"
              >
                <WhatsAppIcon />
                WhatsApp
              </button>
              <button
                onClick={() =>
                  openWindow(
                    `https://twitter.com/intent/tweet?text=${message()}`,
                  )
                }
                className={socialBtn}
                title="Share on X"
              >
                <XIcon />X
              </button>
              <button
                onClick={() =>
                  openWindow(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl(),
                    )}&quote=${encodeURIComponent(SHARE_TEXT)}`,
                  )
                }
                className={socialBtn}
                title="Share on Facebook"
              >
                <FacebookIcon />
                Facebook
              </button>
              <button
                onClick={copyLink}
                className={socialBtn}
                title="Copy link"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Link2 className="w-3.5 h-3.5" />
                )}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>

          {/* next steps */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#a85832] hover:bg-[#ba6339] text-white text-xs font-display font-semibold tracking-wider uppercase transition-all shadow-[0_4px_25px_rgba(168,88,50,0.5)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Release Another Thought</span>
            </button>

            <Link
              href="/connected"
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-100 hover:text-white text-xs font-display font-semibold tracking-wider uppercase transition-all shadow-md"
            >
              <Wind className="w-3.5 h-3.5 text-cyan-300" />
              <span>Universal Breathing </span>
            </Link>
          </div>

          <button
            onClick={onOpenCustomize}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 hover:text-white transition-all shadow-md text-left"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-300 shrink-0" />
            <span className="flex flex-col leading-tight">
              <span className="text-xs font-display font-semibold tracking-wide">
                Customise Meditation
              </span>
              <span className="text-[11px] font-display text-slate-400">
                Get a personalized Meditation
              </span>
            </span>
          </button>

          {/* how it works */}
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
            <button
              onClick={() => setHowOpen((v) => !v)}
              aria-expanded={howOpen}
              className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left text-sm font-display font-medium text-slate-100 hover:text-white transition-colors"
            >
              <span>How the Stress Release Meditation works?</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  howOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {howOpen && (
              <ol className="px-5 pb-5 pt-1 space-y-2.5 text-left font-display text-[13px] text-slate-300 leading-relaxed list-none">
                {HOW_IT_WORKS.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[11px] font-semibold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* brand marks — lucide has no social icons */
function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5 fill-current"
      aria-hidden="true"
    >
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5 fill-current"
      aria-hidden="true"
    >
      <path d="M18.2 2h3.4l-7.4 8.5L23 22h-6.8l-5.3-7-6.1 7H1.4l7.9-9.1L1 2h7l4.8 6.4L18.2 2zm-1.2 18h1.9L7.1 3.9H5.1L17 20z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-3.5 h-3.5 fill-current"
      aria-hidden="true"
    >
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3z" />
    </svg>
  );
}
