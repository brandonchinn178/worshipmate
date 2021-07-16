export type ArtistRecord = {
  id: number
  slug: string
  name: string
}

export type SongRecord = {
  id: number
  slug: string
  title: string
  artist: number
  recommended_key: string
  time_signature_top: number
  time_signature_bottom: number
  bpm: number
}
