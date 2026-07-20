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
      const { data, error } = await supabase.from("songs").select(`
        id,
        slug,
        title,
        artist (name),
        key
      `)
      if (error) throw error
      return data.map((song) => ({
        ...song,
        artist: song.artist.name,
      }))
    },
  }))
}

export const createGetSongQuery = (slug: string) => {
  return createQuery<Song | null>(() => ({
    queryKey: ["get-song"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(
          `
        id,
        slug,
        title,
        artist (name),
        key
      `,
        )
        .eq("slug", slug)
        .single()
      if (error) throw error
      return (
        data && {
          ...data,
          artist: data.artist.name,
        }
      )
    },
  }))
}
