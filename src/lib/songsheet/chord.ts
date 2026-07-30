import { type Key, transposeKey } from "./key"

export type Chord = {
  root: Key
  ext?: string
  bass?: Key
}

export const renderChord = (chord: Chord): string =>
  [chord.root, chord.ext ?? "", chord.bass ? `/${chord.bass}` : ""].join("")

export const transposeChord = (chord: Chord, n: number): Chord => {
  return {
    ...chord,
    root: transposeKey(chord.root, n),
    ...(chord.bass !== undefined && { bass: transposeKey(chord.bass, n) }),
  }
}
