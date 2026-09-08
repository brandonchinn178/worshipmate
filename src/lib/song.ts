import type { QueryData } from "@supabase/supabase-js"

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

export type ListSongsOpts = {
  search?: string
}

export const listSongs = async ({ search }: ListSongsOpts) => {
  const query = search
    ? supabase.rpc("search_songs", { q: search }).select(SongQuery.cols)
    : supabase.from("songs").select(SongQuery.cols)

  const { data: songs, error } = await query
  if (error) throw error

  // search_songs is a VIEW, which doesn't propagate NOT NULL constraints.
  // Just cast it to the correct type
  const notNullSongs = songs as SongQueryRow[]

  return notNullSongs.map(SongQuery.deserialize)
}

export const getSong = async (slug: string) => {
  const { data: song, error } = await supabase
    .from("songs")
    .select(SongQuery.cols)
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw error
  return song && SongQuery.deserialize(song)
}

type SongQueryRow = QueryData<typeof SongQuery._rowShape>
class SongQuery {
  static cols = `
    id,
    slug,
    title,
    artist (name),
    key,
    sheet
  ` as const

  static _rowShape = supabase.from("songs").select(this.cols).single()

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
