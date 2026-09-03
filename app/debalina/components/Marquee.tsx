import { Fragment } from "react";
import styles from "./Marquee.module.css";

const WORDS = ["Magnetic", "Abundant", "Effortless", "Feminine"];

export default function Marquee() {
  // Two identical halves so the -50% translate loops seamlessly.
  const half = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {[0, 1].map((copy) =>
          half.map((w, i) => (
            <Fragment key={`${copy}-${i}`}>
              <span>{w}</span>
              <i>✦</i>
            </Fragment>
          )),
        )}
      </div>
    </div>
  );
}
