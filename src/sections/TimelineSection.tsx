import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { config } from '../config';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function parseWeddingDate(dateStr: string, timeStr: string): Date {
  const [day, month, year] = dateStr.split('.').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function getTimeLeft(): TimeLeft {
  const target = parseWeddingDate(config.wedding.date, config.wedding.time);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const timelineItems = [
  {
    time: '15:00',
    title: 'Сбор гостей',
    sub: 'Встречаемся на площадке, знакомимся, фуршет',
  },
  {
    time: '16:00',
    title: 'Церемония',
    sub: 'Выездная регистрация под открытым небом',
  },
  {
    time: '17:30',
    title: 'Банкет',
    sub: 'Ужин, тёплые речи, танцы до утра',
  },
  {
    time: '21:00',
    title: 'Вечеринка',
    sub: 'Танцы, конкурсы, запуск небесных фонариков',
  },
];

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(headingRef.current, {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            });

            const boxes = countdownRef.current?.querySelectorAll('.countdown-box');
            boxes?.forEach((b, i) => {
              gsap.to(b, {
                opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.1,
              });
            });

            const items = timelineRef.current?.querySelectorAll('.timeline-item');
            items?.forEach((item, i) => {
              gsap.to(item, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.3 + i * 0.15,
              });
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const isWeddingDay =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  const countdownData = [
    { value: timeLeft.days, label: 'Дней' },
    { value: timeLeft.hours, label: 'Часов' },
    { value: timeLeft.minutes, label: 'Минут' },
    { value: timeLeft.seconds, label: 'Секунд' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative section-padding"
      style={{ zIndex: 2 }}
    >
      <div className="content-max-width text-center">
        {/* Countdown */}
        <div className="mb-20">
          <h2
            ref={headingRef}
            className="font-display italic text-[24px] md:text-[28px] text-warm-brown tracking-[0.05em]"
            style={{ opacity: 0, transform: 'translateY(30px)' }}
          >
            До нашей свадьбы
          </h2>
          <div className="divider-line" />

          {isWeddingDay ? (
            <p className="font-script text-[32px] md:text-[44px] text-antique-gold">
              Сегодня самый важный день! 💛
            </p>
          ) : (
            <div
              ref={countdownRef}
              className="flex flex-wrap justify-center gap-2 md:gap-6"
            >
              {countdownData.map((c, i) => (
                <div
                  key={i}
                  className="countdown-box flex flex-col items-center justify-center min-w-[62px] md:min-w-[110px] py-3 px-2 md:py-5 md:px-4 rounded-md"
                  style={{
                    background: 'rgba(247,240,232,0.5)',
                    border: '1px solid rgba(201,168,124,0.2)',
                    opacity: 0,
                    transform: 'translateY(20px)',
                  }}
                >
                  <span className="font-display text-[22px] md:text-[48px] text-antique-gold">
                    {c.value}
                  </span>
                  <span className="font-body text-xs md:text-sm uppercase tracking-[0.1em] text-muted-sepia mt-1">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div>
          <h2 className="font-display italic text-[28px] md:text-[36px] text-warm-brown tracking-[0.05em] mb-2">
            План дня
          </h2>
          <div className="divider-line mb-10" />

          <div ref={timelineRef} className="flex flex-col gap-5 md:gap-6 items-center max-w-[520px] mx-auto">
            {timelineItems.map((item, i) => (
              <div
                key={i}
                className="timeline-item w-full text-center rounded-md p-5 md:p-6"
                style={{
                  background: 'rgba(247,240,232,0.4)',
                  border: '1px solid rgba(201,168,124,0.15)',
                  opacity: 0,
                  transform: 'translateY(30px)',
                }}
              >
                <p className="font-display text-[20px] md:text-[24px] text-antique-gold mb-1">
                  {item.time}
                </p>
                <p className="font-body text-[18px] md:text-[20px] text-warm-brown mb-1">
                  {item.title}
                </p>
                <p className="font-body text-base text-muted-sepia">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
