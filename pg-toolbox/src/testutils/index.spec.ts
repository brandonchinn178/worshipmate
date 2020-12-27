import './index'

import { sql } from '~/sql'

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
