import { type Chord, transposeChord } from "./chord"

export type { Chord } from "./chord"
export type { Key } from "./key"

export type SongSheet = {
  parts: readonly SongSheetPart[]
}

export const transposeSongSheet = (sheet: SongSheet, n: number): SongSheet => {
  return {
    parts: sheet.parts.map((part) => {
      switch (part.type) {
        case "section":
          return {
            ...part,
            lines: part.lines.map((line) => {
              return {
                pieces: line.pieces.map((piece) => {
                  return {
                    ...piece,
                    ...("chord" in piece && { chord: transposeChord(piece.chord, n) }),
                  }
                }),
              }
            }),
          }
        case "goto":
          return part
      }
    }),
  }
}

/* ----- Parts ----- */

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
