#!/usr/bin/env ts-node-script

import { initDatabase } from '~/db'

const prepopulateDB = async () => {
  console.log('TODO')
}

const bootstrap = async () => {
  const db = initDatabase()

  try {
    await prepopulateDB(db)
  } finally {
    await db.close()
  }
}

bootstrap().catch((e) => {
  console.error(e)
  process.exit(1)
})
