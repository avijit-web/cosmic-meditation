"use client";

import { useState } from "react";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#apps", label: "Meditations" },
  { href: "#about", label: "About" },
  { href: "#classes", label: "Classes" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav} aria-label="Primary">
      <a className={styles.logo} href="#top">
        Debalina
      </a>

      <div className={styles.links}>
        {LINKS.map((l) => (
          <a key={l.label} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>

      <div className={styles.right}>
        <a className={styles.cta} href="#join">
          Join Free
        </a>
        <button
          type="button"
          className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#join" onClick={() => setOpen(false)}>
          Join Free
        </a>
      </div>
    </nav>
  );
}
