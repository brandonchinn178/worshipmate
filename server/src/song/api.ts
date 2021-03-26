import { Database, sql, SqlQuery } from 'pg-fusion'

import { SearchFilters, Song } from './models'
import { SongRecord } from './schema'

export type SearchOptions = {
  query?: string
  filters?: SearchFilters
}

const fromRecord = (record: SongRecord): Song => {
  const {
    recommended_key,
    time_signature_top,
    time_signature_bottom,
    ...song
  } = record

  return {
    ...song,
    recommendedKey: recommended_key,
    timeSignature: [time_signature_top, time_signature_bottom],
  }
}

export class SongAPI {
  constructor(private readonly db: Database) {}

  async searchSongs(options?: SearchOptions): Promise<Song[]> {
    const condition = this.getSearchCondition(options)

    const songs = await this.db.query<SongRecord>(sql`
      SELECT * FROM "song"
      WHERE ${condition}
      ORDER BY "song"."title"
    `)

    return songs.map(fromRecord)
  }

  async getSong(id: number): Promise<Song | null> {
    const [song] = await this.db.query<SongRecord>(sql`
      SELECT * FROM "song"
      WHERE "song"."id" = ${id}
    `)

    return song ? fromRecord(song) : null
  }

  private getSearchCondition(options: SearchOptions = {}): SqlQuery {
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
}
