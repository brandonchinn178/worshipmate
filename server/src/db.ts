import * as _ from 'lodash'
import { Database, sql } from 'pg-fusion'

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

export const DB_NAME =
  process.env.NODE_ENV === 'test' ? 'worship_mate_test' : 'worship_mate'

export const initDatabase = async () => {
  if (process.env.NODE_ENV === 'test') {
    await withAdminDatabase(async (admin) => {
      const databases = await admin.query(sql`SELECT datname FROM pg_database`)
      if (!_(databases).map('datname').includes(DB_NAME)) {
        await admin.query(sql`CREATE DATABASE ${sql.quote(DB_NAME)}`)
      }
    })
  }

  return new Database({
    database: DB_NAME,
  })
}

export const withDatabase = async <T>(
  callback: (db: Database) => Promise<T>,
): Promise<T> => {
  const db = await initDatabase()
  try {
    return await callback(db)
  } finally {
    await db.close()
  }
}

/**
 * Manage the databases in the PostgreSQL server. Useful for testing.
 */
export const withAdminDatabase = async <T>(
  callback: (db: Database) => Promise<T>,
): Promise<T> => {
  const db = new Database({ database: 'postgres' })
  try {
    return await callback(db)
  } finally {
    await db.close()
  }
}
