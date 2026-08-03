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

type ExcludeSharps<T extends string> = T extends `${string}#` ? never : T
export const BASE_KEYS = KEYS.filter((s): s is ExcludeSharps<Key> => !s.includes("#"))

export const ENHARMONICS = {
  "C#": "Db",
  "D#": "Eb",
  "E#": "F",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
  "B#": "C",
  Cb: "B",
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
} as const

export const transposeKey = (key: Key, n: number): Key => {
  const oldKey = KEYS.indexOf(key)

  let newKey = (oldKey + n) % KEYS.length
  if (newKey < 0) {
    newKey += KEYS.length
  }

  return KEYS[newKey]
}
