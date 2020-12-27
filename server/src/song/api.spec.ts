import { Database } from 'pg-toolbox'

import { SongAPI } from './api'

beforeEach(jest.resetAllMocks)

const db = {
  query: jest.fn(),
}

beforeEach(() => {
  db.query.mockReset().mockResolvedValue([])
})

describe('SongAPI', () => {
  const songApi = new SongAPI((db as unknown) as Database)

  describe('searchSongs', () => {
    it('can return all songs', async () => {
      await songApi.searchSongs()
      expect(db.query).toHaveBeenCalledWith(
        expect.sqlMatching(`
          SELECT * FROM "song"
          WHERE TRUE
          ORDER BY "song"."title"
        `),
      )
    })

    it('can return songs matching a query', async () => {
      await songApi.searchSongs({ query: 'foo' })
      expect(db.query).toHaveBeenCalledWith(
        expect.sqlMatching({
          text: `
            SELECT * FROM "song"
            WHERE "song"."title" ILIKE $1
            ORDER BY "song"."title"
          `,
          values: ['%foo%'],
        }),
      )
    })

    it('can return songs matching a filter', async () => {
      await songApi.searchSongs({
        filters: { recommendedKey: 'A' },
      })
      expect(db.query).toHaveBeenCalledWith(
        expect.sqlMatching({
          text: `
            SELECT * FROM "song"
            WHERE "song"."recommended_key" = $1
            ORDER BY "song"."title"
          `,
          values: ['A'],
        }),
      )
    })

    it('converts song record to song model', async () => {
      const songRecord = {
        id: 1,
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      }

      const songModel = {
        id: 1,
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        recommendedKey: 'A',
        timeSignature: [4, 4],
        bpm: 140,
      }

      db.query.mockResolvedValue([songRecord])
      await expect(songApi.searchSongs()).resolves.toMatchObject([songModel])
    })
  })
})
