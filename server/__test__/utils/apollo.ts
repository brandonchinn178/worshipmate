import { createTestClient } from 'apollo-server-testing'
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
    getUserFromRequest: (req: undefined, db: Database) => {
      const username = mockUsername() ?? 'testuser'
      return new UserAPI(db).getOrCreate(username)
    },
  }
})

export const setupTestServer = (db: Database) => {
  const server = apollo.initServer(db)
  return createTestClient(server)
}

export const setReqUser = (name: string) => {
  mockUsername.mockReturnValue(name)
}
