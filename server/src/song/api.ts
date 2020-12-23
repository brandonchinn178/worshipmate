import { DataSource } from 'apollo-datasource'
import { Database, sql, SqlQuery } from 'pg-toolbox'

import { Song } from './models'
import { SongRecord } from './schema'
import { SearchFilter } from './searchFilter'

export type SearchOptions = {
  query?: string
  filters?: SearchFilter[]
}

const fromRecord = (song: SongRecord): Song => ({
  ...song,
  recommendedKey: song.recommended_key,
  timeSignature: {
    top: song.time_signature_top,
    bottom: song.time_signature_bottom,
  },
})

export class SongAPI extends DataSource {
  constructor(private readonly db: Database) {
    super()
  }

  async searchSongs(options?: SearchOptions): Promise<Song[]> {
    const condition = this.getSearchCondition(options)

    const songs = await this.db.query<SongRecord>(sql`
      SELECT * FROM "song" WHERE ${condition}
    `)

    return songs.map(fromRecord)
  }

  private getSearchCondition(options: SearchOptions = {}): SqlQuery {
    const { query, filters = [] } = options

    const conditions = []

    if (query) {
      conditions.push(sql`"song"."title" ILIKE ${'%' + query + '%'}`)
    }

    filters.forEach((filter) => {
      switch (filter.name) {
        case 'RECOMMENDED_KEY': {
          conditions.push(sql`"song"."recommended_key" = ${filter.value}`)
          break
        }
        case 'BPM': {
          conditions.push(sql`"song"."bpm" = ${filter.value}`)
          break
        }
        case 'TIME_SIGNATURE': {
          const [top, bottom] = filter.value
          conditions.push(sql`
            "song"."time_signature_top" = ${top} AND
            "song"."time_signature_bottom" = ${bottom}
          `)
          break
        }
      }
    })

    return sql.and(conditions)
  }
}
