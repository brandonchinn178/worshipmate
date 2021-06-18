export type Song = {
  slug: string
  title: string
  artist: string

  themes: ReadonlyArray<string>

  recommendedKey: string
  timeSignature: TimeSignature
  bpm: number
}

export type TimeSignature = [number, number]
