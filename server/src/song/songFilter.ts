import * as _ from 'lodash'

/** SongFilter interface **/

export type SongFilterTypes = {
  RECOMMENDED_KEY: string
  BPM: PositiveInt
  TIME_SIGNATURE: TimeSignature
  THEME: string
}

export type SongFilterNames = keyof SongFilterTypes

export interface SongFilter<Name extends SongFilterNames> {
  validate: (value: unknown) => SongFilterTypes[Name] | null
  display: (value: SongFilterTypes[Name]) => string
}

/** Validation helpers **/

const isNonEmptyString = (v: unknown): v is string =>
  _.isString(v) && v.length > 0

type PositiveInt = number

const isPositiveInt = (v: unknown): v is PositiveInt =>
  _.isNumber(v) && _.isInteger(v) && v > 0

/** Available SongFilters **/

export const RecommendedKeyFilter: SongFilter<'RECOMMENDED_KEY'> = {
  validate(value: unknown) {
    if (isNonEmptyString(value)) {
      return value
    }
    return null
  },
  display(value: string) {
    return value
  },
}

export const BpmFilter: SongFilter<'BPM'> = {
  validate(value: unknown) {
    if (_.isString(value)) {
      return this.validate(_.parseInt(value))
    }
    if (isPositiveInt(value)) {
      return value
    }
    return null
  },
  display(value: PositiveInt) {
    return value.toString()
  },
}

type TimeSignature = [PositiveInt, PositiveInt]

export const TimeSignatureFilter: SongFilter<'TIME_SIGNATURE'> = {
  validate(value: unknown) {
    if (_.isString(value)) {
      const parts = value.match(/^(\d+)\/(\d+)$/)
      if (parts) {
        const partsMatch = [parts[1], parts[2]]
        return this.validate(_.map(partsMatch, _.parseInt))
      }
    }
    if (
      _.isArray(value) &&
      value.length === 2 &&
      _.every(value, isPositiveInt)
    ) {
      return value as TimeSignature
    }
    return null
  },
  display([top, bottom]: TimeSignature) {
    return `${top}/${bottom}`
  },
}

export const ThemeFilter: SongFilter<'THEME'> = {
  validate(value: unknown) {
    if (isNonEmptyString(value)) {
      return value
    }
    return null
  },
  display(value: string) {
    return value
  },
}

/** Getting a SongFilter **/

const SONG_FILTERS = {
  RECOMMENDED_KEY: RecommendedKeyFilter,
  BPM: BpmFilter,
  TIME_SIGNATURE: TimeSignatureFilter,
  THEME: ThemeFilter,
}

export const isSongFilterName = (name: string): name is SongFilterNames =>
  name in SONG_FILTERS

export const getSongFilter = <Name extends SongFilterNames>(
  name: Name,
): SongFilter<Name> => (SONG_FILTERS[name] as unknown) as SongFilter<Name>
