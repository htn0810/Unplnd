/** 5000 → "5 km", 800 → "800 m" */
export function formatDistance(meters: number) {
  return meters >= 1000 ? `${Number((meters / 1000).toFixed(1))} km` : `${meters} m`
}
