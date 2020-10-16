import { setupTestDatabase } from '~test-utils/db'

import { SongAPI } from './api'

describe('SongAPI', () => {
  const db = setupTestDatabase()
  const songApi = new SongAPI(db)

  describe('searchSongs', () => {
    const allSongs = [
      {
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      },
      {
        slug: 'build-my-life',
        title: 'Build My Life',
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 68,
      },
      {
        slug: 'ever-be',
        title: 'Ever Be',
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 72,
      },
    ]

    beforeEach(async () => {
      await db.insertAll('song', allSongs)
    })

    it('can return all songs', async () => {
      const songs = await songApi.searchSongs()
      expect(songs).toMatchObject([
        {
          id: expect.any(Number),
          slug: 'blessed-be-your-name',
          title: 'Blessed Be Your Name',
          recommendedKey: 'A',
          timeSignature: {
            top: 4,
            bottom: 4,
          },
          bpm: 140,
        },
        {
          id: expect.any(Number),
          slug: 'build-my-life',
          title: 'Build My Life',
          recommendedKey: 'E',
          timeSignature: {
            top: 4,
            bottom: 4,
          },
          bpm: 68,
        },
        {
          id: expect.any(Number),
          slug: 'ever-be',
          title: 'Ever Be',
          recommendedKey: 'E',
          timeSignature: {
            top: 4,
            bottom: 4,
          },
          bpm: 72,
        },
      ])
    })

    it('can return songs matching a query', async () => {
      const songs = await songApi.searchSongs({ query: 'be' })
      expect(songs).toMatchObject([
        { title: 'Blessed Be Your Name' },
        { title: 'Ever Be' },
      ])
    })
  })
})
