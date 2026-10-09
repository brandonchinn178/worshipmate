import { describe, expect, it } from "vitest"

import { renderChord } from "./chord"
import { toKey } from "./key"
import { parseChord } from "./parser"

describe("renderChord", () => {
  it("renders chords in the right key", () => {
    expect(renderChord(parseChord("Dbm"), { key: toKey("A") })).toBe("C#m")
    expect(renderChord(parseChord("C#m"), { key: toKey("Ab") })).toBe("Dbm")
  })

  it("renders bass notes in the right key", () => {
    expect(renderChord(parseChord("Dbm/Ab"), { key: toKey("A") })).toBe("C#m/G#")
    expect(renderChord(parseChord("C#m/G#"), { key: toKey("Ab") })).toBe("Dbm/Ab")
  })
})
