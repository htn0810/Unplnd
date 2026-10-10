/** 500000 → "500K", 1200000 → "1.2M" (VND, compact) */
export function formatVndCompact(amount: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(amount)
}
