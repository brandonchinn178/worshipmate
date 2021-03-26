import { setupTestServer } from '~test-utils/apollo'
import { setupTestDatabase } from '~test-utils/db'

const db = setupTestDatabase()
const server = setupTestServer(db, { autoAuth: false })

describe('Query', () => {
  describe('me', () => {
    beforeEach(async () => {
      await db.insertAll('user', [
        { name: 'user1' },
        { name: 'user2' },
        { name: 'user3' },
      ])
    })

    it('gets information about the current user', async () => {
      const user1 = await server.query({
        query: /* GraphQL */ `
          query {
            me {
              id
              name
            }
          }
        `,
        user: 'user1',
      })
      expect(user1).toMatchObject({
        data: {
          me: {
            id: expect.any(String),
            name: 'user1',
          },
        },
      })

      const user2 = await server.query({
        query: /* GraphQL */ `
          query {
            me {
              id
              name
            }
          }
        `,
        user: 'user2',
      })
      expect(user2).toMatchObject({
        data: {
          me: {
            id: expect.any(String),
            name: 'user2',
          },
        },
      })
    })

    it('returns null if user is not authenticated', async () => {
      const { data } = await server.query({
        query: /* GraphQL */ `
          query {
            me {
              id
              name
            }
          }
        `,
      })
      expect(data).toEqual({ me: null })
    })
  })
})
