import * as yup from 'yup'

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

const positiveIntSchema = yup.number().positive().integer()
const pairSchema = yup.array().min(2).max(2)

const FILTER_VALUE_SCHEMA: Record<string, yup.Schema<unknown>> = {
  RECOMMENDED_KEY: yup.string().required(),
  BPM: positiveIntSchema.required(),
  TIME_SIGNATURE: pairSchema.of(positiveIntSchema.required()).required(),
  THEMES: yup.array().of(yup.string().required()).required().min(1),
}

/**
 * Parse an unchecked filter into a typechecked filter.
 *
 * Throws an error if the filter could not be parsed.
 */
export const validateSearchFilter = (filter: UnknownFilter): SearchFilter => {
  const { name } = filter

  const schema = FILTER_VALUE_SCHEMA[name]
  if (!schema) {
    throw new Error(`Unknown filter: ${name}`)
  }

  let value
  try {
    value = schema.strict(true).validateSync(filter.value)
  } catch (_) {
    throw new Error(`Invalid value for filter '${name}': ${filter.value}`)
  }

  return { name, value } as SearchFilter
}
