import { equals } from 'expect/build/jasmineUtils'
import { setMatchers } from 'expect/build/jestMatchersObject'
import { Expect, MatchersObject } from 'expect/build/types'

export { AsymmetricMatcher } from 'expect/build/asymmetricMatchers'

export const isEqual = equals

/**
 * Register matchers to be used as expect(...).toMatchFoo(...)
 */
export const addSymmetricMatchers = (matchers: MatchersObject) =>
  setMatchers(matchers, true, (expect as unknown) as Expect)
