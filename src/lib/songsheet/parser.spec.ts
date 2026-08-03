import { describe, expect, it } from "vitest"

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
                  chord: {
                    root: "C",
                  },
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
                  chord: {
                    root: "C",
                  },
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
            { pieces: [{ chord: { root: "C" } }] },
            { pieces: [{ chord: { root: "F" } }] },
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
                { chord: { root: "C" } },
                { chord: { root: "D" } },
                { chord: { root: "E" } },
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
                { chord: { root: "F#" } },
                { chord: { root: "F#" } },
                { chord: { root: "A#" } },
                { chord: { root: "A#" } },
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
                { chord: { root: "F" } },
                { chord: { root: "C" } },
                { chord: { root: "E" } },
                { chord: { root: "B" } },
              ],
            },
          ],
        },
      ],
    })
  })
})
