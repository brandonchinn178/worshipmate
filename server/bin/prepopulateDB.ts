#!/usr/bin/env ts-node-script

import { initDatabase } from '~/db'

const prepopulateDB = async () => {
  const db = initDatabase()

  try {
    console.log('TODO')
  } finally {
    db.close()
  }
}

prepopulateDB().catch(console.error)
