import { sql, SqlQuery } from './index'

const TEST_SONG = {
  name: 'Take On Me',
  artist: 'A-ha',
  rating: 3,
}

const dedent = (s: string) => s.replace(/\n\s{2}/g, '\n')

describe('sql', () => {
  it('allows raw strings', () => {
    expect(sql`SELECT * FROM song`).toMatchObject({
      text: 'SELECT * FROM song',
      values: [],
    })
  })

  it('escapes parameters', () => {
    const query = sql`
      SELECT * FROM song
      WHERE song.artist = ${TEST_SONG.artist}
      AND song.rating = ${TEST_SONG.rating}
      ORDER BY song.name
    `

    expect(query).toMatchObject({
      text: dedent(`
        SELECT * FROM song
        WHERE song.artist = $1
        AND song.rating = $2
        ORDER BY song.name
      `),
      values: [TEST_SONG.artist, TEST_SONG.rating],
    })
  })

  it('composes', () => {
    const suffix = sql`song.name = ${TEST_SONG.name}`
    const query = sql`
      SELECT * FROM song
      WHERE song.artist = ${TEST_SONG.artist}
      AND ${suffix}
    `

    expect(query).toMatchObject({
      text: dedent(`
        SELECT * FROM song
        WHERE song.artist = $1
        AND song.name = $2
      `),
      values: [TEST_SONG.artist, TEST_SONG.name],
    })
  })

  describe('.param()', () => {
    it('is equivalent to using `sql` with an interpolated value', () => {
      const withParam = sql`
        SELECT * FROM song WHERE song.name = ${sql.param(TEST_SONG.name)}
      `
      const withoutParam = sql`
        SELECT * FROM song WHERE song.name = ${TEST_SONG.name}
      `
      expect(JSON.stringify(withParam)).toBe(JSON.stringify(withoutParam))
    })
  })

  describe('.raw()', () => {
    it('is equivalent to using `sql` for a static string', () => {
      const withRaw = sql.raw('SELECT * FROM song')
      const withSql = sql`SELECT * FROM song`

      expect(JSON.stringify(withRaw)).toBe(JSON.stringify(withSql))
    })

    it('interpolates without escaping', () => {
      const query = sql`
        INSERT INTO song (name, create_time)
        VALUES (${TEST_SONG.name}, ${sql.raw('NOW()')})
      `

      expect(query).toMatchObject({
        text: dedent(`
          INSERT INTO song (name, create_time)
          VALUES ($1, NOW())
        `),
        values: [TEST_SONG.name],
      })
    })
  })

  describe('.quote()', () => {
    it('quotes identifiers', () => {
      const tableName = 'song'
      const query = sql`SELECT * FROM ${sql.quote(tableName)}`
      expect(query).toMatchObject({
        text: 'SELECT * FROM "song"',
        values: [],
      })
    })
  })

  describe('.join()', () => {
    it('concatenates queries', () => {
      const filters = [
        sql`song.name = ${TEST_SONG.name}`,
        sql`song.artist = ${TEST_SONG.artist}`,
      ]
      const query = sql`SELECT * FROM song WHERE ${sql.join(filters, ' AND ')}`

      expect(query).toMatchObject({
        text: 'SELECT * FROM song WHERE song.name = $1 AND song.artist = $2',
        values: [TEST_SONG.name, TEST_SONG.artist],
      })
    })
  })

  describe('.and()', () => {
    it('returns TRUE if no clauses provided', () => {
      const filters = [] as SqlQuery[]

      expect(sql`SELECT * FROM song WHERE ${sql.and(filters)}`).toMatchObject({
        text: 'SELECT * FROM song WHERE TRUE',
        values: [],
      })
    })

    it('joins clauses with AND', () => {
      const filters = [
        sql`song.name = ${TEST_SONG.name}`,
        sql`song.artist = ${TEST_SONG.artist}`,
      ]

      expect(sql`SELECT * FROM song WHERE ${sql.and(filters)}`).toMatchObject({
        text:
          'SELECT * FROM song WHERE (song.name = $1) AND (song.artist = $2)',
        values: [TEST_SONG.name, TEST_SONG.artist],
      })
    })

    it('wraps complex boolean expressions', () => {
      const filters = [
        sql`song.name = ${TEST_SONG.name} OR song.name = ''`,
        sql`song.artist = ${TEST_SONG.artist}`,
      ]

      expect(sql`SELECT * FROM song WHERE ${sql.and(filters)}`).toMatchObject({
        text:
          "SELECT * FROM song WHERE (song.name = $1 OR song.name = '') AND (song.artist = $2)",
        values: [TEST_SONG.name, TEST_SONG.artist],
      })
    })
  })

  describe('.or()', () => {
    it('returns FALSE if no clauses provided', () => {
      const filters = [] as SqlQuery[]

      expect(sql`SELECT * FROM song WHERE ${sql.or(filters)}`).toMatchObject({
        text: 'SELECT * FROM song WHERE FALSE',
        values: [],
      })
    })

    it('joins clauses with OR', () => {
      const filters = [
        sql`song.name = ${TEST_SONG.name}`,
        sql`song.artist = ${TEST_SONG.artist}`,
      ]

      expect(sql`SELECT * FROM song WHERE ${sql.or(filters)}`).toMatchObject({
        text: 'SELECT * FROM song WHERE (song.name = $1) OR (song.artist = $2)',
        values: [TEST_SONG.name, TEST_SONG.artist],
      })
    })

    it('wraps complex boolean expressions', () => {
      const filters = [
        sql`song.name = ${TEST_SONG.name} AND song.artist = ''`,
        sql`song.artist = ${TEST_SONG.artist}`,
      ]

      expect(sql`SELECT * FROM song WHERE ${sql.or(filters)}`).toMatchObject({
        text:
          "SELECT * FROM song WHERE (song.name = $1 AND song.artist = '') OR (song.artist = $2)",
        values: [TEST_SONG.name, TEST_SONG.artist],
      })
    })
  })
})
