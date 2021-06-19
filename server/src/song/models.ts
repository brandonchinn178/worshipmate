export type Song = {
  id: number
  slug: string
  title: string
  artist: string
  recommendedKey: string
  timeSignature: TimeSignature
  bpm: number
}

export type TimeSignature = [number, number]

export type SearchFilters = {
  recommendedKey?: string
  bpm?: number
  timeSignature?: TimeSignature
}

export type Artist = {
  id: number
  slug: string
  name: string
}
