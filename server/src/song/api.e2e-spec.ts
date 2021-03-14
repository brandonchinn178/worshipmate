import * as fc from 'fast-check'
import * as _ from 'lodash'

import { setupTestDatabase } from '~test-utils/db'

import { SongAPI } from './api'
import { SongRecord } from './schema'

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
      expect(songs).toStrictEqual([
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
          recommendedKey: 'G',
          timeSignature: [6, 8],
          bpm: 52,
        },
      ])
    })

    it('returns songs in alphabetical order', async () => {
      const songTitlesInOrder = _(allSongs)
        .sortBy('title')
        .map(({ title }) => ({ title }))
        .value()

      await fc.assert(
        fc.asyncProperty(
          fc.shuffledSubarray(allSongs, { minLength: allSongs.length }),
          async (songs) => {
            await db.clear()
            await db.insertAll('song', songs)
            const result = await songApi.searchSongs()
            expect(result).toMatchObject(songTitlesInOrder)
          },
        ),
        { numRuns: 5 },
      )
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
        filters: { recommendedKey: 'A' },
      })
      expect(songs).toMatchObject([{ title: 'Blessed Be Your Name' }])
    })

    it('can return songs with a time signature', async () => {
      const songs = await songApi.searchSongs({
        filters: { timeSignature: [6, 8] },
      })
      expect(songs).toMatchObject([{ title: 'Great Are You Lord' }])
    })

    it('can return songs with a BPM', async () => {
      const songs = await songApi.searchSongs({
        filters: { bpm: 68 },
      })
      expect(songs).toMatchObject([{ title: 'Build My Life' }])
    })

    it('can return songs matching a filter and query', async () => {
      const songs = await songApi.searchSongs({
        query: 'be',
        filters: { recommendedKey: 'E' },
      })
      expect(songs).toMatchObject([{ title: 'Ever Be' }])
    })
  })

  describe('getSong', () => {
    let id: number

    beforeEach(async () => {
      const song = await db.insert<SongRecord>('song', {
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      })

      id = song.id
    })

    it('loads a song', async () => {
      const song = await songApi.getSong(id)
      expect(song).toEqual({
        id,
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        recommendedKey: 'A',
        timeSignature: [4, 4],
        bpm: 140,
      })
    })

    it('returns null if song does not exist', async () => {
      const song = await songApi.getSong(100)
      expect(song).toBeNull()
    })
  })

  describe('createSong', () => {
    it('can create a song', async () => {
      const song = {
        title: 'Blessed Be Your Name',
        recommendedKey: 'A',
        timeSignature: [4, 4] as [number, number],
        bpm: 140,
      }

      expect(await songApi.createSong(song)).toMatchObject({
        id: expect.any(Number),
        slug: 'blessed-be-your-name',
        ...song,
      })
    })

    it('can create a song with unique slug', async () => {
      const song = {
        title: 'Blessed Be Your Name',
        recommendedKey: 'A',
        timeSignature: [4, 4] as [number, number],
        bpm: 140,
      }
      expect([
        await songApi.createSong(song),
        await songApi.createSong(song),
        await songApi.createSong(song),
      ]).toMatchObject([
        { slug: 'blessed-be-your-name' },
        { slug: 'blessed-be-your-name-1' },
        { slug: 'blessed-be-your-name-2' },
      ])
    })

    it('can create a song with an explicit slug', async () => {
      const song = {
        slug: 'my-custom-slug',
        title: 'Blessed Be Your Name',
        recommendedKey: 'A',
        timeSignature: [4, 4] as [number, number],
        bpm: 140,
      }

      expect(await songApi.createSong(song)).toMatchObject({
        slug: 'my-custom-slug',
      })
    })

    it('fails when creating song if the explicitly specified slug is taken', async () => {
      const song = {
        slug: 'my-custom-slug',
        title: 'Blessed Be Your Name',
        recommendedKey: 'A',
        timeSignature: [4, 4] as [number, number],
        bpm: 140,
      }

      await songApi.createSong(song)
      await expect(songApi.createSong(song)).rejects.toThrow()
    })
  })
})
