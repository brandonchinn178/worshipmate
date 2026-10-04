import { transposeKey } from "$lib/songsheet/key"
import { type Key, type SongSheet, transposeSongSheet } from "$lib/songsheet/sheet"

export type Song = {
  id: string
  slug: string
  title: string
  artist: string
  key: Key
  sheet: SongSheet
}

export const transposeSong = (song: Song, n: number): Song => {
  return {
    ...song,
    // TODO: key of song should use "standard names", e.g. Bb instead of A#
    key: transposeKey(song.key, n),
    sheet: transposeSongSheet(song.sheet, n),
  }
}
