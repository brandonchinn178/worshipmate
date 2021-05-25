import * as _ from 'lodash'
import { Database, sql, SqlQuery } from 'pg-fusion'

import { SearchFilters, Song, TimeSignature } from './models'
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

  /** Search songs **/

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

  async getSongBySlug(slug: string): Promise<Song | null> {
    const [song] = await this.db.query<SongRecord>(sql`
      SELECT * FROM "song"
      WHERE "song"."slug" = ${slug}
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

  /** Manage songs **/

  async createSong(song: {
    slug?: string
    title: string
    recommendedKey: string
    timeSignature: TimeSignature
    bpm: number
  }): Promise<Song> {
    const {
      title,
      recommendedKey: recommended_key,
      timeSignature: [time_signature_top, time_signature_bottom],
      bpm,
    } = song

    let slug = song.slug
    if (!slug) {
      slug = _.kebabCase(song.title)

      const takenSlugs = _.map(
        await this.db.query(sql`
          SELECT "slug" FROM "song"
          WHERE "slug" LIKE ${slug + '%'}
        `),
        'slug',
      )

      let slugId = 1
      const originalSlug = slug
      while (_.includes(takenSlugs, slug)) {
        slug = `${originalSlug}-${slugId}`
        slugId += 1
      }
    }

    const result = await this.db.insert<SongRecord>('song', {
      slug,
      title,
      recommended_key,
      time_signature_top,
      time_signature_bottom,
      bpm,
    })

    return fromRecord(result)
  }

  async updateSong(
    id: number,
    updates: {
      slug?: string
      title?: string
      recommendedKey?: string
      timeSignature?: TimeSignature
      bpm?: number
    },
  ): Promise<void> {
    const updatesSql = _.compact([
      updates.slug && sql`"slug" = ${updates.slug}`,
      updates.title && sql`"title" = ${updates.title}`,
      updates.recommendedKey &&
        sql`"recommended_key" = ${updates.recommendedKey}`,
      updates.timeSignature &&
        sql`
          "time_signature_top" = ${updates.timeSignature[0]},
          "time_signature_bottom" = ${updates.timeSignature[1]}
        `,
      updates.bpm && sql`"bpm" = ${updates.bpm}`,
    ])

    if (updatesSql.length === 0) {
      return
    }

    await this.db.execute(sql`
      UPDATE "song"
      SET ${sql.join(updatesSql, ', ')}
      WHERE "id" = ${id}
    `)
  }
}
