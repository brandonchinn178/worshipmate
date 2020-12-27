import * as fc from 'fast-check'

import { sql } from '~/sql'

import { checkSqlMatches, normalizeSqlText } from './index'

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

describe('Match against query text', () => {
  const query = sql`SELECT * FROM "song"`

  test('expect().toMatchSql(string)', () => {
    expect(query).toMatchSql('SELECT * FROM "song"')
  })

  test('expect().not.toMatchSql(string)', () => {
    expect(query).not.toMatchSql('SELECT * FROM "person"')
  })

  test('expect.sqlMatching(string)', () => {
    expect([query]).toEqual([expect.sqlMatching('SELECT * FROM "song"')])
  })

  test('expect.not.sqlMatching(string)', () => {
    expect([query]).toEqual([expect.not.sqlMatching('SELECT * FROM "person"')])
  })
})

describe('Match against query text and values', () => {
  const name = 'Take On Me'
  const query = sql`
    SELECT * FROM "song"
    WHERE "song"."name" = ${name}
  `

  test('expect().toMatchSql({ text, values })', () => {
    expect(query).toMatchSql({
      text: 'SELECT * FROM "song" WHERE "song"."name" = $1',
      values: [name],
    })
  })

  test('expect().not.toMatchSql({ text, values })', () => {
    expect(query).not.toMatchSql({
      text: 'SELECT * FROM "person" WHERE "person"."name" = $1',
      values: [name],
    })
  })

  test('expect.sqlMatching({ text, values })', () => {
    expect([query]).toEqual([
      expect.sqlMatching({
        text: 'SELECT * FROM "song" WHERE "song"."name" = $1',
        values: [name],
      }),
    ])
  })

  test('expect.not.sqlMatching({ text, values })', () => {
    expect([query]).toEqual([
      expect.not.sqlMatching({
        text: 'SELECT * FROM "person" WHERE "person"."name" = $1',
        values: [name],
      }),
    ])
  })
})

describe('Failed match against query text', () => {
  const query = sql`SELECT * FROM "song"`

  test('expect().toMatchSql(string)', () => {
    expect(() =>
      expect(query).toMatchSql('SELECT * FROM "person"'),
    ).toThrowErrorMatchingSnapshot()
  })

  test('expect().not.toMatchSql(string)', () => {
    expect(() =>
      expect(query).not.toMatchSql('SELECT * FROM "song"'),
    ).toThrowErrorMatchingSnapshot()
  })

  test('expect.sqlMatching(string)', () => {
    expect(() =>
      expect([query]).toEqual([expect.sqlMatching('SELECT * FROM "person"')]),
    ).toThrowErrorMatchingSnapshot()
  })

  test('expect.not.sqlMatching(string)', () => {
    expect(() =>
      expect([query]).toEqual([expect.not.sqlMatching('SELECT * FROM "song"')]),
    ).toThrowErrorMatchingSnapshot()
  })
})

describe('Failed match against query text and values', () => {
  const name = 'Take On Me'
  const query = sql`
    SELECT * FROM "song"
    WHERE "song"."name" = ${name}
  `

  test('expect().toMatchSql({ text, values })', () => {
    expect(() =>
      expect(query).toMatchSql({
        text: 'SELECT * FROM "person" WHERE "person"."name" = $1',
        values: [name],
      }),
    ).toThrowErrorMatchingSnapshot()
  })

  test('expect().not.toMatchSql({ text, values })', () => {
    expect(() =>
      expect(query).not.toMatchSql({
        text: 'SELECT * FROM "song" WHERE "song"."name" = $1',
        values: [name],
      }),
    ).toThrowErrorMatchingSnapshot()
  })

  test('expect.sqlMatching({ text, values })', () => {
    expect(() =>
      expect([query]).toEqual([
        expect.sqlMatching({
          text: 'SELECT * FROM "person" WHERE "person"."name" = $1',
          values: [name],
        }),
      ]),
    ).toThrowErrorMatchingSnapshot()
  })

  test('expect.not.sqlMatching({ text, values })', () => {
    expect(() =>
      expect([query]).toEqual([
        expect.not.sqlMatching({
          text: 'SELECT * FROM "song" WHERE "song"."name" = $1',
          values: [name],
        }),
      ]),
    ).toThrowErrorMatchingSnapshot()
  })
})
