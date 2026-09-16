/**
 * TRA Logo - Hexagonal red diamond representing TRA brand
 * Uses semantic CSS variables for the destructive (red) palette
 */
export default function TRALogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer hexagonal shape */}
      <path
        d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
        fill="hsl(var(--destructive))"
        stroke="hsl(var(--destructive) / 0.7)"
        strokeWidth="0.5"
      />
      {/* Inner diamond */}
      <path
        d="M32 12L48 22V42L32 52L16 42V22L32 12Z"
        fill="hsl(var(--destructive) / 0.85)"
        opacity="0.8"
      />
      {/* Facets */}
      <path d="M32 12L48 22L32 32L16 22L32 12Z" fill="hsl(var(--destructive) / 0.6)" opacity="0.9" />
      <path d="M32 32L48 22V42L32 52V32Z" fill="hsl(var(--destructive))" opacity="0.5" />
      <path d="M32 32L16 22V42L32 52V32Z" fill="hsl(var(--destructive))" opacity="0.65" />
      {/* Top highlight */}
      <path d="M32 4L44 11L32 18L20 11L32 4Z" fill="hsl(var(--destructive) / 0.5)" opacity="0.6" />
    </svg>
  );
}
