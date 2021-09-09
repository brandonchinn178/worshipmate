import { ApolloServer } from 'apollo-server'
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

type TestServerOptions = {
  /**
   * When true, automatically specify a user when running queries if one is
   * not explicitly provided.
   *
   * Defaults to true, since most tests shouldn't care about auth.
   */
  autoAuth?: boolean
}

type TestServerQueryArgs = Parameters<ApolloServer['executeOperation']>[0] & {
  /**
   * The user to run the query as. If not provided, defers to autoAuth.
   *
   * Passing 'null' will run the query without a user, regardless of what
   * autoAuth was set to.
   */
  user?: string | null
}

class TestServer {
  private autoAuth: boolean

  constructor(
    private readonly server: ApolloServer,
    options: TestServerOptions = {},
  ) {
    const { autoAuth = true } = options

    this.autoAuth = autoAuth
  }

  query({ user, ...args }: TestServerQueryArgs) {
    const authUser =
      user !== undefined ? user : this.autoAuth ? 'testuser' : null

    if (authUser) {
      mockUsername.mockReturnValue(authUser)
    }

    return this.server.executeOperation(args)
  }
}

export const setupTestServer = (db: Database, options?: TestServerOptions) => {
  const server = apollo.initServer(db)
  return new TestServer(server, options)
}
