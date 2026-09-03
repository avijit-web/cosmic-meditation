import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import styles from "./debalina.module.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Debalina Chatterjee — A Calmer Mind, A Softer Life",
  description:
    "Guided meditation, manifestation practice, and feminine energy work with a certified Silva International instructor and TEDx speaker.",
};

export default function DebalinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${manrope.variable} ${fraunces.variable} ${styles.root}`}>
      {children}
    </div>
  );
}
