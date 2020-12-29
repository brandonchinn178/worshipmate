import { Database } from 'pg-fusion'

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

export const initDatabase = async () => {
  return new Database({
    database: 'worship_mate',
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
