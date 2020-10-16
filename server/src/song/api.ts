import { DataSource } from 'apollo-datasource'
import { Database, sql } from 'pg-toolbox'

import { Song } from './models'
import { SongRecord } from './schema'

export type SearchOptions = {
  query?: string
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

  async searchSongs(options: SearchOptions = {}): Promise<Song[]> {
    const { query } = options

    const conditions = []

    if (query) {
      conditions.push(sql`"song"."title" ILIKE ${'%' + query + '%'}`)
    }

    const songs = await this.db.query<SongRecord>(sql`
      SELECT * FROM "song" WHERE ${sql.and(conditions)}
    `)

    return songs.map(fromRecord)
  }
}
