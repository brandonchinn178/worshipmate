export const KEYS = [
  // keep-multiline
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const

export type Key = (typeof KEYS)[number]

export const transposeKey = (key: Key, n: number): Key => {
  const i = KEYS.indexOf(key)
  return KEYS[(i + n) % KEYS.length]
}
