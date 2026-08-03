import * as fc from "fast-check"
import { describe, expect, it } from "vitest"

import { KEYS, transposeKey } from "./key"

describe("transposeKey", () => {
  it("returns same key for any multiple of 12", () => {
    fc.assert(
      fc.property(fc.constantFrom(...KEYS), fc.integer(), (key, k) => {
        expect(transposeKey(key, 12 * k)).toBe(key)
      }),
    )
  })

  it.each`
    input   | count | expected
    ${"C"}  | ${1}  | ${"C#"}
    ${"C#"} | ${1}  | ${"D"}
    ${"C"}  | ${2}  | ${"D"}
  `("transposeKey($input, $count) == $expected", ({ input, count, expected }) => {
    expect(transposeKey(input, count)).toBe(expected)
  })

  it("wraps around", () => {
    expect(transposeKey("B", 11)).toBe("A#")
    expect(transposeKey("F", 11)).toBe("E")
  })
})
