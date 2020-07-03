/* eslint-disable @typescript-eslint/camelcase */

import * as path from 'path'

import { sql } from '~/index'
import { getTestDatabase } from '~test-utils'

const setupTestDatabase = async () => {
  const db = getTestDatabase()

  await db.withClient(async (client) => {
    await client.query(sql`
      CREATE TABLE "test_table" ("col1" VARCHAR);

      INSERT INTO "test_table" ("col1")
      VALUES ('foo'), ('bar'), ('baz');

      CREATE TABLE "person" (
        "name" VARCHAR NOT NULL,
        "age" INTEGER
      );
    `)
  })

  return db
}

describe('Database', () => {
  it('can connect with a client', async () => {
    const db = getTestDatabase()

    await expect(
      db.withClient((client) => client.query(sql`SELECT 1 AS val`)),
    ).resolves.toStrictEqual([{ val: 1 }])
  })

  describe('.query()', () => {
    it('can run a query', async () => {
      const db = await setupTestDatabase()

      await Promise.all(
        ['foo', 'bar', 'baz'].map(async (val) => {
          await expect(
            db.query(
              sql`SELECT "col1" FROM "test_table" WHERE "col1" = ${val}`,
            ),
          ).resolves.toStrictEqual([{ col1: val }])
        }),
      )
    })
  })

  describe('.queryOne()', () => {
    it('can run a query', async () => {
      const db = await setupTestDatabase()

      await expect(
        db.queryOne(sql`SELECT "col1" FROM "test_table" WHERE "col1" = 'foo'`),
      ).resolves.toEqual({ col1: 'foo' })
    })

    it('errors if the query returns no rows', async () => {
      const db = await setupTestDatabase()

      await expect(
        db.queryOne(sql`SELECT * FROM "test_table" WHERE FALSE`),
      ).rejects.toThrow()
    })

    it('errors if the query returns multiple rows', async () => {
      const db = await setupTestDatabase()

      await expect(
        db.queryOne(sql`SELECT * FROM "test_table"`),
      ).rejects.toThrow()
    })
  })

  describe('.transaction()', () => {
    it('can run a transaction', async () => {
      const db = await setupTestDatabase()

      await db.transaction(async (client) => {
        const rows = await client.query<{ col1: string }>(sql`
          SELECT "col1" FROM "test_table" WHERE "col1" != 'foo'
        `)

        await client.query(sql`
          DELETE FROM "test_table"
          WHERE "col1" = ANY(${rows.map(({ col1 }) => col1)})
        `)
      })

      await expect(
        db.query(sql`SELECT "col1" FROM "test_table"`),
      ).resolves.toStrictEqual([{ col1: 'foo' }])
    })

    it('rolls back a transaction', async () => {
      const db = await setupTestDatabase()

      await expect(
        db.transaction(async (client) => {
          await client.executeAll([
            sql`DELETE FROM "test_table"`,
            sql`SELECT * FROM "unknown_table"`,
          ])
        }),
      ).rejects.toThrow()

      await expect(
        db.query(sql`SELECT COUNT(*)::integer AS count FROM "test_table"`),
      ).resolves.toStrictEqual([{ count: 3 }])
    })
  })

  describe('.executeAll()', () => {
    it('can execute multiple queries', async () => {
      const db = await setupTestDatabase()
      const val1 = 'newvalue'
      const val2 = 'newvalue2'

      await db.executeAll([
        sql`INSERT INTO "test_table" ("col1") VALUES (${val1})`,
        sql`INSERT INTO "test_table" ("col1") VALUES (${val2})`,
      ])

      const rows = await db.query(sql`SELECT "col1" FROM "test_table"`)
      expect(rows).toContainEqual({ col1: val1 })
      expect(rows).toContainEqual({ col1: val2 })
    })

    it('rolls back if any individual query fails', async () => {
      const db = await setupTestDatabase()
      const val1 = 'newvalue'
      const val2 = 'newvalue2'

      await expect(
        db.executeAll([
          sql`INSERT INTO "test_table" ("col1") VALUES (${val1})`,
          sql`INSERT INTO "unknown_table" ("col1") VALUES ('bad')`,
          sql`INSERT INTO "test_table" ("col1") VALUES (${val2})`,
        ]),
      ).rejects.toThrow()

      const rows = await db.query(sql`SELECT "col1" FROM "test_table"`)
      expect(rows).not.toContainEqual({ col1: val1 })
      expect(rows).not.toContainEqual({ col1: val2 })
    })
  })

  describe('.insertAll()', () => {
    it('can insert multiple records', async () => {
      const db = await setupTestDatabase()
      await db.insertAll('person', [
        { name: 'Alice', age: 20 },
        { name: 'Bob' },
        { name: 'Claire', age: 30 },
      ])

      await expect(
        db.query(sql`SELECT * FROM "person"`),
      ).resolves.toMatchObject([
        { name: 'Alice', age: 20 },
        { name: 'Bob', age: null },
        { name: 'Claire', age: 30 },
      ])
    })

    it('rolls back if any individual query fails', async () => {
      const db = await setupTestDatabase()
      const val1 = 'newvalue'
      const val2 = 'newvalue2'

      await expect(
        db.insertAll('test_table', [
          { col1: val1 },
          { col1: 'bad', unknown_col: 'bad' },
          { col1: val2 },
        ]),
      ).rejects.toThrow()

      const rows = await db.query(sql`SELECT "col1" FROM "test_table"`)
      expect(rows).not.toContainEqual({ col1: val1 })
      expect(rows).not.toContainEqual({ col1: val2 })
    })
  })

  describe('.migrate()', () => {
    it('can run migrations', async () => {
      const db = getTestDatabase()
      // suppress output
      jest.spyOn(console, 'info').mockReturnValue(undefined)

      await db.migrate({
        dir: path.resolve(__dirname, '../../__test__/test_migrations/'),
      })

      expect(console.info).toHaveBeenCalled()

      await db.insertAll('users', [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Claire' },
      ])

      const users = await db.query<{ id: number; name: string }>(
        sql`SELECT * FROM "users"`,
      )
      const userToId = {} as Record<string, number>
      users.forEach(({ id, name }) => {
        userToId[name] = id
      })

      await db.insertAll('posts', [
        { userId: userToId['Alice'], body: `This is Alice's post` },
        { userId: userToId['Bob'], body: `This is Bob's post` },
        { userId: userToId['Claire'], body: `This is Claire's post` },
      ])

      await expect(
        db.query(sql`
          SELECT "posts"."body" AS "body", "users"."name" AS "author"
          FROM "posts"
          INNER JOIN "users" ON "posts"."userId" = "users"."id"
        `),
      ).resolves.toEqual([
        { body: `This is Alice's post`, author: 'Alice' },
        { body: `This is Bob's post`, author: 'Bob' },
        { body: `This is Claire's post`, author: 'Claire' },
      ])
    })
  })

  describe('.clear()', () => {
    it('can clear all tables', async () => {
      const db = getTestDatabase()

      await db.executeAll([
        sql`CREATE TABLE "test_table1" ("col1" VARCHAR)`,
        sql`INSERT INTO "test_table1" ("col1") VALUES ('a')`,
        sql`CREATE TABLE "test_table2" ("col1" VARCHAR)`,
        sql`INSERT INTO "test_table2" ("col1") VALUES ('b')`,
      ])

      // make sure tables are populated
      await expect(
        db.queryOne(sql`SELECT COUNT(*)::integer AS count FROM "test_table1"`),
      ).resolves.toStrictEqual({ count: 1 })
      await expect(
        db.queryOne(sql`SELECT COUNT(*)::integer AS count FROM "test_table2"`),
      ).resolves.toStrictEqual({ count: 1 })

      await db.clear()

      // make sure tables are cleared
      await expect(
        db.queryOne(sql`SELECT COUNT(*)::integer AS count FROM "test_table1"`),
      ).resolves.toStrictEqual({ count: 0 })
      await expect(
        db.queryOne(sql`SELECT COUNT(*)::integer AS count FROM "test_table2"`),
      ).resolves.toStrictEqual({ count: 0 })
    })

    it('is a noop if no tables exist', async () => {
      const db = getTestDatabase()

      await expect(db.clear()).resolves.toBeUndefined()
    })
  })
})
