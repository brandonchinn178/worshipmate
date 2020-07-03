import { sql } from '~/sql'
import { getTestDatabase, initTestDatabase } from '~test-utils'

beforeAll(initTestDatabase)

beforeEach(async () => {
  const db = getTestDatabase()
  await db.executeAll([
    sql`DROP SCHEMA public CASCADE`,
    sql`CREATE SCHEMA public`,
  ])
})

afterAll(async () => {
  const db = getTestDatabase()
  await db.close()
})
