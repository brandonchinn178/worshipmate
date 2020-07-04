import { Database } from 'pg-toolbox'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

export const initDatabase = () => {
  return new Database({
    database: 'worship_mate',
  })
}
