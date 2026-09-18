import * as fc from "fast-check"
import { describe, expect, it } from "vitest"

import { KEYS, renderKey, transposeKey } from "./key"

describe("renderKey", () => {
  it.each`
    key     | base    | expected
    ${"Db"} | ${"E"}  | ${"C#"}
    ${"Db"} | ${"Bb"} | ${"Db"}
    ${"Db"} | ${"C"}  | ${"Db"}
    ${"C"}  | ${"E"}  | ${"C"}
    ${"C"}  | ${"Bb"} | ${"C"}
    ${"C"}  | ${"C"}  | ${"C"}
  `("renderKey($key, { base: $base }) == $expected", ({ key, base, expected }) => {
    expect(renderKey(key, { base })).toBe(expected)
  })
})

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
    ${"C"}  | ${1}  | ${"Db"}
    ${"Db"} | ${1}  | ${"D"}
    ${"C"}  | ${2}  | ${"D"}
  `("transposeKey($input, $count) == $expected", ({ input, count, expected }) => {
    expect(transposeKey(input, count)).toBe(expected)
  })

  it("wraps around", () => {
    expect(transposeKey("B", 11)).toBe("Bb")
    expect(transposeKey("F", 11)).toBe("E")
    expect(transposeKey("C", -2)).toBe("Bb")
  })
})
