import { useEffect, useRef } from 'react';

const COUNT = 45;
const MAX_DIST = 150;

function parseHSL(raw) {
  const [h, s, l] = raw.trim().split(' ');
  return { h, s, l };
}

export default function ParticleCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const cs = getComputedStyle(document.documentElement);
    const pri = parseHSL(cs.getPropertyValue('--primary'));
    const acc = parseHSL(cs.getPropertyValue('--accent'));
    const dotFill = `hsl(${pri.h}, ${pri.s}, ${pri.l})`;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotFill;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const a = (1 - dist / MAX_DIST) * 0.15;
            const g = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
            g.addColorStop(0, `hsla(${pri.h}, ${pri.s}, ${pri.l}, ${a})`);
            g.addColorStop(1, `hsla(${acc.h}, ${acc.s}, ${acc.l}, ${a})`);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = g;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="canvas-gradient fixed inset-0 -z-10 h-full w-full"
    />
  );
}
