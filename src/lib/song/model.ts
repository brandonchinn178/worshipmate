import { transposeChord } from "$lib/songsheet/chord"
import { type Chord, type SongSheet, transposeSongSheet } from "$lib/songsheet/sheet"

export type Song = {
  id: string
  slug: string
  title: string
  artist: string
  key: Chord
  sheet: SongSheet
}

export const transposeSong = (song: Song, n: number): Song => {
  return {
    ...song,
    // TODO: key of song should use "standard names", e.g. Bb instead of A#
    key: transposeChord(song.key, n),
    sheet: transposeSongSheet(song.sheet, n),
  }
}
