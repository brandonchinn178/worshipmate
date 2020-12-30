#!/usr/bin/env ts-node-script

import { withDatabase } from '~/db'

withDatabase((db) => db.clear()).catch((e) => {
  console.error(e)
  process.exit(1)
})
