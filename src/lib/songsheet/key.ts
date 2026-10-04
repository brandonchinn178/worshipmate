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

export const transposeNote = (note: Note, n: number): Note => {
  const oldNote = SCALE_DEGREES[note]

  let newNote = (oldNote + n) % NOTES.length
  if (newNote < 0) {
    newNote += NOTES.length
  }

  return NOTES[newNote]
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
