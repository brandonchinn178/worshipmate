import { setupTestServer } from '~test-utils/apollo'
import { setupTestDatabase } from '~test-utils/db'

const db = setupTestDatabase()
const server = setupTestServer(db, { autoAuth: false })

describe('addSong', () => {
  const query = /* GraphQL */ `
    mutation($data: AddSongInput!) {
      addSong(data: $data) {
        slug
      }
    }
  `
  const variables = {
    data: {
      title: 'Blessed Be Your Name',
      recommendedKey: 'A',
      timeSignature: [4, 4],
      bpm: 140,
    },
  }

  it('fails without authentication', async () => {
    const res = await server.query({
      query,
      variables,
    })

    expect(res).toMatchObject({
      data: null,
      errors: [
        {
          message: 'Unauthenticated user cannot run this mutation',
          path: ['addSong'],
        },
      ],
    })
  })

  it('succeeds with authentication', async () => {
    const res = await server.query({
      query,
      variables,
      user: 'user1',
    })

    expect(res).toMatchObject({
      data: {
        addSong: {
          slug: expect.any(String),
        },
      },
    })
  })
})
