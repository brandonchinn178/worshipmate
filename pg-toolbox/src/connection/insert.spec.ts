import { sqlMatches } from '~/sql/testutils'

import { mkInsertQueries } from './insert'

describe('mkInsertQueries', () => {
  it('works for multiple records', async () => {
    const songs = [
      { name: 'Take On Me', artist: 'A-ha', rating: 5 },
      { name: 'Separate Ways', artist: 'Journey' },
    ]

    expect(mkInsertQueries('song', songs)).toEqual([
      sqlMatches({
        text: `
          INSERT INTO "song" ("name","artist","rating")
          VALUES ($1,$2,$3)
        `,
        values: ['Take On Me', 'A-ha', 5],
      }),
      sqlMatches({
        text: `
          INSERT INTO "song" ("name","artist")
          VALUES ($1,$2)
        `,
        values: ['Separate Ways', 'Journey'],
      }),
    ])
  })
})
