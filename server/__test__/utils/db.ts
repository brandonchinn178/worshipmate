import { Database, sql } from 'pg-fusion'

import { DB_NAME, initDatabase, withAdminDatabase } from '~/db'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export const setupTestDatabase = (): Database => {
  let dbOrNull: Database | null = null
  beforeAll(async () => {
    await withAdminDatabase(async (admin) => {
      await admin.query(sql`DROP DATABASE IF EXISTS ${sql.quote(DB_NAME)}`)
    })

    dbOrNull = await initDatabase()
  })

  const getDB = (): Database => {
    if (dbOrNull === null) {
      throw new Error('Database has not been initialized yet.')
    }
    return dbOrNull
  }

  beforeAll(async () => {
    const db = getDB()
    await db.migrate({
      log: () => {
        // suppress migration output
      },
    })
  })

  beforeEach(async () => {
    const db = getDB()
    await db.clear()
  })

  afterAll(async () => {
    const db = getDB()
    await db.close()
  })

  const dbProxy = new Proxy(
    {},
    {
      get: (target, prop) => {
        const db = getDB()
        return Reflect.get(db, prop)
      },
    },
  )

  return dbProxy as Database
}
