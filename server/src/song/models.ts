export type Song = {
  id: number
  slug: string
  title: string
  recommendedKey: string
  timeSignature: TimeSignature
  bpm: number
}

export type TimeSignature = {
  top: number
  bottom: number
}
