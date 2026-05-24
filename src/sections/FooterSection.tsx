import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { config } from '../config';

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const namesRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const loveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(noteRef.current, {
              opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            });
            gsap.to(namesRef.current, {
              opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.3,
            });
            gsap.to(dateRef.current, {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5,
            });
            gsap.to(loveRef.current, {
              opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative py-20 md:py-24 text-center"
      style={{
        zIndex: 2,
        backgroundColor: '#3D3229',
      }}
    >
      <div className="max-w-[480px] mx-auto px-6">
        <p
          ref={noteRef}
          className="font-display italic text-[20px] md:text-[26px] leading-relaxed mb-6"
          style={{
            color: 'rgba(247,240,232,0.9)',
            opacity: 0,
            transform: 'translateY(20px)',
          }}
        >
          Мы будем счастливы разделить этот день с самыми близкими и дорогими людьми. Спасибо, что вы с нами.
        </p>

        <p
          ref={namesRef}
          className="font-script text-[32px] md:text-[44px] text-antique-gold mb-4"
          style={{ opacity: 0, transform: 'scale(0.9)' }}
        >
          {config.couple.namesShort}
        </p>

        <p
          ref={dateRef}
          className="font-display text-[18px] md:text-[22px] tracking-[0.15em] uppercase"
          style={{
            color: 'rgba(247,240,232,0.6)',
            opacity: 0,
            transform: 'translateY(15px)',
          }}
        >
          {config.wedding.date}
        </p>
      </div>
    </footer>
  );
}
