#!/usr/bin/env ts-node

import { initDatabase } from '~/db'

const runMigrations = async () => {
  const db = initDatabase()
  const options = {
    checkOrder: true,
    loadFromArgs: true,
  }

  try {
    await db.migrate(options)
    console.log('Migrations complete')
  } finally {
    db.close()
  }
}

runMigrations().catch(console.error)
