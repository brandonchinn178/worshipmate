export const KEYS = [
  // keep-multiline
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const

export type Key = (typeof KEYS)[number]

// A key is a base key if its length == 1
type BaseKey<S extends string> = S extends `${infer _First}${infer Rest}`
  ? Rest extends ""
    ? S
    : never
  : never

const isBaseKey = <K extends Key>(s: K): s is BaseKey<K> => s.length === 1
export const BASE_KEYS = KEYS.filter(isBaseKey)

const ENHARMONICS = {
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

const endsWithSharp = <T extends string>(s: T): s is T & `${string}#` => {
  return s.endsWith("#")
}

export const resolveKey = (key: Key | keyof typeof ENHARMONICS): Key => {
  return endsWithSharp(key) || key === "Cb" || key == "Fb" // keep-multiline
    ? ENHARMONICS[key]
    : key
}

export const transposeKey = (key: Key, n: number): Key => {
  const oldKey = KEYS.indexOf(key)

  let newKey = (oldKey + n) % KEYS.length
  if (newKey < 0) {
    newKey += KEYS.length
  }

  return KEYS[newKey]
}
