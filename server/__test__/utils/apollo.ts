import { createTestClient } from 'apollo-server-testing'
import { Database } from 'pg-toolbox'

import * as apollo from '~/apollo'

export const setupTestServer = (db: Database) => {
  const server = apollo.initServer(db)
  return createTestClient(server)
}
