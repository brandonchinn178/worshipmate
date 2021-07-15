import * as fc from 'fast-check'
import { sql } from 'pg-fusion'

import { setupTestDatabase } from '~test-utils/db'

import { UserAPI } from './api'

const db = setupTestDatabase()
const userApi = new UserAPI(db)

const fcName = fc.string({ minLength: 1 })

describe('UserAPI', () => {
  describe('getOrCreate', () => {
    it('can create a new user', async () => {
      await fc.assert(
        fc.asyncProperty(fcName, async (name) => {
          await db.clear()
          const user = await userApi.getOrCreate(name)
          expect(user).toMatchObject({ name })
        }),
      )
    })

    it('can get an existing user', async () => {
      await fc.assert(
        fc.asyncProperty(fcName, async (name) => {
          await db.clear()
          await db.insert('user', { name })

          const { count: before } = await db.querySingle(sql`
            SELECT COUNT(*) FROM "user"
          `)

          // should not error
          const user = await userApi.getOrCreate(name)
          expect(user).toMatchObject({ name })

          const { count: after } = await db.querySingle(sql`
            SELECT COUNT(*) FROM "user"
          `)
          expect(after).toEqual(before)
        }),
      )
    })
  })
})
