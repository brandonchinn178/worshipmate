import { transposeKey } from "$lib/songsheet/key"
import { type Key, type SongSheet, transposeSongSheet } from "$lib/songsheet/sheet"
import type { VocalRange } from "$lib/VocalRange"
import { transposeVocalRange } from "$lib/VocalRange"

export type SongSearch = {
  slug: string
  title: string
  artist: string
  key: Key
}

export type Song = {
  id: string
  slug: string
  title: string
  artist: string
  key: Key
  vocalRange: VocalRange
  sheet: SongSheet
}

export const transposeSong = (song: Song, n: number): Song => {
  return {
    ...song,
    key: transposeKey(song.key, n),
    vocalRange: transposeVocalRange(song.vocalRange, n),
    sheet: transposeSongSheet(song.sheet, n),
  }
}
