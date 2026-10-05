import { type Key, type Note, toAbsNoteOffset } from "$lib/songsheet/key"
import { map2, range as range_ } from "$lib/utils/lang"

import type { VocalRange } from "./model"

/**
 * A vocal range is displayed as a diagram highlighting
 * the low and high points, with the root of the key
 * indicated as hints. We represent this as a diagram
 * containing something like
 *
 * {
 *   start: { note: "G", offset: 0  },
 *   roots: [
 *          { note: "C", offset: 5  },
 *          { note: "C", offset: 17 },
 *   ],
 *   end:   { note: "D", offset: 19 },
 * }
 */
export type Diagram = {
  start: DiagramPart
  roots: DiagramPart[]
  end: DiagramPart
}
export type DiagramPart = {
  note: Note
  offset: number
}

export const toDiagram = (range: VocalRange, { key }: { key: Key }): Diagram => {
  const [lo, hi] = range
  const [loOffset, hiOffset] = map2(range, toAbsNoteOffset)
  const roots = range_(lo.octave, hi.octave + 1)
    .map((octave) => toAbsNoteOffset({ base: key.base, octave: octave }))
    .filter((offset) => loOffset < offset && offset < hiOffset)
    .map((offset) => ({ note: key.base, offset: offset - loOffset }))
  return {
    start: { note: lo.base, offset: 0 },
    roots: [...roots],
    end: { note: hi.base, offset: hiOffset - loOffset },
  }
}
