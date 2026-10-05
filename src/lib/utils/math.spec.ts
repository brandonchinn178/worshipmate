import { describe, expect, it } from "vitest"

import { divMod } from "./math"

describe("divMod", () => {
  it.each`
    n     | d     | expected
    ${7}  | ${2}  | ${[3, 1]}
    ${-7} | ${2}  | ${[-4, 1]}
    ${7}  | ${-2} | ${[-4, -1]}
    ${-7} | ${-2} | ${[3, -1]}
  `(
    "divMod($n, $d) => $expected",
    ({ n, d, expected }: { n: number; d: number; expected: [number, number] }) => {
      expect(divMod(n, d)).toEqual(expected)
    },
  )
})
