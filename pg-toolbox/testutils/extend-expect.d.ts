/* eslint-disable */

namespace jest {
  interface Expect {
    // expect.sqlMatching(...)
    sqlMatching(expected: string | SqlQueryMatcher): any
  }

  interface InverseAsymmetricMatchers {
    // expect.not.sqlMatching(...)
    sqlMatching(expected: string | SqlQueryMatcher): any
  }

  interface Matchers<R> {
    // expect(...).toMatchSql(...)
    toMatchSql(expected: string | SqlQueryMatcher): R
  }
}
