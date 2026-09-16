/**
 * Subtle hexagonal grid background pattern matching TRA brand
 */
export default function HexGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex-pattern" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
            <path
              d="M28 66L0 50L0 18L28 2L56 18L56 50L28 66Z M28 -34L0 -50L0 -82L28 -98L56 -82L56 -50L28 -34Z"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-pattern)" />
      </svg>
      {/* Corner glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-destructive/3 blur-[100px]" />
    </div>
  );
}
