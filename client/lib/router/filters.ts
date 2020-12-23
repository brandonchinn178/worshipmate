import * as _ from 'lodash'
import { NextRouter } from 'next/router'

import { modifyQueryString, QueryStringValue } from './querystring'

export type ActiveFilters = {
  [key: string]: string
}

const QUERYSTRING_KEY = 'filters'
const FILTER_GROUP_DELIMITER = ';'
const FILTER_DELIMITER = '='

export const decodeFilters = (rawFilters: QueryStringValue): ActiveFilters => {
  if (!rawFilters) {
    return {}
  }

  const filtersJSON = Array.isArray(rawFilters) ? rawFilters[0] : rawFilters

  return _.fromPairs(
    filtersJSON.split(FILTER_GROUP_DELIMITER).map((s) => {
      const [k, v] = s.split(FILTER_DELIMITER)
      return [k, v]
    }),
  )
}

export const encodeFilters = (filters: ActiveFilters): string =>
  _.toPairs(filters)
    .map(([k, v]) => {
      // just in case
      if (
        _.includes(k + v, FILTER_GROUP_DELIMITER) ||
        _.includes(k + v, FILTER_DELIMITER)
      ) {
        throw new Error(`Filter has invalid characters: ${k}, ${v}`)
      }

      return k + FILTER_DELIMITER + v
    })
    .join(FILTER_GROUP_DELIMITER)

export const loadFilters = (query: NextRouter['query']): ActiveFilters =>
  decodeFilters(query[QUERYSTRING_KEY])

const modifyFilters = (
  router: NextRouter,
  callback: (filters: ActiveFilters) => ActiveFilters,
) =>
  modifyQueryString(router, QUERYSTRING_KEY, (curr) =>
    encodeFilters(callback(decodeFilters(curr))),
  )

export const addFilter = (router: NextRouter, key: string, value: string) =>
  modifyFilters(router, (filters) => ({ ...filters, [key]: value }))

export const removeFilter = (router: NextRouter, key: string) =>
  modifyFilters(router, (filters) => _.omit(filters, key))
