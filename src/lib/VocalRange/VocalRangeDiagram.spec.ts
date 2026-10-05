import { describe, expect, it } from "vitest"

import { toKey } from "$lib/songsheet/key"

import { parseVocalRange } from "./model"
import { toDiagram } from "./VocalRangeDiagram"

describe("toDiagram", () => {
  it("handles multiple roots in between", () => {
    const diagram = toDiagram(parseVocalRange(["G3", "D5"]), { key: toKey("C") })
    expect(diagram).toEqual({
      start: { note: "G", offset: 0 },
      roots: [
        { note: "C", offset: 5 },
        { note: "C", offset: 17 },
      ],
      end: { note: "D", offset: 19 },
    })
  })

  it("handles root as low", () => {
    const diagram = toDiagram(parseVocalRange(["C4", "D5"]), { key: toKey("C") })
    expect(diagram).toEqual({
      start: { note: "C", offset: 0 },
      roots: [{ note: "C", offset: 12 }],
      end: { note: "D", offset: 14 },
    })
  })

  it("handles root as high", () => {
    const diagram = toDiagram(parseVocalRange(["G3", "C5"]), { key: toKey("C") })
    expect(diagram).toEqual({
      start: { note: "G", offset: 0 },
      roots: [{ note: "C", offset: 5 }],
      end: { note: "C", offset: 17 },
    })
  })

  it("handles root as low and high", () => {
    const diagram = toDiagram(parseVocalRange(["C4", "C5"]), { key: toKey("C") })
    expect(diagram).toEqual({
      start: { note: "C", offset: 0 },
      roots: [],
      end: { note: "C", offset: 12 },
    })
  })

  it("handles no root", () => {
    const diagram = toDiagram(parseVocalRange(["D4", "G4"]), { key: toKey("C") })
    expect(diagram).toEqual({
      start: { note: "D", offset: 0 },
      roots: [],
      end: { note: "G", offset: 5 },
    })
  })
})
