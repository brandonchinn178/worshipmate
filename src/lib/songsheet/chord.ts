import { type Key, renderKey as renderKey_, transposeKey } from "./key"

export type Chord = {
  root: Key
  ext?: string
  bass?: Key
}

export const renderChord = (chord: Chord, options: { base?: Key } = {}): string => {
  const renderKey = (k: Key) => renderKey_(k, options)
  return [
    renderKey(chord.root),
    chord.ext ?? "",
    chord.bass ? `/${renderKey(chord.bass)}` : "",
  ].join("")
}

export const transposeChord = (chord: Chord, n: number): Chord => {
  return {
    ...chord,
    root: transposeKey(chord.root, n),
    ...(chord.bass !== undefined && { bass: transposeKey(chord.bass, n) }),
  }
}
