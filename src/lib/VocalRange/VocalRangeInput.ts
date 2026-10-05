import { parseAbsNote } from "$lib/songsheet/parser"

import { isValidVocalRange, type VocalRange } from "./model"

export type VocalRangeRawInput = string

export const toVocalRangeRawInput = ([lo, hi]: [string, string]): VocalRangeRawInput => {
  return [lo, hi].map((s) => s.replaceAll(",", "")).join(",")
}

export const fromVocalRangeRawInput = (input: VocalRangeRawInput): [string, string] => {
  const i = input.indexOf(",")
  return i === -1 ? [input, ""] : [input.slice(0, i), input.slice(i + 1)]
}

export const parseVocalRangeInput = (input: VocalRangeRawInput): VocalRange => {
  const [lo, hi] = fromVocalRangeRawInput(input)
  if (lo === "" || hi === "") {
    throw new Error("Field is required")
  }
  const loNote = parseAbsNote(lo)
  const hiNote = parseAbsNote(hi)
  if (!isValidVocalRange(loNote, hiNote)) {
    throw new Error("Invalid vocal range")
  }

  return [loNote, hiNote]
}
