export type SongSheet = {
  parts: readonly SongSheetPart[]
}

export type SongSheetPart = SongSheetSection | SongSheetGoto

export type SongSheetPartMeta = {
  repeat?: number
}

export type SongSheetSection = {
  type: "section"
  label: string
  meta: SongSheetPartMeta
  lines: readonly SongSheetLine[]
}

export type SongSheetGoto = {
  type: "goto"
  label: string
  meta: SongSheetPartMeta
}

/* ----- Section ----- */

export type SongSheetLine = {
  pieces: readonly SongSheetLinePiece[]
}

export type SongSheetLinePiece =
  | { chord: Chord; space: true } // keep-multiline
  | { chord: Chord; lyrics?: string }
  | { lyrics: string }

/* ----- Chord ----- */

export type Chord = {
  root: Key
  ext?: string
  bass?: Key
}

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
