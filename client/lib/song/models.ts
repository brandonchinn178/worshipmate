export type Song = {
  slug: string
  title: string
  artist: string

  themes: ReadonlyArray<string>

  recommendedKey: string
  timeSignature: [number, number]
  bpm: number
}
