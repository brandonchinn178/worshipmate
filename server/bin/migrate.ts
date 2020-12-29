#!/usr/bin/env ts-node-script

import { Database, loadCLIMigrateArgs } from 'pg-toolbox'

import { withDatabase } from '~/db'

const cliMigrateArgs = loadCLIMigrateArgs()

const runMigrations = async (db: Database) => {
  await db.migrate({
    ...cliMigrateArgs,
    checkOrder: true,
  })

  console.log('Migrations complete')
}

withDatabase(runMigrations).catch((e) => {
  console.error(e)
  process.exit(1)
})
