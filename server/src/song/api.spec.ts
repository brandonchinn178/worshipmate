import * as fc from 'fast-check'
import * as _ from 'lodash'
import { Database } from 'pg-fusion'

import { SongAPI } from './api'
import { TimeSignature } from './models'
import { SONG_SELECT_QUERY } from './sql'

beforeEach(jest.resetAllMocks)

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

  describe('searchSongs', () => {
    it('can return all songs', async () => {
      await songApi.searchSongs()
      expect(db.query).toHaveBeenCalledWith(
        expect.sqlMatching(`
          ${SONG_SELECT_QUERY.text}
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
            ${SONG_SELECT_QUERY.text}
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
            ${SONG_SELECT_QUERY.text}
            WHERE "song"."recommended_key" = $1
            ORDER BY "song"."title"
          `,
          values: ['A'],
        }),
      )
    })
  })

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
        artist: 'Matt Redman',
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

      await expect(songApi.createSong(songModel)).resolves.toEqual(songModel)
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
})
