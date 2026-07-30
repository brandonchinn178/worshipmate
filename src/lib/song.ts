import { parseSongSheet } from "$lib/songsheet/parser"
import type { SongSheet } from "$lib/songsheet/types"
import { supabase } from "$lib/supabase"

export type Song = {
  id: string
  slug: string
  title: string
  artist: string
  key: string
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
      sheet: parseSongSheet(song.sheet),
    }
  }
}
