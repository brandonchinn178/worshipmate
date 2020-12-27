import * as jestUtils from 'expect/build/jasmineUtils'

export type SqlQueryLike = {
  text: string
  values: unknown[]
}

export type SqlQueryMatcher = string | SqlQueryLike

export const isSqlLike = (query: unknown): query is SqlQueryLike =>
  typeof query === 'object' &&
  typeof (query as Record<string, unknown>).text === 'string' &&
  Array.isArray((query as Record<string, unknown>).values)

export const fromSqlQueryMatcher = (
  queryMatcher: SqlQueryMatcher,
): SqlQueryLike =>
  typeof queryMatcher === 'string'
    ? { text: queryMatcher, values: [] }
    : queryMatcher

export const checkSqlMatches = (
  receivedQuery: SqlQueryLike,
  expectedQueryMatcher: SqlQueryMatcher,
) => {
  const expectedQuery = fromSqlQueryMatcher(expectedQueryMatcher)

  // in case someone isn't using Typescript and tries to assert with values not
  // matching SqlQueryLike
  if (!isSqlLike(receivedQuery)) {
    throw new Error('Received does not match { text: String, values: Array }')
  }
  if (!isSqlLike(expectedQuery)) {
    throw new Error('Expected does not match { text: String, values: Array }')
  }

  const received = normalizeSqlQuery(receivedQuery)
  const expected = normalizeSqlQuery(expectedQuery)

  const textPasses = jestUtils.equals(received.text, expected.text)
  const valuesPasses = jestUtils.equals(received.values, expected.values)

  return {
    pass: textPasses && valuesPasses,
    received,
    expected,
  }
}

export const normalizeSqlText = (text: string) =>
  text.trim().replace(/\s+/g, ' ')

export const normalizeSqlQuery = ({ text, values }: SqlQueryLike) => ({
  // ignore whitespace differences
  text: normalizeSqlText(text),
  values,
})
