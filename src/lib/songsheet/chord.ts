import {
  type Note,
  renderNote,
  type RenderNoteOptions,
  renderScaleMode,
  type ScaleMode,
  transposeNote,
} from "./key"

export type Chord = {
  root: Note
  mode: ScaleMode
  ext?: string
  bass?: Note
}

export const toChord = (key: Note): Chord => {
  return { root: key, mode: "major" }
}

export const renderChord = (chord: Chord, options: RenderNoteOptions = {}): string => {
  return [
    renderNote(chord.root, options),
    renderScaleMode(chord.mode),
    chord.ext ?? "",
    chord.bass ? `/${renderNote(chord.bass)}` : "",
  ].join("")
}

export const transposeChord = (chord: Chord, n: number): Chord => {
  return {
    ...chord,
    root: transposeNote(chord.root, n),
    ...(chord.bass !== undefined && { bass: transposeNote(chord.bass, n) }),
  }
}
