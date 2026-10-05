import { describe, expect, it } from "vitest"

import type { Song } from "$lib/song"
import { parseKey, parseSongSheet } from "$lib/songsheet/parser"
import { parseVocalRange } from "$lib/VocalRange"

import { SongRenderer } from "./render"

const BASE_SONG: Song = {
  id: "song1",
  slug: "song1",
  title: "My Song",
  artist: "John Singer",
  key: parseKey("D"),
  vocalRange: parseVocalRange(["D3", "D4"]),
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
    expect(SongRenderer.renderSong(song, options)).toMatchInlineSnapshot(`
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

  it("renders a song without chords", () => {
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
    expect(SongRenderer.renderSong(song, options)).toMatchInlineSnapshot(`
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

  it("renders a song with only lyrics", () => {
    const options = {
      includeHeader: false,
      includeLabels: false,
      includeChords: false,
    }
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
    expect(SongRenderer.renderSong(song, options)).toMatchInlineSnapshot(`
      "This is a line in the verse
      This has no chords
      This is a big chord
      This has a space

      This is a line in the chorus
      This has no chords again"
    `)
  })

  it("renders chords in the key", () => {
    const songSharp = {
      ...BASE_SONG,
      key: parseKey("E"),
      sheet: parseSongSheet(`
        {section Intro}
        [Dbm] [C#m]
        {/section}
      `),
    }
    const outSharp = SongRenderer.renderSong(songSharp, {})
    expect(outSharp).toContain("C#m")
    expect(outSharp).not.toContain("Dbm")

    const songFlat = {
      ...songSharp,
      key: parseKey("Ab"),
    }
    const outFlat = SongRenderer.renderSong(songFlat, {})
    expect(outFlat).toContain("Dbm")
    expect(outFlat).not.toContain("C#m")
  })
})
