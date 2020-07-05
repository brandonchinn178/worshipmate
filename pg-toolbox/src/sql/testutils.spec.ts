import { sql } from './index'
import { sqlMatches } from './testutils'

describe('sqlMatches', () => {
  it('ignores whitespace differences', () => {
    expect(sql`     SELECT   1  `).toEqual(sqlMatches('SELECT 1'))

    expect(sql`     SELECT   1  `).toEqual(
      sqlMatches({ text: 'SELECT 1', values: [] }),
    )
  })

  it('escapes regex special characters', () => {
    expect(sql`SELECT COUNT(*) FROM "foo"`).toEqual(
      sqlMatches('SELECT COUNT(*) FROM "foo"'),
    )
  })

  it('matches values', () => {
    const name = 'Take On Me'

    expect(sql`SELECT * FROM "song" WHERE "song"."name" = ${name}`).toEqual(
      sqlMatches({
        text: 'SELECT * FROM "song" WHERE "song"."name" = $1',
        values: [name],
      }),
    )

    expect(sql`SELECT * FROM "song" WHERE "song"."name" = ${name}`).toEqual(
      sqlMatches({
        text: 'SELECT * FROM "song" WHERE "song"."name" = $1',
        values: [expect.stringMatching(/\w+ Me/)],
      }),
    )
  })
})
