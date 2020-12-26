import { AsymmetricMatcher } from 'expect/build/asymmetricMatchers'
import * as jestUtils from 'expect/build/jasmineUtils'
import { setMatchers } from 'expect/build/jestMatchersObject'
import { Expect } from 'expect/build/types'

type SqlQueryLike = {
  text: string
  values: unknown[]
}

type SqlQueryMatcher = string | SqlQueryLike

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-namespace */
  namespace jest {
    // expect.sqlMatching(...)
    interface Expect {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      sqlMatching(expected: string | SqlQueryMatcher): any
    }
    // expect.not.sqlMatching(...)
    interface InverseAsymmetricMatchers {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      sqlMatching(expected: string | SqlQueryMatcher): any
    }
    // expect(...).toMatchSql(...)
    interface Matchers<R> {
      toMatchSql(expected: string | SqlQueryMatcher): R
    }
  }
}

const isSqlLike = (query: unknown): query is SqlQueryLike =>
  jestUtils.isA('Object', query) &&
  jestUtils.isA('String', (query as SqlQueryLike).text) &&
  Array.isArray((query as SqlQueryLike).values)

const fromSqlQueryMatcher = (queryMatcher: SqlQueryMatcher): SqlQueryLike =>
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

const normalizeSqlQuery = ({ text, values }: SqlQueryLike) => ({
  // ignore whitespace differences
  text: normalizeSqlText(text),
  values,
})

setMatchers(
  {
    /**
     * A Jest matcher for checking if a SQL query matches the given query,
     * ignoring differences in whitespace.
     *
     * Usage:
     *
     *   const query = sql`
     *     SELECT *
     *     FROM "song"
     *   `
     *
     *   expect(query).toMatchSql('SELECT * FROM "song"')
     *   expect(query).toMatchSql({
     *     text: 'SELECT * FROM "song"',
     *     values: [],
     *   })
     *
     *   const name = 'Take On Me'
     *   const queryWithValues = sql`
     *     INSERT INTO "song" ("name")
     *     VALUES (${name})
     *   `
     *
     *   expect(queryWithValues).toMatchSql({
     *     text: 'INSERT INTO "song" ("name") VALUES ($1)',
     *     values: [name],
     *   })
     */
    toMatchSql(
      receivedQuery: SqlQueryLike,
      expectedQueryMatcher: SqlQueryMatcher,
    ) {
      const { pass, received, expected } = checkSqlMatches(
        receivedQuery,
        expectedQueryMatcher,
      )

      const message = () => {
        const notPrefix = pass ? 'not ' : ''
        return [
          this.utils.matcherHint('toMatchSql', undefined, undefined, {
            isNot: this.isNot,
            promise: this.promise,
          }),
          '',
          'Expected: ' + notPrefix + this.utils.printExpected(expected),
          'Received: ' + this.utils.printReceived(received),
        ].join('\n')
      }

      return { actual: receivedQuery, message, pass }
    },
  },
  true,
  (expect as unknown) as Expect,
)

/**
 * A Jest asymmetric matcher for checking if a SQL query matches the given
 * query, ignoring differences in whitespace.
 *
 * Usage:
 *
 *   const query = sql`
 *     SELECT *
 *     FROM "song"
 *   `
 *
 *   expect(query).toEqual(
 *     expect.sqlMatching('SELECT * FROM "song"')
 *   )
 *   expect(query).toEqual(
 *     expect.sqlMatching({
 *       text: 'SELECT * FROM "song"',
 *       values: [],
 *     })
 *   )
 *
 *   const name = 'Take On Me'
 *   const queryWithValues = sql`
 *     INSERT INTO "song" ("name")
 *     VALUES (${name})
 *   `
 *
 *   expect(queryWithValues).toEqual(
 *     expect.sqlMatching({
 *       text: 'INSERT INTO "song" ("name") VALUES ($1)',
 *       values: [name],
 *     })
 *   )
 */
class SqlMatching extends AsymmetricMatcher<SqlQueryMatcher> {
  constructor(sample: SqlQueryMatcher, inverse = false) {
    super(sample)

    this.inverse = inverse
  }

  asymmetricMatch(other: SqlQueryLike) {
    const { pass } = isSqlLike(other)
      ? checkSqlMatches(other, this.sample)
      : { pass: false }

    return this.inverse ? !pass : pass
  }

  toString() {
    return `Sql${this.inverse ? 'Not' : ''}Matching`
  }

  getExpectedType() {
    return 'object'
  }

  toAsymmetricMatcher() {
    const sample = normalizeSqlQuery(fromSqlQueryMatcher(this.sample))
    return `SqlMatching<${JSON.stringify(sample)}>`
  }
}

expect.sqlMatching = (expected: SqlQueryMatcher) =>
  new SqlMatching(expected, false)
expect.not.sqlMatching = (expected: SqlQueryMatcher) =>
  new SqlMatching(expected, true)
