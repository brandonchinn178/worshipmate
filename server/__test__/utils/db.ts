import { Database } from 'pg-fusion'

import { dropTestDatabase, initDatabase } from '~/db'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export const setupTestDatabase = (): Database => {
  let dbOrNull: Database | null = null
  beforeAll(async () => {
    await dropTestDatabase()
    const db = await initDatabase()
    await db.migrate({
      log: () => {
        // suppress migration output
      },
    })

    dbOrNull = db
  })

  const getDB = (): Database => {
    if (dbOrNull === null) {
      throw new Error('Database has not been initialized yet.')
    }
    return dbOrNull
  }

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
