import { Database, sql } from 'pg-toolbox'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
const TEST_DB = 'worship_mate_test'

export const setupTestDatabase = (): Database => {
  beforeAll(async () => {
    const admin = new Database({ database: 'postgres' })

    try {
      await admin.query(sql`DROP DATABASE IF EXISTS ${sql.quote(TEST_DB)}`)
      await admin.query(sql`CREATE DATABASE ${sql.quote(TEST_DB)}`)
    } finally {
      await admin.close()
    }
  })

  const db = new Database({ database: TEST_DB })

  beforeAll(async () => {
    await db.migrate({
      log: () => {
        // suppress migration output
      },
    })
  })

  beforeEach(async () => {
    await db.clear()
  })

  afterAll(async () => {
    await db.close()
  })

  return db
}
