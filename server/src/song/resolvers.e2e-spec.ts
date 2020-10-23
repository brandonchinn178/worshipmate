import { setupTestServer } from '~test-utils/apollo'
import { setupTestDatabase } from '~test-utils/db'

const db = setupTestDatabase()
const server = setupTestServer(db)

describe('Query', () => {
  describe('songs', () => {
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

    it('queries all songs', async () => {
      const res = await server.query({
        query: `
          query {
            songs {
              id
              slug
              title
              recommendedKey
              timeSignature {
                top
                bottom
              }
              bpm
            }
          }
        `,
      })

      expect(res).toMatchObject({
        data: {
          songs: [
            {
              id: expect.any(String),
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
              id: expect.any(String),
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
              id: expect.any(String),
              slug: 'ever-be',
              title: 'Ever Be',
              recommendedKey: 'E',
              timeSignature: {
                top: 4,
                bottom: 4,
              },
              bpm: 72,
            },
          ],
        },
      })
    })

    it('queries songs filtered by search query', async () => {
      const res = await server.query({
        query: `
          query ($query: String!) {
            songs(query: $query) {
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
          songs: expect.arrayContaining([
            { title: 'Blessed Be Your Name' },
            { title: 'Ever Be' },
          ]),
        },
      })
    })
  })
})
