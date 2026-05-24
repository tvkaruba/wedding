import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { config } from '../config';

const details = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A87C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: 'Когда',
    value: config.wedding.date,
    sub: `Сбор гостей в ${config.wedding.time}`,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A87C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Где',
    value: config.wedding.venue,
    sub: config.wedding.location,
    link: config.wedding.mapLink,
    linkText: 'Открыть на карте',
  },
];

export default function DetailsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(headingRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
            });

            itemRefs.current.forEach((el, i) => {
              if (!el) return;
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.2 + i * 0.2,
              });
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-padding"
      style={{ zIndex: 2 }}
    >
      <div className="content-max-width-sm text-center">
        <h2
          ref={headingRef}
          className="font-display italic text-[32px] md:text-[48px] text-warm-brown tracking-[0.05em]"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          Детали торжества
        </h2>
        <div className="divider-line" />

        <div className="flex flex-col gap-12">
          {details.map((d, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="flex flex-col items-center gap-3"
              style={{ opacity: 0, transform: 'translateY(20px)' }}
            >
              <div className="mb-2" style={{ transform: 'scale(1.3)' }}>{d.icon}</div>
              <p className="font-body text-sm uppercase tracking-[0.15em] text-muted-sepia">
                {d.label}
              </p>
              <p className="font-display text-[28px] md:text-[28px] text-warm-brown">
                {d.value}
              </p>
              <p className="font-body text-base md:text-lg text-muted-sepia leading-relaxed max-w-[480px]">
                {d.sub}
              </p>
              {d.link && (
                <a
                  href={d.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-base text-muted-sepia underline hover:text-warm-brown transition-colors"
                >
                  {d.linkText}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="divider-line mt-12" />
      </div>
    </section>
  );
}
