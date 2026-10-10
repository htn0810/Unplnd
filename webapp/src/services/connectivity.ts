const PROBE_TIMEOUT_MS = 4000

/**
 * Real reachability check: navigator.onLine can say "online" behind a dead wifi,
 * so we fetch a tiny resource without cache. Swap the URL for the API health endpoint later.
 */
export async function checkConnectivity(): Promise<boolean> {
  if (!navigator.onLine) return false
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}resources/mock-data/me.json?ping=${Date.now()}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
    return response.ok
  } catch {
    return false
  } finally {
    window.clearTimeout(timer)
  }
}
