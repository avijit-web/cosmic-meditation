import styles from "./Testimonial.module.css";

export default function Testimonial() {
  return (
    <section className={styles.quote}>
      <div className={styles.rule} />
      <blockquote>
        &ldquo;I came for meditation and left with{" "}
        <em>a whole new relationship with myself.</em> Debalina makes the inner
        work feel like coming home.&rdquo;
      </blockquote>
      <cite>— A Silva Immersion Student</cite>
    </section>
  );
}
