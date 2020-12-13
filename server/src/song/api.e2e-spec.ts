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
        {
          id: expect.any(Number),
          slug: 'great-are-you-lord',
          title: 'Great Are You Lord',
          recommended_key: 'G',
          timeSignature: {
            top: 6,
            bottom: 8,
          },
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
        filters: [{ name: 'RECOMMENDED_KEY', oneof: ['A'] }],
      })
      expect(songs).toMatchObject([{ title: 'Blessed Be Your Name' }])
    })

    it('can return songs with a time signature', async () => {
      const songs = await songApi.searchSongs({
        filters: [{ name: 'TIME_SIGNATURE', oneof: [[6, 8]] }],
      })
      expect(songs).toMatchObject([{ title: 'Great Are You Lord' }])
    })

    it('can return songs with a BPM', async () => {
      const songs = await songApi.searchSongs({
        filters: [{ name: 'BPM', oneof: [68] }],
      })
      expect(songs).toMatchObject([{ title: 'Build My Life' }])
    })

    it('can return songs matching a filter and query', async () => {
      const songs = await songApi.searchSongs({
        query: 'be',
        filters: [{ name: 'RECOMMENDED_KEY', oneof: ['E'] }],
      })
      expect(songs).toMatchObject([{ title: 'Ever Be' }])
    })
  })

  describe('getAvailableFilters', () => {
    const allSongs = [
      {
        slug: 'amazing-grace',
        title: 'Amazing Grace',
        recommended_key: 'A',
        time_signature_top: 3,
        time_signature_bottom: 4,
        bpm: 68,
      },
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
        slug: 'build-my-life-2',
        title: 'Build My Life 2',
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 68,
      },
    ]

    beforeEach(async () => {
      await db.insertAll('song', allSongs)
    })

    it('returns filters for all songs', async () => {
      const filters = await songApi.getAvailableFilters()
      expect(filters).toMatchObject({
        RECOMMENDED_KEY: expect.arrayContaining([
          { value: 'A', valueDisplay: 'A', count: 2 },
          { value: 'E', valueDisplay: 'E', count: 2 },
        ]),
        TIME_SIGNATURE: expect.arrayContaining([
          { value: [4, 4], valueDisplay: '4/4', count: 3 },
          { value: [3, 4], valueDisplay: '3/4', count: 1 },
        ]),
        BPM: expect.arrayContaining([
          { value: 140, valueDisplay: '140', count: 1 },
          { value: 68, valueDisplay: '68', count: 3 },
        ]),
      })
    })

    it('returns filters for queried songs', async () => {
      const filters = await songApi.getAvailableFilters({
        query: 'Grace',
      })
      expect(filters).toMatchObject({
        RECOMMENDED_KEY: [{ value: 'A', count: 1 }],
        TIME_SIGNATURE: [{ value: [3, 4], count: 1 }],
        BPM: [{ value: 68, count: 1 }],
      })
    })
  })
})
