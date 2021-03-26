import { ApolloServer } from 'apollo-server'
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing'
import { Database } from 'pg-fusion'

import * as apollo from '~/apollo'
import { UserAPI } from '~/user/api'

const mockUsername = jest.fn()
beforeEach(() => {
  mockUsername.mockReset()
})

jest.mock('~/apollo/auth', () => {
  return {
    // request is undefined in tests
    getUserFromRequest: async (req: undefined, db: Database) => {
      const username = mockUsername()
      if (!username) {
        return null
      }

      return new UserAPI(db).getOrCreate(username)
    },
  }
})

type TestServerQueryArgs = Parameters<ApolloServerTestClient['query']>[0] & {
  user?: string
}

class TestServer {
  private client: ApolloServerTestClient

  constructor(server: ApolloServer) {
    this.client = createTestClient(server)
  }

  query({ user, ...args }: TestServerQueryArgs) {
    if (user) {
      mockUsername.mockReturnValue(user)
    }

    return this.client.query(args)
  }
}

export const setupTestServer = (db: Database, options?: TestServerOptions) => {
  const server = apollo.initServer(db)
  return new TestServer(server, options)
}
