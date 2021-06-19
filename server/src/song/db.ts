import { sql } from 'pg-fusion'

export type SongSelectResult = {
  id: number
  slug: string
  title: string
  artist: string
  recommended_key: string
  time_signature: [number, number]
  bpm: number
}

export const SONG_SELECT_QUERY = sql`
  SELECT
    "song"."id",
    "song"."slug",
    "song"."title",
    "artist"."name" AS artist,
    "song"."recommended_key",
    ARRAY[
      "song"."time_signature_top",
      "song"."time_signature_bottom"
    ] AS time_signature,
    "song"."bpm"
  FROM "song"
  INNER JOIN "artist" ON "song"."artist" = "artist"."id"
`
