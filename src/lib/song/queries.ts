import type { QueryData } from "@supabase/supabase-js"
import slugify from "slugify"

import { renderChord } from "$lib/songsheet/chord"
import { parseChord, parseSongSheet } from "$lib/songsheet/parser"
import { type Chord } from "$lib/songsheet/sheet"
import * as supabase from "$lib/supabase"

import type { Song } from "./model"

export type ListSongsOpts = {
  search?: string | null
}

export const listSongs = async ({ search }: ListSongsOpts) => {
  const client = supabase.getClient()
  const query = (
    search // keep-multiline
      ? client.rpc("search_songs", { q: search })
      : client.from("songs")
  )
    .select(SongQuery.cols)
    .order("title")

  const { data: songs, error } = await query
  if (error) throw error

  // search_songs is a VIEW, which doesn't propagate NOT NULL constraints.
  // Just cast it to the correct type
  const notNullSongs = songs as SongQueryRow[]

  return notNullSongs.map(SongQuery.deserialize)
}

export const getSong = async (slug: string) => {
  const client = supabase.getClient()
  const { data: song, error } = await client
    .from("songs")
    .select(SongQuery.cols)
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw error
  return song && SongQuery.deserialize(song)
}

export type AddSongInput = {
  title: string
  artist: string
  key: Chord
  sheet: string
}
export const addSong = async (input: AddSongInput): Promise<Song> => {
  const client = supabase.getClient()
  const { data: artist, error: artistError } = await client
    .from("artists")
    .upsert({ name: input.artist }, { onConflict: "name", ignoreDuplicates: true })
    .select("id")
    .single()
  if (artistError) throw artistError

  // TODO: handle duplicate slugs
  const slug = slugify(input.title, { lower: true })

  const { data: song, error: songError } = await client
    .from("songs")
    .insert({
      slug,
      title: input.title,
      artist: artist.id,
      key: renderChord(input.key),
      sheet: input.sheet,
    })
    .select(SongQuery.cols)
    .single()
  if (songError) throw songError
  return SongQuery.deserialize(song)
}

type SongQueryRow = QueryData<ReturnType<typeof SongQuery._rowShape>>
class SongQuery {
  static cols = `
    id,
    slug,
    title,
    artist (name),
    key,
    sheet
  ` as const

  static _rowShape = () => supabase.nullClient.from("songs").select(this.cols).single()

  static deserialize(song: SongQueryRow): Song {
    return {
      ...song,
      artist: song.artist.name,
      key: parseChord(song.key),
      sheet: parseSongSheet(song.sheet),
    }
  }
}
