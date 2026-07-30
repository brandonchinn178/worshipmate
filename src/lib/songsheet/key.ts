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
  const oldKey = KEYS.indexOf(key)

  let newKey = (oldKey + n) % KEYS.length
  if (newKey < 0) {
    newKey += KEYS.length
  }

  return KEYS[newKey]
}
