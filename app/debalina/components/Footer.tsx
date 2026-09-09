import styles from "./Footer.module.css";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#apps", label: "Meditations" },
  { href: "#about", label: "About" },
  { href: "#classes", label: "Classes" },
  { href: "#", label: "Speaking" },
  { href: "#", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
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
      <small>
        © {new Date().getFullYear()} Debalina Chatterjee · Made with calm minds
        &amp; warm hearts
      </small>
    </footer>
  );
}
