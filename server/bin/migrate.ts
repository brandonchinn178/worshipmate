#!/usr/bin/env ts-node-script

import { Database } from 'pg-toolbox'

import { withDatabase } from '~/db'

const runMigrations = async (db: Database) => {
  await db.migrate({
    checkOrder: true,
    loadFromArgs: true,
  })

  console.log('Migrations complete')
}

withDatabase(runMigrations).catch((e) => {
  console.error(e)
  process.exit(1)
})
