import * as fc from "fast-check"
import { describe, expect, it } from "vitest"

import { type Note, NOTES, renderKey, renderNote, transposeNote } from "./key"
import { parseKey } from "./parser"

describe("renderNote", () => {
  it.each`
    note    | key     | expected
    ${"Db"} | ${"E"}  | ${"C#"}
    ${"Db"} | ${"Bb"} | ${"Db"}
    ${"Db"} | ${"C"}  | ${"Db"}
    ${"C"}  | ${"E"}  | ${"C"}
    ${"C"}  | ${"Bb"} | ${"C"}
    ${"C"}  | ${"C"}  | ${"C"}
  `(
    "renderNote($key, { key: $key }) == $expected",
    ({ note, key, expected }: { note: Note; key: string; expected: string }) => {
      expect(renderNote(note, { key: parseKey(key) })).toBe(expected)
    },
  )
})

describe("transposeNote", () => {
  it("returns same key for any multiple of 12", () => {
    fc.assert(
      fc.property(fc.constantFrom(...NOTES), fc.integer(), (note, k) => {
        expect(transposeNote(note, 12 * k)).toBe(note)
      }),
    )
  })

  it.each`
    input   | count | expected
    ${"C"}  | ${1}  | ${"Db"}
    ${"Db"} | ${1}  | ${"D"}
    ${"C"}  | ${2}  | ${"D"}
  `(
    "transposeNote($input, $count) == $expected",
    ({ input, count, expected }: { input: Note; count: number; expected: string }) => {
      expect(transposeNote(input, count)).toBe(expected)
    },
  )

  it("wraps around", () => {
    expect(transposeNote("B", 11)).toBe("Bb")
    expect(transposeNote("F", 11)).toBe("E")
    expect(transposeNote("C", -2)).toBe("Bb")
  })
})

describe("renderKey", () => {
  it("renders major key", () => {
    expect(renderKey({ base: "C", mode: "major" })).toBe("C")
  })

  it("renders minor key", () => {
    expect(renderKey({ base: "C", mode: "minor" })).toBe("Cm")
  })
})
