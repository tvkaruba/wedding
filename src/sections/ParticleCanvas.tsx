import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseSize: number;
  size: number;
  vx: number;
  vy: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  opacity: number;
  baseOpacity: number;
  warmth: number;
  glowSize: number;
  warmGlowSize: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const heroVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    // Hero visibility observer
    const hero = document.getElementById('hero-section');
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (hero) observer.observe(hero);

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 50 : 100;
    const MOUSE_PROXIMITY = 200;

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function initParticles() {
      const particles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const baseSize = random(1, 3.5);
        const opacity = random(0.3, 0.8);
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseSize,
          size: baseSize,
          vx: random(-0.3, 0.3),
          vy: random(-0.4, -0.8),
          swayFreq: random(0.005, 0.015),
          swayAmp: random(0.5, 1.5),
          swayPhase: random(0, Math.PI * 2),
          opacity,
          baseOpacity: opacity,
          warmth: random(0, 1),
          glowSize: baseSize * random(3, 5),
          warmGlowSize: baseSize * random(5, 8),
        });
      }
      particlesRef.current = particles;
    }

    initParticles();

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    function drawWarmParticle(p: Particle, _time: number, globalPulse: number) {
      const effectiveOpacity = p.opacity * globalPulse;

      // Warm ambient glow (largest, faintest)
      const ambientGrad = ctx!.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.warmGlowSize
      );
      ambientGrad.addColorStop(0, `rgba(255, 228, 196, ${effectiveOpacity * 0.12})`);
      ambientGrad.addColorStop(1, 'transparent');
      ctx!.fillStyle = ambientGrad;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.warmGlowSize, 0, Math.PI * 2);
      ctx!.fill();

      // Outer glow
      const outerGrad = ctx!.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.glowSize
      );
      outerGrad.addColorStop(0, `rgba(212, 165, 116, ${effectiveOpacity * 0.22})`);
      outerGrad.addColorStop(1, 'transparent');
      ctx!.fillStyle = outerGrad;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
      ctx!.fill();

      // Mid glow
      const midGrad = ctx!.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size * 1.8
      );
      midGrad.addColorStop(0, `rgba(245, 222, 179, ${effectiveOpacity * 0.55})`);
      midGrad.addColorStop(1, 'transparent');
      ctx!.fillStyle = midGrad;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
      ctx!.fill();

      // Bright center
      const centerGrad = ctx!.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size
      );
      centerGrad.addColorStop(0, `rgba(255, 248, 220, ${effectiveOpacity * 1.0})`);
      centerGrad.addColorStop(1, 'transparent');
      ctx!.fillStyle = centerGrad;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fill();
    }

    function animate() {
      rafRef.current = requestAnimationFrame(animate);

      if (!heroVisibleRef.current) return;

      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = 'lighter';

      timeRef.current += 0.016;
      const time = timeRef.current;
      const globalPulse = Math.sin(time * 0.3) * 0.15 + 0.85;
      const mouse = mouseRef.current;

      for (const p of particlesRef.current) {
        // Sinusoidal horizontal sway
        p.x += Math.sin(time * p.swayFreq + p.swayPhase) * p.swayAmp * 0.01;
        // Upward drift
        p.y += p.vy;
        // Natural horizontal drift
        p.x += p.vx + Math.sin(time * 0.001 + p.swayPhase) * 0.1;

        // Mouse proximity warmth boost
        if (!isMobile) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_PROXIMITY) {
            const factor = 1 - dist / MOUSE_PROXIMITY;
            p.size = p.baseSize * (1 + factor * 0.5);
            p.opacity = Math.min(0.85, p.baseOpacity * (1 + factor * 0.3));
          } else {
            p.size = p.baseSize;
            p.opacity = p.baseOpacity;
          }
        }

        // Boundaries
        if (p.y < -p.size * 5) {
          p.y = height + p.size * 5;
          p.x = Math.random() * width;
        }
        if (p.x < -p.size * 5) {
          p.x = width + p.size * 5;
        }
        if (p.x > width + p.size * 5) {
          p.x = -p.size * 5;
        }

        drawWarmParticle(p, time, globalPulse);
      }

      ctx!.globalCompositeOperation = 'source-over';
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (hero) observer.unobserve(hero);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
