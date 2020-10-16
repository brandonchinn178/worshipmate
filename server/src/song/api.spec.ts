import { Database } from 'pg-toolbox'
import { sqlMatches } from 'pg-toolbox/dist/testutils'

import { SongAPI } from './api'

beforeEach(jest.resetAllMocks)

const db = {
  query: jest.fn(),
}

beforeEach(() => {
  db.query.mockResolvedValue([])
})

describe('SongAPI', () => {
  const songApi = new SongAPI((db as unknown) as Database)

  describe('searchSongs', () => {
    it('can return all songs', async () => {
      await songApi.searchSongs()
      expect(db.query).toHaveBeenCalledWith(
        sqlMatches('SELECT * FROM "song" WHERE TRUE'),
      )
    })

    it('can return songs matching a query', async () => {
      await songApi.searchSongs({ query: 'foo' })
      expect(db.query).toHaveBeenCalledWith(
        sqlMatches({
          text: 'SELECT * FROM "song" WHERE "song"."title" ILIKE $1',
          values: ['%foo%'],
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
        timeSignature: {
          top: 4,
          bottom: 4,
        },
        bpm: 140,
      }

      db.query.mockResolvedValue([songRecord])
      await expect(songApi.searchSongs()).resolves.toMatchObject([songModel])
    })
  })
})
