/** En prod (Vercel) : /api ; en dev : http://localhost:3000. Overridable via VITE_API_URL. */
const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000')

export interface ImageWithAuthor {
  id: string
  url: string
  author: { id: string; name: string; twitter: string; instagram: string; shop: string } | null
}

export async function fetchImagesWithAuthors(
  limit = 20,
  excludeIds: string[] = [],
): Promise<{ images: ImageWithAuthor[]; nextOffset: number | null }> {
  const params = new URLSearchParams({ limit: String(limit) })
  if (excludeIds.length > 0) {
    params.set('exclude', excludeIds.join(','))
  }
  const res = await fetch(`${API_BASE}/images-with-authors?${params}`)
  const data = await res.json()
  return { images: data.images ?? [], nextOffset: data.nextOffset ?? null }
}

export async function fetchAllArtists() {
  const res = await fetch(`${API_BASE}/allArtists`)
  const data = await res.json()

  return data
}

export async function fetchArtist(artist: string): Promise<{
  artist: { id: string; name: string; twitter: string; instagram: string; shop: string }[]
  images: string[]
}> {
  const res = await fetch(`${API_BASE}/artist?artist=${encodeURIComponent(artist)}`)
  const data = await res.json()
  if (Array.isArray(data)) return { artist: [], images: [] }
  return data
}
