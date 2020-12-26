#!/usr/bin/env ts-node-script

import { Database } from 'pg-toolbox'

import { initDatabase } from '~/db'

const runMigrations = async (db: Database) => {
  await db.migrate({
    checkOrder: true,
    loadFromArgs: true,
  })

  console.log('Migrations complete')
}

const bootstrap = async () => {
  const db = initDatabase()

  try {
    await runMigrations(db)
  } finally {
    await db.close()
  }
}

bootstrap().catch((e) => {
  console.error(e)
  process.exit(1)
})
