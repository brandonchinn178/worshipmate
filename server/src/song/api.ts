import { DataSource } from 'apollo-datasource'
import { Database, sql, SqlQuery } from 'pg-toolbox'

import { Song } from './models'
import { SongRecord } from './schema'
import { SearchFilter } from './searchFilter'
import {
  BpmFilter,
  RecommendedKeyFilter,
  SongFilter,
  SongFilterNames,
  SongFilterTypes,
  TimeSignatureFilter,
} from './songFilter'

export type SearchOptions = {
  query?: string
  filters?: SearchFilter[]
}

export type AvailableFiltersFor<Name extends SongFilterNames> = Array<{
  value: SongFilterTypes[Name]
  valueDisplay: string
  count: number
}>

export type AvailableFilters = {
  [Name in SongFilterNames]: AvailableFiltersFor<Name>
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

  async getAvailableFilters(
    options?: SearchOptions,
  ): Promise<AvailableFilters> {
    const condition = this.getSearchCondition(options)

    // Use integer instead of default bigint to get back a normal number
    // in javascript.
    // Revisit when database contains more than 2,147,483,647 songs.
    const countSql = sql`COUNT(*) :: integer`

    // Get available filters for the given SongFilter using the given SqlQuery.
    // The SqlQuery must return rows of the type:
    //
    //   { value: SongFilterTypes[Name]; count: number }
    const getAvailableFiltersFor = async <Name extends SongFilterNames>(
      songFilter: SongFilter<Name>,
      sqlQuery: SqlQuery,
    ): Promise<AvailableFiltersFor<Name>> => {
      const availableFilters = await this.db.query<{
        value: SongFilterTypes[Name]
        count: number
      }>(sqlQuery)
      return availableFilters.map(({ value, count }) => ({
        value,
        valueDisplay: songFilter.display(value),
        count,
      }))
    }

    const recommendedKeyFilters = await getAvailableFiltersFor(
      RecommendedKeyFilter,
      sql`
        SELECT
          "song"."recommended_key" AS "value",
          ${countSql} AS "count"
        FROM "song"
        WHERE ${condition}
        GROUP BY "value"
      `,
    )

    const bpmFilters = await getAvailableFiltersFor(
      BpmFilter,
      sql`
        SELECT
          "song"."bpm" AS "value",
          ${countSql} AS "count"
        FROM "song"
        WHERE ${condition}
        GROUP BY "value"
      `,
    )

    const timeSignatureFilters = await getAvailableFiltersFor(
      TimeSignatureFilter,
      sql`
        SELECT
          ARRAY[
            "song"."time_signature_top",
            "song"."time_signature_bottom"
          ] AS "value",
          ${countSql} AS "count"
        FROM "song"
        WHERE ${condition}
        GROUP BY "value"
      `,
    )

    return {
      RECOMMENDED_KEY: recommendedKeyFilters,
      BPM: bpmFilters,
      TIME_SIGNATURE: timeSignatureFilters,
      // TODO
      THEME: [],
    }
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
          conditions.push(
            sql.or(
              filter.oneof.map(
                (value) => sql`"song"."recommended_key" = ${value}`,
              ),
            ),
          )
          break
        }
        case 'BPM': {
          conditions.push(
            sql.or(filter.oneof.map((value) => sql`"song"."bpm" = ${value}`)),
          )
          break
        }
        case 'TIME_SIGNATURE': {
          conditions.push(
            sql.or(
              filter.oneof.map(
                ([top, bottom]) =>
                  sql`
                  "song"."time_signature_top" = ${top} AND
                  "song"."time_signature_bottom" = ${bottom}
                `,
              ),
            ),
          )
          break
        }
      }
    })

    return sql.and(conditions)
  }
}
