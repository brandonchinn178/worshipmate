import { type AbsNote, renderAbsNote, toAbsNoteOffset, transposeAbsNote } from "$lib/songsheet/key"
import { parseAbsNote } from "$lib/songsheet/parser"
import { map2 } from "$lib/utils/lang"

export type VocalRange = [AbsNote, AbsNote]

export const parseVocalRange = ([lo, hi]: [string, string]): VocalRange => {
  return [parseAbsNote(lo), parseAbsNote(hi)]
}

export const isValidVocalRange = (lo: AbsNote, hi: AbsNote): boolean => {
  return toAbsNoteOffset(lo) <= toAbsNoteOffset(hi)
}

export const renderVocalRange = (range: VocalRange): [string, string] => {
  return map2(range, renderAbsNote)
}

export const transposeVocalRange = (range: VocalRange, n: number): VocalRange => {
  return map2(range, (note) => transposeAbsNote(note, n))
}
