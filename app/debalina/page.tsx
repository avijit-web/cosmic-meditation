import Nav from "./components/Nav";
import Hero, { HeroBand } from "./components/Hero";
import Marquee from "./components/Marquee";
import PixelThoughts from "./components/PixelThoughts";
import About from "./components/About";
import Offerings from "./components/Offerings";
import Testimonial from "./components/Testimonial";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";

export default function DebalinaPage() {
  return (
    <>
      <HeroBand>
        <Nav />
        <Hero />
      </HeroBand>
      <main>
        <Marquee />
        <PixelThoughts />
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Offerings />
        </Reveal>
        <Reveal>
          <Testimonial />
        </Reveal>
        <Reveal>
          <Newsletter />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
