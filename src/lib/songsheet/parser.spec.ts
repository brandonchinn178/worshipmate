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
