import * as _ from 'lodash'
import { CamelCase } from 'type-fest'

type CamelCasedProps<T> = {
  [K in keyof T as CamelCase<K>]: T[K]
}

export const camelCaseRow = <T extends Record<string, unknown>>(
  row: T,
): CamelCasedProps<T> =>
  _.mapKeys(row, (v, k) => _.camelCase(k)) as CamelCasedProps<T>
