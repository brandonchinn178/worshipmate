import type { Key } from "./key"

export type Chord = {
  root: Key
  ext?: string
  bass?: Key
}

export const renderChord = (chord: Chord): string =>
  [chord.root, chord.ext ?? "", chord.bass ? `/${chord.bass}` : ""].join("")
