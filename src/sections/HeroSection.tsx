import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { config } from '../config';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(photoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    })
      .to(
        namesRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .to(
        taglineRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .to(
        dateRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .to(
        scrollRef.current,
        { opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );

    // Hero exit blur on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const section = sectionRef.current;
      if (!section) return;
      if (scrollY > 100) {
        const progress = Math.min((scrollY - 100) / 300, 1);
        section.style.opacity = String(1 - progress * 0.4);
        section.style.filter = `blur(${progress * 2}px)`;
      } else {
        section.style.opacity = '1';
        section.style.filter = 'blur(0px)';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      tl.kill();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-[720px] mx-auto px-6">
        {/* Couple Photo */}
        <div
          ref={photoRef}
          className="relative mx-auto mb-10"
          style={{
            width: 320,
            height: 320,
            opacity: 0,
            transform: 'scale(0.8)',
          }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-antique-gold/40">
            <img
              src="./images/couple-hero.jpg"
              alt={config.couple.namesFull.replace('&', 'и')}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, transparent 50%, rgba(201,168,124,0.3) 100%)',
              }}
            />
          </div>
        </div>

        {/* Names */}
        <h1
          ref={namesRef}
          className="font-script text-[44px] md:text-[64px] text-warm-brown tracking-wide mb-5"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          {config.couple.namesFull}
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-display italic text-[20px] md:text-[32px] text-muted-sepia tracking-wide leading-relaxed mb-5"
          style={{ opacity: 0, transform: 'translateY(15px)' }}
        >
          Приглашаем разделить с нами самый важный день
        </p>

        {/* Date */}
        <p
          ref={dateRef}
          className="font-display text-[28px] md:text-[40px] text-antique-gold uppercase tracking-[0.15em]"
          style={{ opacity: 0, transform: 'translateY(15px)' }}
        >
          {config.wedding.date}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        style={{ opacity: 0 }}
      >
        <div className="relative w-[1px] h-10 bg-antique-gold/40">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-antique-gold"
            style={{
              animation: 'scrollPulse 1.5s ease-in-out infinite',
            }}
          />
        </div>
        <p className="font-body text-xs text-muted-sepia mt-2">Листайте вниз</p>
        <style>{`
          @keyframes scrollPulse {
            0%, 100% { transform: translate(-50%, 0); }
            50% { transform: translate(-50%, 28px); }
          }
        `}</style>
      </div>
    </section>
  );
}
