#!/usr/bin/env ts-node-script

import * as express from 'express'
import { Database } from 'pg-fusion'

import { withDatabase } from '~/db'

import { prepopulateDB } from './initDB'

const app = express()

const handle = (callback: (db: Database) => Promise<void>) => {
  return (req: express.Request, res: express.Response) => {
    withDatabase((db) => callback(db))
      .then(() => {
        res.status(201).send()
      })
      .catch((e) => {
        console.error(e)
        res.status(500).send(e.toString())
      })
  }
}

const log = (message: string) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${message}`)
}

app.get('/', (req, res) => res.status(200).send())

app.post(
  '/clearDatabase',
  handle(async (db) => {
    await db.clear()
    log('Finished: /clearDatabase')
  }),
)

app.post(
  '/seedDatabase',
  handle(async (db) => {
    await prepopulateDB(db)
    log('Finished: /seedDatabase')
  }),
)

app.listen(4040, () => {
  console.log('Database test server listening on port 4040...')
})
