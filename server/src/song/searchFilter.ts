import * as _ from 'lodash'

import {
  getSongFilter,
  isSongFilterName,
  SongFilter,
  SongFilterNames,
  SongFilterTypes,
} from './songFilter'

type UnknownFilter = {
  name: string
  oneof: unknown[]
}

type SearchFilterFor<Name extends SongFilterNames> = {
  name: Name
  oneof: Array<SongFilterTypes[Name]>
}

// https://stackoverflow.com/a/51691257
type SearchFilterHelper<Name> = Name extends SongFilterNames
  ? SearchFilterFor<Name>
  : never

export type SearchFilter = SearchFilterHelper<SongFilterNames>

/**
 * Parse an unchecked filter into a typechecked filter.
 *
 * Throws an error if the filter could not be parsed.
 */
export const validateSearchFilter = (filter: UnknownFilter): SearchFilter => {
  const { name } = filter

  if (!isSongFilterName(name)) {
    throw new Error(`Unknown filter: ${name}`)
  }

  const songFilter = getSongFilter(name)
  const [oneof, invalidValues] = validateAll(songFilter, filter.oneof)

  if (invalidValues.length > 0) {
    const invalidValuesDisplay = invalidValues.map((v) => `'${v}'`).join(', ')
    throw new Error(
      `Invalid value(s) for filter '${name}': ${invalidValuesDisplay}`,
    )
  }

  return { name, oneof } as SearchFilter
}

const validateAll = <Name extends SongFilterNames>(
  songFilter: SongFilter<Name>,
  oneof: unknown[],
): [Array<SongFilterTypes[Name]>, unknown[]] => {
  const invalidValues: unknown[] = []

  const validValues = _.compact(
    oneof.map((value) => {
      const parsedValue = songFilter.validate(value)
      if (parsedValue === null) {
        invalidValues.push(value)
      }
      return parsedValue
    }),
  )

  return [validValues, invalidValues]
}
