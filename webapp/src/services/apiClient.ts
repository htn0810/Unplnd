const MOCK_BASE_URL = `${import.meta.env.BASE_URL}resources/mock-data`

/** Resolves a public asset path from mock data (e.g. "resources/images/x.svg") against the app base URL */
export function publicAssetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/** Temporary data source: reads mock JSON from public/resources/mock-data. Swap for real API calls later. */
export async function getMock<T>(file: string): Promise<T> {
  const response = await fetch(`${MOCK_BASE_URL}/${file}`)
  if (!response.ok) {
    throw new Error(`Failed to load ${file} (${response.status})`)
  }
  return (await response.json()) as T
}
