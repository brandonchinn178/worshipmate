import * as fc from 'fast-check'

import { checkSqlMatches, normalizeSqlText } from './utils'

describe('checkSqlMatches', () => {
  const fcQueryValues = fc.array(fc.jsonObject())

  const fcDifferentTexts = fc
    .tuple(fc.string(), fc.string())
    .filter(([a, b]) => normalizeSqlText(a) !== normalizeSqlText(b))

  const fcDifferentValues = fc.tuple(fcQueryValues, fcQueryValues).filter(
    ([values1, values2]) =>
      !values1.reduce((acc, a, i) => {
        const b = values2[i]
        return acc && JSON.stringify(a) === JSON.stringify(b)
      }, true),
  )

  it('matches same objects', () => {
    fc.assert(
      fc.property(fc.string(), fcQueryValues, (text, values) => {
        const { pass } = checkSqlMatches({ text, values }, { text, values })
        expect(pass).toBe(true)
      }),
    )
  })

  it('fails for different texts', () => {
    fc.assert(
      fc.property(fcDifferentTexts, fcQueryValues, ([text1, text2], values) => {
        const { pass } = checkSqlMatches(
          { text: text1, values },
          { text: text2, values },
        )
        expect(pass).toBe(false)
      }),
    )
  })

  it('fails for different values', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fcDifferentValues,
        (text, [values1, values2]) => {
          const { pass } = checkSqlMatches(
            { text, values: values1 },
            { text, values: values2 },
          )
          expect(pass).toBe(false)
        },
      ),
    )
  })

  it('fails for different texts + values', () => {
    fc.assert(
      fc.property(
        fcDifferentTexts,
        fcDifferentValues,
        ([text1, text2], [values1, values2]) => {
          const { pass } = checkSqlMatches(
            { text: text1, values: values1 },
            { text: text2, values: values2 },
          )
          expect(pass).toBe(false)
        },
      ),
    )
  })

  const fcSpaces = fc.nat(10).map((x) => ' '.repeat(x))
  const fcQueryText = fc
    .tuple(fcSpaces, fcSpaces, fcSpaces)
    .map(([a, b, c]) => a + 'SELECT ' + b + '1' + c)

  it('ignores whitespace differences', () => {
    const fcQuery = fc.oneof(
      fcQueryText,
      fcQueryText.map((text) => ({ text, values: [] })),
    )

    fc.assert(
      fc.property(fcQueryText, fcQuery, (actualText, expected) => {
        const actual = { text: actualText, values: [] }

        const { pass } = checkSqlMatches(actual, expected)
        expect(pass).toBe(true)
      }),
    )
  })

  it('ignores whitespace differences with values', () => {
    fc.assert(
      fc.property(
        fcQueryText,
        fcQueryText,
        fcQueryValues,
        (actualText, expectedText, values) => {
          const actual = { text: actualText, values }
          const expected = { text: expectedText, values }

          const { pass } = checkSqlMatches(actual, expected)
          expect(pass).toBe(true)
        },
      ),
    )
  })
})
