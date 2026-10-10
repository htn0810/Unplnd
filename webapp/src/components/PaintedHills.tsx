import { cn } from '@/utils/cn'

/**
 * Decorative layered hills (multi-plane) with watercolor edges, tinted by theme tokens.
 * The front hill uses `--hills-front` so whatever sits below can continue in the same color.
 */
export function PaintedHills({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 140" preserveAspectRatio="none" className={cn('block h-24 w-full md:h-32', className)}>
      <defs>
        <filter id="hills-wc" x="-2%" y="-20%" width="104%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="8" />
        </filter>
      </defs>
      <g filter="url(#hills-wc)">
        <path d="M0 70 C 180 30 320 60 480 40 C 660 18 780 70 960 48 C 1140 26 1280 60 1440 38 L1440 140 L0 140 Z" fill="var(--brand-mint)" opacity=".18" />
        <path d="M0 96 C 200 60 360 92 560 72 C 760 52 900 96 1100 76 C 1260 60 1360 80 1440 70 L1440 140 L0 140 Z" fill="var(--brand-purple)" opacity=".28" />
        <path d="M0 120 C 240 96 420 124 680 106 C 900 92 1100 124 1440 104 L1440 160 L0 160 Z" fill="var(--hills-front)" />
      </g>
    </svg>
  )
}
