import * as _ from 'lodash'
import { NextRouter } from 'next/router'

import { setQueryString } from '~/router'

export type ActiveFilters = {
  recommendedKey?: string
  bpm?: number
  timeSignature?: [number, number]
}

export type FilterNames = keyof ActiveFilters
export type FilterValue<Name extends FilterNames> = NonNullable<
  ActiveFilters[Name]
>

export type FilterHandler = {
  addFilter: <Name extends FilterNames>(
    name: Name,
    value: FilterValue<Name>,
  ) => void

  removeFilter: <Name extends FilterNames>(name: Name) => void
}

/** Marshalling filters to/from querystring **/

export const loadActiveFilters = (router: NextRouter): ActiveFilters => {
  const { query } = router

  const filters = {} as ActiveFilters

  if (_.isString(query.recommendedKey)) {
    filters.recommendedKey = query.recommendedKey
  }

  if (_.isString(query.bpm)) {
    const bpm = _.parseInt(query.bpm)
    if (_.isFinite(bpm)) {
      filters.bpm = bpm
    }
  }

  if (_.isString(query.timeSignature)) {
    const parts = query.timeSignature.match(/^(\d+)\/(\d+)$/)
    if (parts) {
      const top = _.parseInt(parts[1])
      const bottom = _.parseInt(parts[2])
      filters.timeSignature = [top, bottom]
    }
  }

  return filters
}

export const mkFilterHandler = (router: NextRouter): FilterHandler => {
  return {
    addFilter: (name, value) => {
      let valueString

      switch (name) {
        case 'recommendedKey': {
          valueString = value
          break
        }
        case 'bpm': {
          valueString = value.toString()
          break
        }
        case 'timeSignature': {
          const [top, bottom] = value
          valueString = `${top}/${bottom}`
          break
        }
      }

      setQueryString(router, name, valueString)
    },
    removeFilter: (name) => {
      setQueryString(router, name, null)
    },
  }
}
