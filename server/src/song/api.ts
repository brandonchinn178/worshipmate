import { DataSource } from 'apollo-datasource'
import { Database, sql, SqlQuery } from 'pg-toolbox'

import { SearchFilters, Song } from './models'
import { SongRecord } from './schema'

export type SearchOptions = {
  query?: string
  filters?: SearchFilters
}

const fromRecord = (song: SongRecord): Song => ({
  ...song,
  recommendedKey: song.recommended_key,
  timeSignature: [song.time_signature_top, song.time_signature_bottom],
})

export class SongAPI extends DataSource {
  constructor(private readonly db: Database) {
    super()
  }

  async searchSongs(options?: SearchOptions): Promise<Song[]> {
    const condition = this.getSearchCondition(options)

    const songs = await this.db.query<SongRecord>(sql`
      SELECT * FROM "song"
      WHERE ${condition}
      ORDER BY "song"."title"
    `)

    return songs.map(fromRecord)
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
