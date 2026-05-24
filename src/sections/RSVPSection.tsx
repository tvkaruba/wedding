import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { config } from '../config';

export default function RSVPSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [attendance, setAttendance] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            gsap.to(subRef.current, {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2,
            });

            const fields = formRef.current?.querySelectorAll('.form-field');
            fields?.forEach((f, i) => {
              gsap.to(f, {
                opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 + i * 0.1,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const endpoint = config.rsvp.endpoint;

    // Если endpoint не настроен — показываем сообщение с инструкцией
    if (!endpoint) {
      setError('Форма пока не подключена к серверу. Пожалуйста, свяжитесь с нами напрямую.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData(formRef.current!);
    const data = {
      name: formData.get('name') as string,
      attendance: formData.get('attendance') as string,
      alcohol: formData.get('alcohol') as string,
      message: formData.get('message') as string,
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        mode: 'no-cors', // для Google Apps Script и многих других сервисов
      });

      // no-cors не даёт прочитать response, поэтому считаем успешным
      setSubmitted(true);
    } catch (err) {
      setError('Не удалось отправить. Проверьте подключение и попробуйте снова.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative section-padding"
      style={{ zIndex: 2 }}
    >
      <div className="content-max-width-form text-center">
        <h2
          ref={headingRef}
          className="font-display italic text-[32px] md:text-[48px] text-warm-brown tracking-[0.05em]"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          Подтвердите участие
        </h2>
        <p
          ref={subRef}
          className="font-body text-base md:text-lg text-muted-sepia mt-3"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          Пожалуйста, заполните форму до {config.rsvp.deadline}
        </p>

        {!submitted ? (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-6 text-left"
          >
            {!config.rsvp.endpoint && (
              <div className="form-field p-4 rounded bg-antique-gold/10 border border-antique-gold/20 text-center">
                <p className="font-body text-sm text-muted-sepia">
                  Форма RSVP пока не подключена. Чтобы настроить сбор ответов,
                  укажите endpoint в файле <code className="text-warm-brown bg-warm-ivory/80 px-1 rounded">src/config.ts</code>.
                </p>
              </div>
            )}

            {/* Name */}
            <div
              className="form-field flex flex-col gap-2"
              style={{ opacity: 0, transform: 'translateY(15px)' }}
            >
              <label className="font-body text-sm uppercase tracking-[0.1em] text-muted-sepia">
                Ваше имя и фамилия
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Иван и Анна Петровы"
                className="w-full bg-warm-ivory/60 border border-antique-gold/30 rounded px-5 py-4 font-body text-lg text-warm-brown placeholder:text-muted-sepia/50 focus:outline-none focus:border-antique-gold focus:ring-3 focus:ring-antique-gold/15 transition-all"
              />
            </div>

            {/* Attendance */}
            <div
              className="form-field flex flex-col gap-3"
              style={{ opacity: 0, transform: 'translateY(15px)' }}
            >
              <label className="font-body text-sm uppercase tracking-[0.1em] text-muted-sepia">
                Присутствие
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={attendance === 'yes'}
                      onChange={(e) => setAttendance(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-antique-gold peer-checked:border-antique-gold transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                      <div className="w-2.5 h-2.5 rounded-full bg-antique-gold" />
                    </div>
                  </div>
                  <span className="font-body text-lg text-warm-brown">С радостью приду</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={attendance === 'no'}
                      onChange={(e) => setAttendance(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-antique-gold peer-checked:border-antique-gold transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                      <div className="w-2.5 h-2.5 rounded-full bg-antique-gold" />
                    </div>
                  </div>
                  <span className="font-body text-lg text-warm-brown">К сожалению, не смогу</span>
                </label>
              </div>
            </div>

            {/* Alcohol */}
            <div
              className="form-field flex flex-col gap-2"
              style={{ opacity: 0, transform: 'translateY(15px)' }}
            >
              <label className="font-body text-sm uppercase tracking-[0.1em] text-muted-sepia">
                Какой алкоголь вы предпочитаете
              </label>
              <input
                name="alcohol"
                type="text"
                placeholder="Вино / Водка / Не пью"
                className="w-full bg-warm-ivory/60 border border-antique-gold/30 rounded px-5 py-4 font-body text-lg text-warm-brown placeholder:text-muted-sepia/50 focus:outline-none focus:border-antique-gold focus:ring-3 focus:ring-antique-gold/15 transition-all"
              />
            </div>

            {/* Message */}
            <div
              className="form-field flex flex-col gap-2"
              style={{ opacity: 0, transform: 'translateY(15px)' }}
            >
              <label className="font-body text-sm uppercase tracking-[0.1em] text-muted-sepia">
                Тёплое слово для Паши и Оли
              </label>
              <textarea
                name="message"
                rows={5}
                placeholder="Напишите что-нибудь доброе..."
                className="w-full bg-warm-ivory/60 border border-antique-gold/30 rounded px-5 py-4 font-body text-lg text-warm-brown placeholder:text-muted-sepia/50 focus:outline-none focus:border-antique-gold focus:ring-3 focus:ring-antique-gold/15 transition-all resize-y"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="form-field p-3 rounded bg-red-500/10 border border-red-500/20 text-center">
                <p className="font-body text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div
              className="form-field mt-2"
              style={{ opacity: 0, transform: 'translateY(15px)' }}
            >
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto md:min-w-[240px] mx-auto block bg-antique-gold text-warm-ivory font-display text-xl tracking-[0.08em] py-4 px-16 rounded border-none transition-all hover:bg-[#B8976B] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </form>
        ) : (
          <div
            className="mt-12"
            style={{
              animation: 'fadeInScale 0.6s ease-out forwards',
            }}
          >
            <p className="font-display italic text-[24px] md:text-[30px] text-warm-brown">
              Спасибо! Мы получили ваш ответ и будем ждать встречи 💛
            </p>
            <style>{`
              @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        )}
      </div>
    </section>
  );
}
