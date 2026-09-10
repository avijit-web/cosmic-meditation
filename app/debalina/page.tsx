import Nav from "./components/Nav";
import Hero, { HeroBand } from "./components/Hero";
import Marquee from "./components/Marquee";
import PixelThoughts from "./components/PixelThoughts";
import About from "./components/About";
import UpcomingClasses from "./components/UpcomingClasses";
import Testimonial from "./components/Testimonial";
import VideoTestimonials from "./components/VideoTestimonials";
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
          <UpcomingClasses />
        </Reveal>
        {/* <Reveal>
          <Testimonial />
        </Reveal> */}
        <Reveal>
          <VideoTestimonials />
        </Reveal>
        <Reveal>
          <Newsletter />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
