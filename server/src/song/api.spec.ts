import * as fc from 'fast-check'
import * as _ from 'lodash'
import { Database } from 'pg-fusion'

import { mkMock } from '~test-utils/mock'

import { SongAPI } from './api'
import { Artist, TimeSignature } from './models'

const db = {
  query: jest.fn(),
  queryOne: jest.fn(),
  insert: jest.fn(),
  execute: jest.fn(),
}

beforeEach(() => {
  db.query.mockResolvedValue([])
  db.insert.mockResolvedValue({})
})

describe('SongAPI', () => {
  const songApi = new SongAPI((db as unknown) as Database)

  describe('getSong', () => {
    it('returns null if song does not exist', async () => {
      db.queryOne.mockResolvedValue(null)
      await expect(songApi.getSong(1)).resolves.toBeNull()
    })
  })

  describe('createSong', () => {
    it('creates a song with an explicit slug', async () => {
      const fcSong = fc.record({
        slug: fc.string({ minLength: 1 }),
        title: fc.string(),
        artist: fc.string(),
        recommendedKey: fc.string(),
        timeSignature: fc.tuple(fc.nat(), fc.nat()),
        bpm: fc.nat(),
      })

      await fc.assert(
        fc.asyncProperty(fcSong, async (song) => {
          await songApi.createSong(song)
          expect(db.insert).toHaveBeenCalledWith(
            'song',
            expect.objectContaining({
              slug: song.slug,
            }),
          )
        }),
      )
    })

    it('builds a slug from the title', async () => {
      await songApi.createSong({
        title: 'Song title here',
        artist: 'Human',
        recommendedKey: 'A',
        timeSignature: [4, 4],
        bpm: 140,
      })

      expect(db.insert).toHaveBeenCalledWith(
        'song',
        expect.objectContaining({
          slug: 'song-title-here',
        }),
      )
    })

    it('generates unique slug', async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer({ min: 1, max: 100 }), async (id) => {
          const existingSlugs = _.range(id).map((x) =>
            x === 0 ? 'song-title-here' : `song-title-here-${x}`,
          )

          db.query.mockResolvedValue(existingSlugs.map((slug) => ({ slug })))

          await songApi.createSong({
            title: 'Song title here',
            artist: 'Human',
            recommendedKey: 'A',
            timeSignature: [4, 4],
            bpm: 140,
          })

          expect(db.insert).toHaveBeenCalledWith(
            'song',
            expect.objectContaining({
              slug: `song-title-here-${id}`,
            }),
          )
        }),
      )
    })

    it('converts song record to song model', async () => {
      const songRecord = {
        id: 1,
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        artist: 1,
        recommended_key: 'A',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 140,
      }

      const songModel = {
        id: 1,
        slug: 'blessed-be-your-name',
        title: 'Blessed Be Your Name',
        artistId: 1,
        recommendedKey: 'A',
        timeSignature: [4, 4] as TimeSignature,
        bpm: 140,
      }

      jest.spyOn(songApi, 'getOrCreateArtist').mockResolvedValue({
        id: 1,
        slug: 'matt-redman',
        name: 'Matt Redman',
      })
      db.insert.mockResolvedValue(songRecord)

      const mock = mkMock()
      await expect(songApi.createSong(mock)).resolves.toEqual(songModel)
    })
  })

  describe('updateSong', () => {
    it('no-ops if no updates passed', async () => {
      await expect(songApi.updateSong(1, {})).resolves.toBeUndefined()
    })

    it('can set a subset of fields', async () => {
      await songApi.updateSong(1, {
        title: 'foo',
        bpm: 100,
      })

      expect(db.execute).toHaveBeenCalledWith(
        expect.sqlMatching({
          text: 'UPDATE "song" SET "title" = $1, "bpm" = $2 WHERE "id" = $3',
          values: ['foo', 100, 1],
        }),
      )
    })
  })

  describe('getOrCreateArtist', () => {
    it('returns existing artist', async () => {
      await fc.assert(
        fc.asyncProperty(fc.string(), async (name) => {
          const artist = { name } as Artist
          jest.spyOn(songApi, 'getArtistByName').mockResolvedValue(artist)

          await expect(songApi.getOrCreateArtist(name)).resolves.toBe(artist)
          expect(songApi.getArtistByName).toHaveBeenCalledWith(name)
          expect(db.insert).not.toHaveBeenCalled()
        }),
      )
    })

    it('creates new artist', async () => {
      await fc.assert(
        fc.asyncProperty(fc.string(), async (name) => {
          const artist = { name } as Artist
          jest.spyOn(songApi, 'getArtistByName').mockResolvedValue(null)
          db.insert.mockResolvedValue(artist)

          await expect(songApi.getOrCreateArtist(name)).resolves.toBe(artist)
          expect(songApi.getArtistByName).toHaveBeenCalledWith(name)
          expect(db.insert).toHaveBeenCalledWith(
            'artist',
            expect.objectContaining(artist),
          )
        }),
      )
    })
  })
})
