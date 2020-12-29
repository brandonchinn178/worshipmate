import _ from 'lodash'
import { NextRouter } from 'next/router'

import { setQueryString } from '~/router'

import { Song } from './models'

export type ActiveFilters = {
  recommendedKey?: string
  bpm?: number
  timeSignature?: [number, number]
}

export type FilterNames = keyof ActiveFilters
export type FilterValue<Name extends FilterNames> = NonNullable<
  ActiveFilters[Name]
>

export type AvailableFilterOptions<Name extends FilterNames> = Array<{
  value: FilterValue<Name>
  valueDisplay: string
  count: number
}>

export type AvailableFilters = {
  [Name in FilterNames]: AvailableFilterOptions<Name>
}

export type FilterHandler = {
  addFilter: <Name extends FilterNames>(
    name: Name,
    value: FilterValue<Name>,
  ) => void

  removeFilter: <Name extends FilterNames>(name: Name) => void
}

/** All filter types **/

type FilterType<Name extends FilterNames> = {
  parseFilterValue: (value: string) => FilterValue<Name> | null
  showFilterValue: (value: FilterValue<Name>) => string
  fromSong: (song: Song) => FilterValue<Name>
}

const ALL_FILTER_TYPES: { [Name in FilterNames]: FilterType<Name> } = {
  recommendedKey: {
    parseFilterValue: _.identity,
    showFilterValue: _.toString,
    fromSong: ({ recommendedKey }) => recommendedKey,
  },
  bpm: {
    parseFilterValue: (value) => {
      const bpm = _.parseInt(value)
      if (!_.isFinite(bpm)) {
        return null
      }
      return bpm
    },
    showFilterValue: _.toString,
    fromSong: ({ bpm }) => bpm,
  },
  timeSignature: {
    parseFilterValue: (value) => {
      const parts = value.match(/^(\d+)\/(\d+)$/)
      if (!parts) {
        return null
      }

      const top = _.parseInt(parts[1])
      const bottom = _.parseInt(parts[2])
      return [top, bottom]
    },
    showFilterValue: ([top, bottom]) => `${top}/${bottom}`,
    fromSong: ({ timeSignature }) => timeSignature,
  },
}

export const forEachFilterType = (
  callback: <Name extends FilterNames>(
    filterName: Name,
    filterType: FilterType<Name>,
  ) => void,
) => {
  _.each(ALL_FILTER_TYPES, (filterType, filterName) => {
    callback(filterName as FilterNames, filterType as FilterType<FilterNames>)
  })
}

export const getFilterType = <Name extends FilterNames>(
  name: Name,
): FilterType<Name> => {
  return (ALL_FILTER_TYPES[name] as unknown) as FilterType<Name>
}

/** Collecting filters from a list of songs **/

export const getAvailableFilters = (
  songs: readonly Song[],
): AvailableFilters => {
  const availableFilters = {} as AvailableFilters

  forEachFilterType(
    <Name extends FilterNames>(
      filterName: Name,
      filterType: FilterType<Name>,
    ) => {
      availableFilters[filterName] = _(songs)
        .map((song) => {
          const value = filterType.fromSong(song)
          return {
            value,
            valueDisplay: filterType.showFilterValue(value),
          }
        })
        .groupBy('valueDisplay')
        .map((optionsWithSameValue) => {
          return {
            ...optionsWithSameValue[0],
            count: optionsWithSameValue.length,
          }
        })
        .orderBy('count', 'desc')
        .value() as AvailableFilters[Name]
    },
  )

  return availableFilters
}

/** Marshalling filters to/from querystring **/

export const loadActiveFilters = (router: NextRouter): ActiveFilters => {
  const { query } = router

  const filters = {} as ActiveFilters

  forEachFilterType((filterName, filterType) => {
    const rawValue = query[filterName]
    if (_.isString(rawValue)) {
      const value = filterType.parseFilterValue(rawValue)
      if (value === null) {
        return
      }
      filters[filterName] = value
    }
  })

  return filters
}

export const mkFilterHandler = (router: NextRouter): FilterHandler => {
  return {
    addFilter: (name, value) => {
      const valueString = getFilterType(name).showFilterValue(value)
      setQueryString(router, name, valueString)
    },
    removeFilter: (name) => {
      setQueryString(router, name, null)
    },
  }
}
