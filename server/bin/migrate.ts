#!/usr/bin/env ts-node-script

import { Database, loadCLIMigrateArgs } from 'pg-fusion'

import { dropTestDatabase, withDatabase } from '~/db'

const cliMigrateArgs = loadCLIMigrateArgs()

const runMigrations = async (db: Database) => {
  await db.migrate({
    ...cliMigrateArgs,
    checkOrder: true,
  })

  console.log('Migrations complete')
}

const bootstrap = async () => {
  await dropTestDatabase()
  return withDatabase(runMigrations)
}

bootstrap().catch((e) => {
  console.error(e)
  process.exit(1)
})
