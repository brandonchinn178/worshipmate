import { addSymmetricMatchers, AsymmetricMatcher } from './jest-internals'
import {
  checkSqlMatches,
  fromSqlQueryMatcher,
  isSqlLike,
  normalizeSqlQuery,
  SqlQueryLike,
  SqlQueryMatcher,
} from './utils'

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

addSymmetricMatchers({
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
})

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
