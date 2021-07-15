import * as fc from 'fast-check'
import * as _ from 'lodash'
import { sql } from 'pg-fusion'

import { setupTestDatabase } from '~test-utils/db'

import { SongAPI } from './api'
import { ArtistRecord, SongRecord } from './schema'

describe('SongAPI', () => {
  const db = setupTestDatabase()
  const songApi = new SongAPI(db)

  describe('searchSongs', () => {
    const allArtists = {
      allSonsAndDaughters: {
        id: 1,
        slug: 'all-sons-and-daughters',
        name: 'All Sons and Daughters',
      },
      bethel: {
        id: 2,
        slug: 'bethel-music',
        name: 'Bethel Music',
      },
      housefires: {
        id: 3,
        slug: 'housefires',
        name: 'Housefires',
      },
      mattRedman: {
        id: 4,
        slug: 'matt-redman',
        name: 'Matt Redman',
      },
    }
    const allSongs = [
      {
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        artist: allArtists.mattRedman.id,
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      },
      {
        slug: 'build-my-life',
        title: 'Build My Life',
        artist: allArtists.housefires.id,
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 68,
      },
      {
        slug: 'ever-be',
        title: 'Ever Be',
        artist: allArtists.bethel.id,
        recommended_key: 'E',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 72,
      },
      {
        slug: 'great-are-you-lord',
        title: 'Great Are You Lord',
        artist: allArtists.allSonsAndDaughters.id,
        recommended_key: 'G',
        time_signature_top: 6,
        time_signature_bottom: 8,
        bpm: 52,
      },
    ]

    beforeEach(async () => {
      await db.insertAll('artist', _.values(allArtists))
      await db.insertAll('song', allSongs)
    })

    it('can return all songs', async () => {
      const songs = await songApi.searchSongs()
      expect(songs).toStrictEqual([
        {
          id: expect.any(Number),
          slug: 'blessed-be-your-name',
          title: 'Blessed Be Your Name',
          artistId: allArtists.mattRedman.id,
          recommendedKey: 'A',
          timeSignature: [4, 4],
          bpm: 140,
        },
        {
          id: expect.any(Number),
          slug: 'build-my-life',
          title: 'Build My Life',
          artistId: allArtists.housefires.id,
          recommendedKey: 'E',
          timeSignature: [4, 4],
          bpm: 68,
        },
        {
          id: expect.any(Number),
          slug: 'ever-be',
          title: 'Ever Be',
          artistId: allArtists.bethel.id,
          recommendedKey: 'E',
          timeSignature: [4, 4],
          bpm: 72,
        },
        {
          id: expect.any(Number),
          slug: 'great-are-you-lord',
          title: 'Great Are You Lord',
          artistId: allArtists.allSonsAndDaughters.id,
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
            await db.execute(sql`TRUNCATE TABLE "song"`)
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
    const createSong = async () => {
      const artist = await db.insert<ArtistRecord>('artist', {
        slug: 'matt-redman',
        name: 'Matt Redman',
      })
      return db.insert<SongRecord>('song', {
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        artist: artist.id,
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      })
    }

    it('loads a song', async () => {
      const { id, artist } = await createSong()
      const song = await songApi.getSong(id)
      expect(song).toEqual({
        id,
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        artistId: artist,
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

      expect(
        await songApi.createSong({
          ...song,
          artist: 'Matt Redman',
        }),
      ).toMatchObject({
        id: expect.any(Number),
        slug: 'blessed-be-your-name',
        artistId: expect.any(Number),
        ...song,
      })
    })

    it('can create a song with unique slug', async () => {
      const song = {
        title: 'Blessed Be Your Name',
        artist: 'Matt Redman',
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
        artist: 'Matt Redman',
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
        artist: 'Matt Redman',
        recommendedKey: 'A',
        timeSignature: [4, 4] as [number, number],
        bpm: 140,
      }

      await songApi.createSong(song)
      await expect(songApi.createSong(song)).rejects.toThrow()
    })

    it('reuses existing artist', async () => {
      const song = {
        title: 'foo',
        artist: 'my artist',
        recommendedKey: 'A',
        timeSignature: [4, 4] as [number, number],
        bpm: 140,
      }

      const song1 = await songApi.createSong(song)
      const song2 = await songApi.createSong(song)
      expect(song1.artistId).toBe(song2.artistId)
    })
  })

  describe('updateSong', () => {
    const createSong = async () => {
      const artist = await db.insert<ArtistRecord>('artist', {
        slug: 'matt-redman',
        name: 'Matt Redman',
      })
      return db.insert<SongRecord>('song', {
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        artist: artist.id,
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      })
    }

    it('no-ops if no updates passed', async () => {
      const song = await createSong()
      await expect(songApi.updateSong(song.id, {})).resolves.toBeUndefined()
    })

    it('no-ops if song does not exist', async () => {
      await expect(
        songApi.updateSong(100, { title: 'foo' }),
      ).resolves.toBeUndefined()
    })

    it('can update a song', async () => {
      const song = await createSong()

      const updates = {
        slug: 'new-song',
        title: 'New song!',
        recommendedKey: 'C',
        timeSignature: [6, 8] as [number, number],
        bpm: 200,
      }
      await songApi.updateSong(song.id, updates)
      await expect(songApi.getSong(song.id)).resolves.toMatchObject(updates)
    })

    it('can partially update a song', async () => {
      const song = await createSong()

      const updates = {
        recommendedKey: 'C',
        bpm: 200,
      }

      await songApi.updateSong(song.id, updates)

      await expect(songApi.getSong(song.id)).resolves.toMatchObject({
        ...updates,
        // some attributes that shouldn't change
        slug: song.slug,
        title: song.title,
      })
    })

    it('throws helpful error when setting duplicate slug', async () => {
      const artist = await db.insert<ArtistRecord>('artist', {
        slug: 'matt-redman',
        name: 'Matt Redman',
      })
      const song = {
        title: 'Blessed Be Your Name',
        artist: artist.id,
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      }
      const song1 = await db.insert<SongRecord>('song', {
        ...song,
        slug: 'blessed-be-your-name',
      })
      const song2 = await db.insert<SongRecord>('song', {
        ...song,
        slug: 'blessed-be-your-name-2',
      })

      await expect(
        songApi.updateSong(song2.id, { slug: song1.slug }),
      ).rejects.toThrow('Could not set slug: slug already in use')
    })
  })

  describe('getOrCreateArtist', () => {
    it('returns existing artist', async () => {
      const artist = await db.insert<ArtistRecord>('artist', {
        slug: 'matt-redman',
        name: 'Matt Redman',
      })
      await expect(songApi.getOrCreateArtist(artist.name)).resolves.toEqual(
        artist,
      )
    })

    it('creates new artist', async () => {
      await expect(
        songApi.getOrCreateArtist('Matt Redman'),
      ).resolves.toMatchObject({ name: 'Matt Redman' })
    })
  })

  describe('getArtistForSong', () => {
    it('gets the artist for the given song', async () => {
      const artist = await db.insert<ArtistRecord>('artist', {
        slug: 'matt-redman',
        name: 'Matt Redman',
      })
      const { id: songId } = await db.insert<SongRecord>('song', {
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        artist: artist.id,
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      })

      const song = await songApi.getSong(songId)
      if (!song) {
        throw new Error('unexpectedly could not find song')
      }
      await expect(songApi.getArtistForSong(song)).resolves.toEqual(artist)
    })
  })

  describe('getArtistByName', () => {
    it('returns artist if exists', async () => {
      const artist = await db.insert<ArtistRecord>('artist', {
        slug: 'matt-redman',
        name: 'Matt Redman',
      })
      await expect(songApi.getArtistByName(artist.name)).resolves.toEqual(
        artist,
      )
    })

    it('returns null if artist does not exist', async () => {
      await expect(songApi.getArtistByName('Matt Redman')).resolves.toBeNull()
    })
  })
})
