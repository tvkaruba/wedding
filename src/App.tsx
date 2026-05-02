import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleCanvas from './sections/ParticleCanvas';
import HeroSection from './sections/HeroSection';
import DetailsSection from './sections/DetailsSection';
import RSVPSection from './sections/RSVPSection';
import TimelineSection from './sections/TimelineSection';
import FooterSection from './sections/FooterSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf as any);
    };
  }, []);

  return (
    <>
      {/* Fixed background layers */}
      <ParticleCanvas />
      <div className="paper-grain" />
      <div className="vignette-overlay" />
      <div className="page-background" />

      {/* Main content */}
      <main className="relative" style={{ zIndex: 2 }}>
        <HeroSection />
        <DetailsSection />
        <RSVPSection />
        <TimelineSection />
        <FooterSection />
      </main>
    </>
  );
}

export default App;
