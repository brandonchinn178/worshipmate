import { sql, SqlQuery } from 'pg-fusion'

import { SearchFilters } from './models'

export type SongSelectResult = {
  id: number
  slug: string
  title: string
  artist_id: number
  recommended_key: string
  time_signature: [number, number]
  bpm: number
}

export const SONG_SELECT_QUERY = sql`
  SELECT
    "song"."id",
    "song"."slug",
    "song"."title",
    "artist"."id" AS artist_id,
    "song"."recommended_key",
    ARRAY[
      "song"."time_signature_top",
      "song"."time_signature_bottom"
    ] AS time_signature,
    "song"."bpm"
  FROM "song"
  INNER JOIN "artist" ON "song"."artist" = "artist"."id"
`

export type SearchOptions = {
  query?: string
  filters?: SearchFilters
}

export const getSearchCondition = (options: SearchOptions): SqlQuery => {
  const { query, filters = {} } = options

  const conditions = []

  if (query) {
    conditions.push(sql`"song"."title" ILIKE ${'%' + query + '%'}`)
  }

  if (filters.recommendedKey) {
    conditions.push(sql`"song"."recommended_key" = ${filters.recommendedKey}`)
  }

  if (filters.bpm) {
    conditions.push(sql`"song"."bpm" = ${filters.bpm}`)
  }

  if (filters.timeSignature) {
    const [top, bottom] = filters.timeSignature
    conditions.push(sql`
      "song"."time_signature_top" = ${top} AND
      "song"."time_signature_bottom" = ${bottom}
    `)
  }

  return sql.and(conditions)
}
