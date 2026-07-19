import { createQuery } from "@tanstack/svelte-query"

import { supabase } from "./supabase"

export type Song = {
  id: string
  slug: string
  title: string
  artist: string
  key: string
}

export const listSongs = () => {
  return createQuery(() => ({
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
