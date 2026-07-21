import { createQuery } from "@tanstack/svelte-query"

import { supabase } from "./supabase"

export type Song = {
  id: string
  slug: string
  title: string
  artist: string
  key: string
}

export const createListSongsQuery = () => {
  return createQuery<Song[]>(() => ({
    queryKey: ["list-songs"],
    queryFn: async () => {
      const { data: songs, error } = await SongQuery.query
      if (error) throw error
      return songs.map(SongQuery.deserialize)
    },
  }))
}

export const createGetSongQuery = (slug: string) => {
  return createQuery<Song | null>(() => ({
    queryKey: ["get-song"],
    queryFn: async () => {
      const { data: song, error } = await SongQuery.query.eq("slug", slug).maybeSingle()
      if (error) throw error
      return song && SongQuery.deserialize(song)
    },
  }))
}

type SongQueryRow = NonNullable<Awaited<typeof SongQuery.query>["data"]>[number]
class SongQuery {
  static get query() {
    return supabase.from("songs").select(`
      id,
      slug,
      title,
      artist (name),
      key
    `)
  }

  static deserialize(song: SongQueryRow): Song {
    return {
      ...song,
      artist: song.artist.name,
    }
  }
}
