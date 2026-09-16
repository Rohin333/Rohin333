import { cn } from '@lib/utils';

export default function CyberpunkHeader({ title, subtitle }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 mb-6">
      <div className="absolute left-[10%] top-1/2 -translate-y-1/2">
        <RedPolygon />
      </div>
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2">
        <RedPolygon mirrored />
      </div>

      <h1
        className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-[0.15em] text-center relative z-10"
        style={{ textShadow: 'var(--text-glow-title)' }}
      >
        {title}
      </h1>

      {subtitle && (
        <p className="text-xs sm:text-sm text-muted-foreground tracking-[0.12em] uppercase font-medium mt-2 text-center relative z-10">
          {subtitle}
        </p>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

function RedPolygon({ mirrored }) {
  return (
    <div className={cn("relative", mirrored && "scale-x-[-1]")}>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 5 L55 30 L30 55 L5 30 Z"
          fill="var(--polygon-fill-outer)"
          stroke="var(--polygon-stroke-outer)"
          strokeWidth="1"
        />
        <path
          d="M30 15 L45 30 L30 45 L15 30 Z"
          fill="var(--polygon-fill-inner)"
          stroke="var(--polygon-stroke-inner)"
          strokeWidth="1"
        />
        <circle cx="30" cy="30" r="4" fill="var(--polygon-fill-center)" />
      </svg>
      <div className="absolute inset-0 blur-md opacity-40">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="var(--polygon-fill-glow)" />
        </svg>
      </div>
    </div>
  );
}
