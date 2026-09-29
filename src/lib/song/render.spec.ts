import { describe, expect, it } from "vitest"

import type { Song } from "$lib/song"
import { parseChord, parseSongSheet } from "$lib/songsheet/parser"

import { Renderer } from "./render"

const BASE_SONG: Song = {
  id: "song1",
  slug: "song1",
  title: "My Song",
  artist: "John Singer",
  key: parseChord("D"),
  sheet: parseSongSheet(""),
}

describe("Renderer", () => {
  it("renders a song with chords and lyrics", () => {
    const options = { includeChords: true }
    const song = {
      ...BASE_SONG,
      sheet: parseSongSheet(`
        {section Intro}
        [G] [D] [G]
        [Em] [D] [C]
        {/section}

        {section Verse #repeat=2}
        [G]This is a [D]line in the [G]verse
        This has no chords
        [G]This is [C#m7/E]a [G]big chord
        [G]_ This has a space
        {/section}

        {section Chorus}
        [G]This is a [D]line in the [G]chorus
        This has no chords again
        {/section}

        {goto Verse}
        {goto Chorus #repeat=2}
      `),
    }
    expect(Renderer.renderSong(song, options)).toMatchInlineSnapshot(`
      "My Song
      John Singer

      [Intro]
      G D G
      Em D C

      [Verse (2x)]
      G         D           G
      This is a line in the verse

      This has no chords
      G       C#m7/E G
      This is a      big chord
      G
          This has a space

      [Chorus]
      G         D           G
      This is a line in the chorus

      This has no chords again

      [→ Verse]

      [→ Chorus (2x)]"
    `)
  })

  it("renders a song with just lyrics", () => {
    const options = { includeChords: false }
    const song = {
      ...BASE_SONG,
      sheet: parseSongSheet(`
        {section Intro}
        [G] [D] [G]
        [Em] [D] [C]
        {/section}

        {section Verse #repeat=2}
        [G]This is a [D]line in the [G]verse
        This has no chords
        [G]This is [C#m7/E]a [G]big chord
        [G]_ This has a space
        {/section}

        {section Chorus}
        [G]This is a [D]line in the [G]chorus
        This has no chords again
        {/section}

        {goto Verse}
        {goto Chorus #repeat=2}
      `),
    }
    expect(Renderer.renderSong(song, options)).toMatchInlineSnapshot(`
      "My Song
      John Singer

      [Verse (2x)]
      This is a line in the verse
      This has no chords
      This is a big chord
      This has a space

      [Chorus]
      This is a line in the chorus
      This has no chords again

      [→ Verse]

      [→ Chorus (2x)]"
    `)
  })

  it("renders chords in the key", () => {
    const songSharp = {
      ...BASE_SONG,
      key: parseChord("E"),
      sheet: parseSongSheet(`
        {section Intro}
        [Dbm] [C#m]
        {/section}
      `),
    }
    const outSharp = Renderer.renderSong(songSharp, {})
    expect(outSharp).toContain("C#m")
    expect(outSharp).not.toContain("Dbm")

    const songFlat = {
      ...songSharp,
      key: parseChord("Ab"),
    }
    const outFlat = Renderer.renderSong(songFlat, {})
    expect(outFlat).toContain("Dbm")
    expect(outFlat).not.toContain("C#m")
  })
})
