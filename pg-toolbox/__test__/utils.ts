require('dotenv').config()

import { Database } from '~/index'

let GLOBAL_DB: null | Database

export const initTestDatabase = () => {
  GLOBAL_DB = new Database({ database: 'pg_toolbox_test' })
  return GLOBAL_DB
}

export const getTestDatabase = () => {
  if (!GLOBAL_DB) {
    throw new Error('Database has not been initialized yet.')
  }
  return GLOBAL_DB
}
