import { useMemo } from 'react';

/**
 * Animated background with floating particles and hexagonal grid
 * Matches TRA brand: green particles + red particles + hex grid + glowing orbs
 */
export default function AnimatedBackground() {
  const particles = useMemo(() => {
    const items = [];
    for (let i = 0; i < 18; i++) {
      items.push({
        id: i,
        left: `${(i * 5.8) % 100}%`,
        size: 2 + (i % 4),
        duration: 12 + (i % 8) * 3,
        delay: (i * 1.7) % 15,
        type: i % 5 === 0 ? 'red' : 'green',
      });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Hexagonal grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] hex-grid-animated">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex-bg" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.8)">
              <path
                d="M28 66L0 50L0 18L28 2L56 18L56 50L28 66Z M28 -34L0 -50L0 -82L28 -98L56 -82L56 -50L28 -34Z"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-bg)" />
        </svg>
      </div>

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className={`particle ${p.type === 'red' ? 'particle-red' : 'particle-green'}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Ambient glow orbs */}
      <div className="glow-orb bg-primary/4" style={{ top: '10%', left: '20%', width: 300, height: 300 }} />
      <div className="glow-orb bg-destructive/3" style={{ top: '60%', right: '10%', width: 250, height: 250, animationDelay: '4s' }} />
      <div className="glow-orb bg-primary/3" style={{ bottom: '5%', left: '50%', width: 200, height: 200, animationDelay: '2s' }} />
    </div>
  );
}
