import { Database } from 'pg-toolbox'

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

export const initDatabase = () => {
  return new Database({
    database: 'worship_mate',
  })
}

export const withDatabase = async <T>(
  callback: (db: Database) => Promise<T>,
): Promise<T> => {
  const db = initDatabase()
  try {
    return await callback(db)
  } finally {
    await db.close()
  }
}
