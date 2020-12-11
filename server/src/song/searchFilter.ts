import * as _ from 'lodash'

type UnknownFilter = {
  name: string
  value: unknown
}

/**
 * MUST correspond with documentation of FilterValue scalar.
 */
export type SearchFilterTypes = {
  RECOMMENDED_KEY: string
  BPM: number
  TIME_SIGNATURE: [number, number]
  THEMES: string[]
}

export type SearchFilterNames = keyof SearchFilterTypes

// https://stackoverflow.com/a/51691257
type SearchFilterHelper<Name> = Name extends SearchFilterNames
  ? {
      name: Name
      value: SearchFilterTypes[Name]
    }
  : never

export type SearchFilter = SearchFilterHelper<SearchFilterNames>

/**
 * Parse an unchecked filter into a typechecked filter.
 *
 * Throws an error if the filter could not be parsed.
 */
export const validateSearchFilter = (filter: UnknownFilter): SearchFilter => {
  const { name } = filter

  const validator = FILTER_VALUE_VALIDATORS[name]
  if (!validator) {
    throw new Error(`Unknown filter: ${name}`)
  }

  const value = _.isString(filter.value)
    ? validator.fromString(filter.value)
    : filter.value

  if (!validator.isValid(value)) {
    throw new Error(`Invalid value for filter '${name}': '${filter.value}'`)
  }

  return { name, value } as SearchFilter
}

/** Validators **/

type Validator = {
  fromString: (s: string) => unknown
  isValid: (v: unknown) => boolean
}

const isNonEmptyString = (v: unknown) => _.isString(v) && v.length > 0
const isPositiveInt = (v: unknown): boolean =>
  _.isNumber(v) && _.isInteger(v) && v > 0

const FILTER_VALUE_VALIDATORS: Record<string, Validator> = {
  RECOMMENDED_KEY: {
    fromString: (s) => s,
    isValid: (v) => isNonEmptyString(v),
  },
  BPM: {
    fromString: (s) => _.parseInt(s),
    isValid: (v) => isPositiveInt(v),
  },
  TIME_SIGNATURE: {
    fromString: (s) => {
      const parts = s.match(/^(\d+)\/(\d+)$/)
      if (parts) {
        return _.map([parts[1], parts[2]], _.parseInt)
      }
      return null
    },
    isValid: (v) => _.isArray(v) && v.length === 2 && _.every(v, isPositiveInt),
  },
  THEMES: {
    fromString: (s) => s.split(',').map(_.trim),
    isValid: (v) =>
      _.isArray(v) && v.length > 0 && _.every(v, isNonEmptyString),
  },
}
