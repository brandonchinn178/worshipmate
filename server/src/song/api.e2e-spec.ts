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
      {
        slug: 'great-are-you-lord',
        title: 'Great Are You Lord',
        recommended_key: 'G',
        time_signature_top: 6,
        time_signature_bottom: 8,
        bpm: 52,
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
          timeSignature: [4, 4],
          bpm: 140,
        },
        {
          id: expect.any(Number),
          slug: 'build-my-life',
          title: 'Build My Life',
          recommendedKey: 'E',
          timeSignature: [4, 4],
          bpm: 68,
        },
        {
          id: expect.any(Number),
          slug: 'ever-be',
          title: 'Ever Be',
          recommendedKey: 'E',
          timeSignature: [4, 4],
          bpm: 72,
        },
        {
          id: expect.any(Number),
          slug: 'great-are-you-lord',
          title: 'Great Are You Lord',
          recommended_key: 'G',
          timeSignature: [6, 8],
          bpm: 52,
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

    it('can return songs with a recommended key', async () => {
      const songs = await songApi.searchSongs({
        filters: [{ name: 'RECOMMENDED_KEY', value: 'A' }],
      })
      expect(songs).toMatchObject([{ title: 'Blessed Be Your Name' }])
    })

    it('can return songs with a time signature', async () => {
      const songs = await songApi.searchSongs({
        filters: [{ name: 'TIME_SIGNATURE', value: [6, 8] }],
      })
      expect(songs).toMatchObject([{ title: 'Great Are You Lord' }])
    })

    it('can return songs with a BPM', async () => {
      const songs = await songApi.searchSongs({
        filters: [{ name: 'BPM', value: 68 }],
      })
      expect(songs).toMatchObject([{ title: 'Build My Life' }])
    })

    it('can return songs matching a filter and query', async () => {
      const songs = await songApi.searchSongs({
        query: 'be',
        filters: [{ name: 'RECOMMENDED_KEY', value: 'E' }],
      })
      expect(songs).toMatchObject([{ title: 'Ever Be' }])
    })
  })
})
