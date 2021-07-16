import { setupTestServer } from '~test-utils/apollo'
import { setupTestDatabase } from '~test-utils/db'

import { ArtistRecord, SongRecord } from './schema'

const db = setupTestDatabase()
const server = setupTestServer(db)

describe('Query', () => {
  describe('searchSongs', () => {
    beforeEach(async () => {
      const [
        artistBethel,
        artistHousefires,
        artistMattRedman,
      ] = await db.insertAll<ArtistRecord>('artist', [
        {
          slug: 'bethel-music',
          name: 'Bethel Music',
        },
        {
          slug: 'housefires',
          name: 'Housefires',
        },
        {
          slug: 'matt-redman',
          name: 'Matt Redman',
        },
      ])

      await db.insertAll('song', [
        {
          slug: 'blessed-be-your-name',
          title: 'Blessed Be Your Name',
          artist: artistMattRedman.id,
          recommended_key: 'A',
          time_signature_top: 4,
          time_signature_bottom: 4,
          bpm: 140,
        },
        {
          slug: 'build-my-life',
          title: 'Build My Life',
          artist: artistHousefires.id,
          recommended_key: 'E',
          time_signature_top: 4,
          time_signature_bottom: 4,
          bpm: 68,
        },
        {
          slug: 'ever-be',
          title: 'Ever Be',
          artist: artistBethel.id,
          recommended_key: 'E',
          time_signature_top: 4,
          time_signature_bottom: 4,
          bpm: 72,
        },
      ])
    })

    it('queries all songs', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          query {
            searchSongs {
              id
              slug
              title
              recommendedKey
              timeSignature
              bpm
            }
          }
        `,
      })

      expect(res).toMatchObject({
        data: {
          searchSongs: [
            {
              id: expect.any(String),
              slug: 'blessed-be-your-name',
              title: 'Blessed Be Your Name',
              recommendedKey: 'A',
              timeSignature: [4, 4],
              bpm: 140,
            },
            {
              id: expect.any(String),
              slug: 'build-my-life',
              title: 'Build My Life',
              recommendedKey: 'E',
              timeSignature: [4, 4],
              bpm: 68,
            },
            {
              id: expect.any(String),
              slug: 'ever-be',
              title: 'Ever Be',
              recommendedKey: 'E',
              timeSignature: [4, 4],
              bpm: 72,
            },
          ],
        },
      })
    })

    it('queries songs filtered by search query', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          query($query: String!) {
            searchSongs(query: $query) {
              title
            }
          }
        `,
        variables: {
          query: 'be',
        },
      })

      expect(res).toMatchObject({
        data: {
          searchSongs: expect.arrayContaining([
            { title: 'Blessed Be Your Name' },
            { title: 'Ever Be' },
          ]),
        },
      })
    })

    describe('search with filters', () => {
      it('queries songs filtered by a search filter', async () => {
        const res = await server.query({
          query: /* GraphQL */ `
            query($filters: SearchFilters!) {
              searchSongs(filters: $filters) {
                title
              }
            }
          `,
          variables: {
            filters: { recommendedKey: 'E' },
          },
        })

        expect(res).toMatchObject({
          data: {
            searchSongs: expect.arrayContaining([
              { title: 'Build My Life' },
              { title: 'Ever Be' },
            ]),
          },
        })
      })

      it('queries songs filtered by multiple search filters', async () => {
        const res = await server.query({
          query: /* GraphQL */ `
            query($filters: SearchFilters!) {
              searchSongs(filters: $filters) {
                title
              }
            }
          `,
          variables: {
            filters: {
              recommendedKey: 'E',
              bpm: 68,
            },
          },
        })

        expect(res).toMatchObject({
          data: {
            searchSongs: [{ title: 'Build My Life' }],
          },
        })
      })

      it('queries songs with query and filter', async () => {
        const res = await server.query({
          query: /* GraphQL */ `
            query($query: String!, $filters: SearchFilters!) {
              searchSongs(query: $query, filters: $filters) {
                title
              }
            }
          `,
          variables: {
            query: 'be',
            filters: { recommendedKey: 'E' },
          },
        })

        expect(res).toMatchObject({
          data: {
            searchSongs: [{ title: 'Ever Be' }],
          },
        })
      })
    })
  })

  describe('song', () => {
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

    it('gets a song', async () => {
      const { slug } = await createSong()

      const res = await server.query({
        query: /* GraphQL */ `
          query($slug: String!) {
            song(slug: $slug) {
              title
            }
          }
        `,
        variables: {
          slug,
        },
      })

      expect(res).toMatchObject({
        data: {
          song: {
            title: 'Blessed Be Your Name',
          },
        },
      })
    })

    it('returns null if song does not exist', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          query($slug: String!) {
            song(slug: $slug) {
              title
            }
          }
        `,
        variables: {
          slug: 'foo',
        },
      })

      expect(res).toMatchObject({
        data: {
          song: null,
        },
      })
    })
  })
})

describe('Mutation', () => {
  describe('addSong', () => {
    it('adds a song', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          mutation($data: AddSongInput!) {
            addSong(data: $data) {
              slug
              title
              artist {
                name
              }
            }
          }
        `,
        variables: {
          data: {
            title: 'Blessed Be Your Name',
            artist: 'Matt Redman',
            recommendedKey: 'A',
            timeSignature: [4, 4],
            bpm: 140,
          },
        },
      })

      expect(res).toMatchObject({
        data: {
          addSong: {
            slug: 'blessed-be-your-name',
            title: 'Blessed Be Your Name',
            artist: {
              name: 'Matt Redman',
            },
          },
        },
      })
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

    it('returns null if song does not exist', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          mutation($id: ID!, $data: UpdateSongInput!) {
            updateSong(id: $id, data: $data) {
              slug
            }
          }
        `,
        variables: {
          id: '100',
          data: {
            recommendedKey: 'G',
          },
        },
      })

      expect(res).toMatchObject({
        data: {
          updateSong: null,
        },
      })
    })

    it('updates a song', async () => {
      const { id, slug } = await createSong()

      const res = await server.query({
        query: /* GraphQL */ `
          mutation($id: ID!, $data: UpdateSongInput!) {
            updateSong(id: $id, data: $data) {
              recommendedKey
            }
          }
        `,
        variables: {
          id,
          data: {
            recommendedKey: 'G',
          },
        },
      })

      expect(res).toMatchObject({
        data: {
          updateSong: {
            recommendedKey: 'G',
          },
        },
      })

      const {
        data: { song },
      } = await server.query({
        query: /* GraphQL */ `
          query($slug: String!) {
            song(slug: $slug) {
              recommendedKey
            }
          }
        `,
        variables: {
          slug,
        },
      })

      expect(song).toEqual({
        recommendedKey: 'G',
      })
    })
  })
})

describe('Song', () => {
  const insertSong = async () => {
    const artist = await db.insert<ArtistRecord>('artist', {
      slug: 'matt-redman',
      name: 'Matt Redman',
    })

    const song = await db.insert<SongRecord>('song', {
      slug: 'blessed-be-your-name',
      title: 'Blessed Be Your Name',
      artist: artist.id,
      recommended_key: 'A',
      time_signature_top: 4,
      time_signature_bottom: 4,
      bpm: 140,
    })

    return { artist, song }
  }

  describe('artist', () => {
    it('gets the artist for the song', async () => {
      const { artist, song } = await insertSong()

      const res = await server.query({
        query: /* GraphQL */ `
          query($slug: String!) {
            song(slug: $slug) {
              artist {
                id
                slug
                name
              }
            }
          }
        `,
        variables: {
          slug: song.slug,
        },
      })

      expect(res).toMatchObject({
        data: {
          song: {
            artist: {
              ...artist,
              id: artist.id.toString(),
            },
          },
        },
      })
    })
  })
})

describe('TimeSignature', () => {
  beforeEach(async () => {
    const artist = await db.insert<ArtistRecord>('artist', {
      slug: 'artist1',
      name: 'artist1',
    })

    await db.insertAll('song', [
      {
        slug: 'four-four',
        title: '4/4',
        artist: artist.id,
        recommended_key: 'C',
        time_signature_top: 4,
        time_signature_bottom: 4,
        bpm: 0,
      },
      {
        slug: 'three-four',
        title: '3/4',
        artist: artist.id,
        recommended_key: 'C',
        time_signature_top: 3,
        time_signature_bottom: 4,
        bpm: 0,
      },
    ])
  })

  describe('serialize from resolver', () => {
    it('serializes correctly', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          query {
            searchSongs {
              timeSignature
            }
          }
        `,
      })

      expect(res).toMatchObject({
        data: {
          searchSongs: expect.arrayContaining([
            { timeSignature: [4, 4] },
            { timeSignature: [3, 4] },
          ]),
        },
      })
    })
  })

  describe('parse from variables', () => {
    it('parses a valid time signature', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          query($filters: SearchFilters!) {
            searchSongs(filters: $filters) {
              title
            }
          }
        `,
        variables: {
          filters: { timeSignature: [4, 4] },
        },
      })

      expect(res).toMatchObject({
        data: {
          searchSongs: [{ title: '4/4' }],
        },
      })
    })

    it('errors for invalid time signature', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          query($filters: SearchFilters!) {
            searchSongs(filters: $filters) {
              title
            }
          }
        `,
        variables: {
          filters: { timeSignature: 'asdf' },
        },
      })

      expect(res).toMatchObject({
        errors: [
          { message: expect.stringContaining('Invalid time signature') },
        ],
      })
    })

    it('errors for invalid time signature components', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          query($filters: SearchFilters!) {
            searchSongs(filters: $filters) {
              title
            }
          }
        `,
        variables: {
          filters: { timeSignature: ['foo', 'bar'] },
        },
      })

      expect(res).toMatchObject({
        errors: [
          { message: expect.stringContaining('Invalid time signature') },
        ],
      })
    })
  })

  describe('parse from literal', () => {
    it('parses a valid time signature', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          query {
            searchSongs(filters: { timeSignature: [4, 4] }) {
              title
            }
          }
        `,
      })

      expect(res).toMatchObject({
        data: {
          searchSongs: [{ title: '4/4' }],
        },
      })
    })

    it('errors for invalid time signature', async () => {
      const res = await server.query({
        query: /* GraphQL */ `
          query {
            searchSongs(filters: { timeSignature: asdf }) {
              title
            }
          }
        `,
      })

      expect(res).toMatchObject({
        errors: [
          { message: expect.stringContaining('Invalid time signature') },
        ],
      })
    })
  })
})
