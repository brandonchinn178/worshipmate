import * as yup from 'yup'

type UnknownFilter = {
  name: string
  value: unknown
}

/**
 * MUST correspond with documentation of FilterValue scalar.
 */
export type SearchFilter =
  | { name: 'RECOMMENDED_KEY'; value: string }
  | { name: 'BPM'; value: number }
  | { name: 'TIME_SIGNATURE'; value: [number, number] }
  | { name: 'THEMES'; value: string[] }

const positiveIntSchema = yup.number().positive().integer()
const pairSchema = yup.array().min(2).max(2)

const FILTER_VALUE_SCHEMA: Record<string, yup.Schema<unknown>> = {
  RECOMMENDED_KEY: yup.string().required(),
  BPM: positiveIntSchema.required(),
  TIME_SIGNATURE: pairSchema.of(positiveIntSchema.required()).required(),
  THEMES: yup.array().of(yup.string().required()).required(),
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
