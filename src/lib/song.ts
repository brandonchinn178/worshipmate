import { parseChord, parseSongSheet } from "$lib/songsheet/parser"
import { type Chord, type SongSheet, transposeSongSheet } from "$lib/songsheet/sheet"
import { supabase } from "$lib/supabase"

import { transposeChord } from "./songsheet/chord"

export type Song = {
  id: string
  slug: string
  title: string
  artist: string
  key: Chord
  sheet: SongSheet
}

export const listSongs = async () => {
  const { data: songs, error } = await SongQuery.query
  if (error) throw error
  return songs.map(SongQuery.deserialize)
}

export const getSong = async (slug: string) => {
  const { data: song, error } = await SongQuery.query.eq("slug", slug).maybeSingle()
  if (error) throw error
  return song && SongQuery.deserialize(song)
}

type SongQueryRow = NonNullable<Awaited<typeof SongQuery.query>["data"]>[number]
class SongQuery {
  static get query() {
    return supabase.from("songs").select(`
      id,
      slug,
      title,
      artist (name),
      key,
      sheet
    `)
  }

  static deserialize(song: SongQueryRow): Song {
    return {
      ...song,
      artist: song.artist.name,
      key: parseChord(song.key),
      sheet: parseSongSheet(song.sheet),
    }
  }
}

export const transposeSong = (song: Song, n: number): Song => {
  return {
    ...song,
    // TODO: key of song should use "standard names", e.g. Bb instead of A#
    key: transposeChord(song.key, n),
    sheet: transposeSongSheet(song.sheet, n),
  }
}
