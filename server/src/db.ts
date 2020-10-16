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
