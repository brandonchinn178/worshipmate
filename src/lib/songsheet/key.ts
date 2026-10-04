import { divMod } from "$lib/utils/math"

import {
  BASE_KEYS,
  KEY_ACCIDENTALS,
  NOTE_ALIASES,
  NOTES,
  SCALE_DEGREES,
  TO_FLATS,
  TO_SHARPS,
} from "./key.data.ts"

/***** Notes *****/

export type Note = (typeof NOTES)[number]
export { NOTES }

const isAlias = (s: string): s is keyof typeof NOTE_ALIASES => s in NOTE_ALIASES

export const resolveNote = (note: Note | keyof typeof NOTE_ALIASES): Note => {
  return isAlias(note) ? NOTE_ALIASES[note] : note
}

export type RenderNoteOptions = {
  key?: Key
}

export const renderNote = (note: Note, options: RenderNoteOptions = {}): string => {
  const { key } = options
  if (!key) return note
  switch (KEY_ACCIDENTALS[toMajor(key).base]) {
    case null:
      return note
    case "flats":
      return TO_FLATS[note]
    case "sharps":
      return TO_SHARPS[note]
  }
}

export const toScaleDegree = (note: Note): number => {
  return SCALE_DEGREES[note]
}

export const fromScaleDegree = (degree: number): Note => {
  return NOTES[degree % NOTES.length]
}

export const transposeNote = (note: Note, n: number): Note => {
  const result = transposeAbsNote({ base: note, octave: 0 }, n)
  return result.base
}

/***** AbsNote *****/

export type AbsNote = {
  base: Note
  octave: number
}

export const renderAbsNote = (note: AbsNote): string => {
  return note.base + note.octave.toString()
}

export const toAbsNoteOffset = (note: AbsNote): number => {
  return note.octave * NOTES.length + toScaleDegree(note.base)
}

export const transposeAbsNote = (note: AbsNote, n: number): AbsNote => {
  const oldDegree = toScaleDegree(note.base)

  const [octaveDiff, rem] = divMod(oldDegree + n, NOTES.length)
  const newDegree = fromScaleDegree(rem >= 0 ? rem : rem + NOTES.length)

  return {
    base: newDegree,
    octave: note.octave + octaveDiff,
  }
}

/***** ScaleMode *****/

export type ScaleMode = "major" | "minor"

export const renderScaleMode = (mode: ScaleMode): string => {
  switch (mode) {
    case "major":
      return ""
    case "minor":
      return "m"
  }
}

/***** Keys *****/

export type Key = {
  base: Note
  mode: ScaleMode
}

export { BASE_KEYS }

export const resolveKey = (arg: Note | Key): Key => {
  return typeof arg === "string" ? { base: arg, mode: "major" } : arg
}

export const renderKey = (key: Key): string => {
  return renderNote(key.base) + renderScaleMode(key.mode)
}

export const toMajor = (key: Key): Key => {
  const shift = (() => {
    switch (key.mode) {
      case "major":
        return 0
      case "minor":
        return 3
    }
  })()
  return { base: transposeNote(key.base, shift), mode: "major" }
}

export const toMinor = (key: Key): Key => {
  const shift = (() => {
    switch (key.mode) {
      case "major":
        return -3
      case "minor":
        return 0
    }
  })()
  return { base: transposeNote(key.base, shift), mode: "minor" }
}

export const transposeKey = (key: Key, n: number): Key => {
  return { ...key, base: transposeNote(key.base, n) }
}
