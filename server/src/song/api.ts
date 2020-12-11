import { DataSource } from 'apollo-datasource'
import { Database, sql, SqlQuery } from 'pg-toolbox'

import { Song } from './models'
import { SongRecord } from './schema'
import {
  SearchFilter,
  SearchFilterNames,
  SearchFilterTypes,
} from './searchFilter'

export type SearchOptions = {
  query?: string
  filters?: SearchFilter[]
}

type AvailableFilterFor<Name extends SearchFilterNames> = {
  value: SearchFilterTypes[Name]
  valueDisplay: string
  count: number
}

type AvailableFiltersFor<
  Name extends SearchFilterNames
> = AvailableFilterFor<Name>[]

export type AvailableFilters = {
  [Name in SearchFilterNames]: AvailableFiltersFor<Name>
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
    const recommendedKeyCounts = await this.getAvailableFiltersWith<'RECOMMENDED_KEY'>(
      sql.raw('"song"."recommended_key"'),
      (key) => key,
      options,
    )

    const bpmCounts = await this.getAvailableFiltersWith<'BPM'>(
      sql.raw('"song"."bpm"'),
      (bpm) => bpm.toString(),
      options,
    )

    const timeSignatureCounts = await this.getAvailableFiltersWith<'TIME_SIGNATURE'>(
      sql.raw(`
        ARRAY[
          "song"."time_signature_top",
          "song"."time_signature_bottom"
        ]
      `),
      ([top, bottom]) => `${top}/${bottom}`,
      options,
    )

    return {
      RECOMMENDED_KEY: recommendedKeyCounts,
      BPM: bpmCounts,
      TIME_SIGNATURE: timeSignatureCounts,

      // TODO
      THEMES: [],
    }
  }

  private async getAvailableFiltersWith<Name extends SearchFilterNames>(
    valueSql: SqlQuery,
    valueToDisplay: (v: SearchFilterTypes[Name]) => string,
    options?: SearchOptions,
  ): Promise<AvailableFiltersFor<Name>> {
    const condition = this.getSearchCondition(options)

    // Use integer instead of default bigint to get back a normal number
    // in javascript.
    // Revisit when database contains more than 2,147,483,647 songs.
    const countSql = sql.raw('COUNT(*) :: integer')

    const availableFilters = await this.db.query<AvailableFilterFor<Name>>(sql`
      SELECT
        ${valueSql} AS "value",
        ${countSql} as "count"
      FROM "song"
      WHERE ${condition}
      GROUP BY "value"
    `)

    return availableFilters.map(({ value, count }) => ({
      value,
      valueDisplay: valueToDisplay(value),
      count,
    }))
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
