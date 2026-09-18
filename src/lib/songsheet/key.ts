import {
  ACCIDENTALS,
  BASE_KEYS,
  KEY_ALIASES,
  KEY_DEGREES,
  KEYS,
  TO_FLATS,
  TO_SHARPS,
} from "./key.data.ts"

export type Key = (typeof KEYS)[number]

export { BASE_KEYS, KEYS }

const isAlias = (s: string): s is keyof typeof KEY_ALIASES => s in KEY_ALIASES

export const resolveKey = (key: Key | keyof typeof KEY_ALIASES): Key => {
  return isAlias(key) ? KEY_ALIASES[key] : key
}

export const renderKey = (key: Key, { base }: { base?: Key }): string => {
  switch (base ? ACCIDENTALS[base] : null) {
    case null:
      return key
    case "flats":
      return TO_FLATS[key]
    case "sharps":
      return TO_SHARPS[key]
  }
}

export const transposeKey = (key: Key, n: number): Key => {
  const oldKey = KEY_DEGREES[key]

  let newKey = (oldKey + n) % KEYS.length
  if (newKey < 0) {
    newKey += KEYS.length
  }

  return KEYS[newKey]
}
