import { describe, expect, it } from "vitest"

import { toChord } from "./chord"
import { parseSongSheet } from "./parser"

describe("parse", () => {
  it("parses a song sheet", () => {
    const input = `
      {section Verse 1}
      [C]This is verse 1
      {/section}
      {section Verse 2}
      [C]This is verse 2
      {/section}
    `
    expect(parseSongSheet(input)).toEqual({
      parts: [
        {
          type: "section",
          label: "Verse 1",
          meta: {},
          lines: [
            {
              pieces: [
                {
                  chord: toChord("C"),
                  lyrics: "This is verse 1",
                },
              ],
            },
          ],
        },
        {
          type: "section",
          label: "Verse 2",
          meta: {},
          lines: [
            {
              pieces: [
                {
                  chord: toChord("C"),
                  lyrics: "This is verse 2",
                },
              ],
            },
          ],
        },
      ],
    })
  })

  it("accepts empty input", () => {
    expect(parseSongSheet("")).toEqual({
      parts: [],
    })
  })

  it("fails on unexpected input", () => {
    expect(() => parseSongSheet("asdf")).toThrow()
  })
})

describe("p_SongSheetSection", () => {
  it("parses meta", () => {
    const input = `
      {section Foo #repeat=1}
      {/section}
    `
    expect(parseSongSheet(input)).toMatchObject({
      parts: [
        {
          type: "section",
          label: "Foo",
          meta: { repeat: 1 },
        },
      ],
    })
  })

  it("fails without label", () => {
    const input = `
      {section}
      {/section}
    `
    expect(() => parseSongSheet(input)).toThrow()
  })

  it("supports common labels", () => {
    const input = `
      {section Verse 1}
      {/section}
      {section Pre-Chorus}
      {/section}
      {section Chorus}
      {/section}
      {section Bridge}
      {/section}
    `
    expect(parseSongSheet(input)).toMatchObject({
      parts: [
        { type: "section", label: "Verse 1" },
        { type: "section", label: "Pre-Chorus" },
        { type: "section", label: "Chorus" },
        { type: "section", label: "Bridge" },
      ],
    })
  })

  it("fails with meta without label", () => {
    const input = `
      {section #repeat=1}
      {/section}
    `
    expect(() => parseSongSheet(input)).toThrow()
  })

  it("parses multiple lines", () => {
    const input = `
      {section Intro}
      [C]
      [F]
      {/section}
    `
    expect(parseSongSheet(input)).toMatchObject({
      parts: [
        {
          lines: [
            // keep-multiline
            { pieces: [{ chord: toChord("C") }] },
            { pieces: [{ chord: toChord("F") }] },
          ],
        },
      ],
    })
  })

  it("preserves empty lines", () => {
    const input = `
      {section Intro}
      Line 1

      Line 2
      {/section}
    `
    expect(parseSongSheet(input)).toMatchObject({
      parts: [
        {
          lines: [
            { pieces: [{ lyrics: "Line 1" }] },
            { pieces: [] },
            { pieces: [{ lyrics: "Line 2" }] },
          ],
        },
      ],
    })
  })
})

describe("p_SongSheetLinePiece", () => {
  it("parses lyrical space", () => {
    const input = `
      {section Verse}
      [G]_ This has a space in the beginning
      {/section}
    `
    expect(parseSongSheet(input)).toMatchObject({
      parts: [
        {
          lines: [
            {
              pieces: [
                { chord: toChord("G"), space: true },
                { lyrics: "This has a space in the beginning" },
              ],
            },
          ],
        },
      ],
    })
  })
})

describe("p_Key", () => {
  it("parses basic chords", () => {
    const input = `
      {section Intro}
      [C] [D] [E]
      {/section}
    `
    expect(parseSongSheet(input)).toMatchObject({
      parts: [
        {
          lines: [
            {
              pieces: [
                // keep-multiline
                { chord: toChord("C") },
                { chord: toChord("D") },
                { chord: toChord("E") },
              ],
            },
          ],
        },
      ],
    })
  })

  it("parses accidentals", () => {
    const input = `
      {section Intro}
      [F#] [Gb] [A#] [Bb]
      {/section}
    `
    expect(parseSongSheet(input)).toMatchObject({
      parts: [
        {
          lines: [
            {
              pieces: [
                { chord: toChord("Gb") },
                { chord: toChord("Gb") },
                { chord: toChord("Bb") },
                { chord: toChord("Bb") },
              ],
            },
          ],
        },
      ],
    })
  })

  it("parses enharmonics", () => {
    const input = `
      {section Intro}
      [E#] [B#] [Fb] [Cb]
      {/section}
    `
    expect(parseSongSheet(input)).toMatchObject({
      parts: [
        {
          lines: [
            {
              pieces: [
                { chord: toChord("F") },
                { chord: toChord("C") },
                { chord: toChord("E") },
                { chord: toChord("B") },
              ],
            },
          ],
        },
      ],
    })
  })
})
