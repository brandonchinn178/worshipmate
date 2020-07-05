import { Database, sql } from '~/index'

require('dotenv').config()
const TEST_DB = 'pg_toolbox_test'

export const setupTestDatabase = (): Database => {
  const db = new Database({ database: TEST_DB })

  beforeEach(async () => {
    await db.executeAll([
      sql`DROP SCHEMA public CASCADE`,
      sql`CREATE SCHEMA public`,
    ])
  })

  afterAll(async () => {
    await db.close()
  })

  return db
}
