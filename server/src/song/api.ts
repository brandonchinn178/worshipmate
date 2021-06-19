import * as _ from 'lodash'
import { Database, sql, SqlQuery } from 'pg-fusion'

import { camelCaseRow } from '~/utils/db'

import { SONG_SELECT_QUERY, SongSelectResult } from './db'
import { Artist, SearchFilters, Song, TimeSignature } from './models'
import { ArtistRecord, SongRecord } from './schema'

export type SearchOptions = {
  query?: string
  filters?: SearchFilters
}

export class SongAPI {
  constructor(private readonly db: Database) {}

  /** Search songs **/

  async searchSongs(options?: SearchOptions): Promise<Song[]> {
    const condition = this.getSearchCondition(options)

    const songs = await this.db.query<SongSelectResult>(sql`
      ${SONG_SELECT_QUERY}
      WHERE ${condition}
      ORDER BY "song"."title"
    `)

    return _.map(songs, camelCaseRow)
  }

  async getSong(id: number): Promise<Song | null> {
    const song = await this.db.queryOne<SongSelectResult>(sql`
      ${SONG_SELECT_QUERY}
      WHERE "song"."id" = ${id}
    `)

    return song && camelCaseRow(song)
  }

  async getSongBySlug(slug: string): Promise<Song | null> {
    const song = await this.db.queryOne<SongSelectResult>(sql`
      ${SONG_SELECT_QUERY}
      WHERE "song"."slug" = ${slug}
    `)

    return song && camelCaseRow(song)
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
    artist: string
    recommendedKey: string
    timeSignature: TimeSignature
    bpm: number
  }): Promise<Song> {
    const artist = await this.getOrCreateArtist(song.artist)

    const slug =
      song.slug ??
      (await this.getAvailableSlug('song', _.kebabCase(song.title)))

    const {
      time_signature_top,
      time_signature_bottom,
      ...createdSong
    } = await this.db.insert<SongRecord>('song', {
      slug,
      title: song.title,
      artist: artist.id,
      recommended_key: song.recommendedKey,
      time_signature_top: song.timeSignature[0],
      time_signature_bottom: song.timeSignature[1],
      bpm: song.bpm,
    })

    return camelCaseRow({
      ...createdSong,
      artist: artist.name,
      timeSignature: [
        time_signature_top,
        time_signature_bottom,
      ] as TimeSignature,
    })
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

    try {
      await this.db.execute(sql`
        UPDATE "song"
        SET ${sql.join(updatesSql, ', ')}
        WHERE "id" = ${id}
      `)
    } catch (e) {
      if (
        e.message ==
        'duplicate key value violates unique constraint "song_slug_key"'
      ) {
        throw new Error('Could not set slug: slug already in use')
      }

      throw e
    }
  }

  /** Artists **/

  async getOrCreateArtist(name: string): Promise<Artist> {
    const existingArtist = await this.db.queryOne<ArtistRecord>(sql`
      SELECT * FROM "artist"
      WHERE "name" = ${name}
    `)

    if (existingArtist) {
      return existingArtist
    }

    const slug = await this.getAvailableSlug('artist', _.kebabCase(name))

    return this.db.insert<ArtistRecord>('artist', {
      slug,
      name,
    })
  }

  /** Helpers **/

  private async getAvailableSlug(
    table: string,
    originalSlug: string,
  ): Promise<string> {
    const takenSlugs = _.map(
      await this.db.query(sql`
        SELECT "slug" FROM ${sql.quote(table)}
        WHERE "slug" LIKE ${originalSlug + '%'}
      `),
      'slug',
    )

    let slug = originalSlug
    let slugId = 1
    while (_.includes(takenSlugs, slug)) {
      slug = `${originalSlug}-${slugId}`
      slugId += 1
    }

    return slug
  }
}
