import type { QueryData } from "@supabase/supabase-js"
import slugify from "slugify"
import { toast } from "svelte-sonner"

import { renderKey } from "$lib/songsheet/key"
import { parseAbsNote, parseKey, parseSongSheet } from "$lib/songsheet/parser"
import { type Key } from "$lib/songsheet/sheet"
import * as supabase from "$lib/supabase"
import { renderVocalRange, type VocalRange } from "$lib/VocalRange"

import type { Song } from "./model"
import { SongRenderer } from "./render"

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

  const { data, error } = await query
  if (error) throw error

  return data.map((row) => SongQuery.deserialize(row))
}

export const listArtists = async () => {
  const client = supabase.getClient()
  const { data, error } = await client.from("artists").select("id, name")
  if (error) throw error
  return data
}

export const getSong = async (slug: string) => {
  const client = supabase.getClient()
  const { data, error } = await client
    .from("songs")
    .select(SongQuery.cols)
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw error
  return data && SongQuery.deserialize(data)
}

export type AddSongInput = {
  title: string
  artist: { name: string } | { id: string }
  key: Key
  vocalRange: VocalRange
  sheet: string
}
export const addSong = async (input: AddSongInput): Promise<Song> => {
  const parsedSheet = parseSongSheet(input.sheet)
  const lyrics = new SongRenderer(input.key, {
    includeChords: false,
    includeLabels: false,
  }).renderSheet(parsedSheet)

  // TODO: handle duplicate slugs
  const slug = slugify(input.title, { lower: true })

  const client = supabase.getClient()
  const artist = await (async () => {
    if ("id" in input.artist) {
      return input.artist
    }

    const { data, error: artistError } = await client
      .from("artists")
      .upsert({ name: input.artist.name }, { onConflict: "name" })
      .select("id")
      .single()
    if (artistError) throw artistError
    return data
  })()

  const { data, error: songError } = await client
    .from("songs")
    .insert({
      slug,
      title: input.title,
      artist: artist.id,
      key: renderKey(input.key),
      vocal_range: renderVocalRange(input.vocalRange),
      sheet: input.sheet,
      lyrics,
    })
    .select(SongQuery.cols)
    .single()
  if (songError) throw songError

  const song = SongQuery.deserialize(data)

  // Don't await; run in background
  void (async () => {
    const { error } = await client.rpc("generate_keywords", { song_id: song.id })
    if (error) {
      console.error(error)
      toast.error(`Failed to generate keywords: ${error.message}`)
    }
  })()

  return song
}

type SongQueryRow = QueryData<ReturnType<typeof SongQuery._rowShape>>
class SongQuery {
  static cols = `
    id,
    slug,
    title,
    artist (name),
    key,
    vocal_range,
    sheet
  ` as const

  static _rowShape = () => supabase.nullClient.from("songs").select(this.cols).single()

  static deserialize(song: SongQueryRow): Song {
    const [lo, hi] = song.vocal_range
    return {
      ...song,
      artist: song.artist.name,
      key: parseKey(song.key),
      vocalRange: [parseAbsNote(lo), parseAbsNote(hi)],
      sheet: parseSongSheet(song.sheet),
    }
  }
}
