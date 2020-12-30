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
        res.status(500).send(e.toString())
      })
  }
}

app.post(
  '/clearDatabase',
  handle((db) => db.clear()),
)

app.post(
  '/seedDatabase',
  handle((db) => prepopulateDB(db)),
)

app.listen(4040, () => {
  console.log('Database test server listening on port 4040...')
})
