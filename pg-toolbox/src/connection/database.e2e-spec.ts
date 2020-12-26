import * as path from 'path'

import { sql } from '~/sql'
import { setupTestDatabase } from '~test-utils'

const db = setupTestDatabase()

const initTestTable = async () => {
  await db.withClient(async (client) => {
    await client.query(sql`
      CREATE TABLE "test_table" ("col1" VARCHAR);

      INSERT INTO "test_table" ("col1")
      VALUES ('foo'), ('bar'), ('baz');

      CREATE TABLE "person" (
        "name" VARCHAR NOT NULL UNIQUE,
        "age" INTEGER
      );
    `)
  })
}

describe('Database', () => {
  it('can connect with a client', async () => {
    await expect(
      db.withClient((client) => client.query(sql`SELECT 1 AS val`)),
    ).resolves.toStrictEqual([{ val: 1 }])
  })

  it('converts PostgreSQL bigint into Javascript BigInt', async () => {
    const { val } = await db.queryOne(sql`SELECT 1::bigint AS val`)
    expect(val).toEqual(BigInt(1))
  })

  describe('.query()', () => {
    beforeEach(initTestTable)

    it('can run a query', async () => {
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
    beforeEach(initTestTable)

    it('can run a query', async () => {
      await expect(
        db.queryOne(sql`SELECT "col1" FROM "test_table" WHERE "col1" = 'foo'`),
      ).resolves.toEqual({ col1: 'foo' })
    })

    it('errors if the query returns no rows', async () => {
      await expect(
        db.queryOne(sql`SELECT * FROM "test_table" WHERE FALSE`),
      ).rejects.toThrow()
    })

    it('errors if the query returns multiple rows', async () => {
      await expect(
        db.queryOne(sql`SELECT * FROM "test_table"`),
      ).rejects.toThrow()
    })
  })

  describe('.transaction()', () => {
    beforeEach(initTestTable)

    it('can run a transaction', async () => {
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
    beforeEach(initTestTable)

    it('can execute multiple queries', async () => {
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
    beforeEach(initTestTable)

    it('can insert multiple records', async () => {
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

    describe('inserting duplicates', () => {
      it('errors without onConflict specified', async () => {
        await db.insertAll('person', [{ name: 'Alice' }])

        await expect(
          db.insertAll('person', [{ name: 'Alice', age: 20 }]),
        ).rejects.toThrow()
      })

      it('errors with onConflict=null', async () => {
        await db.insertAll('person', [{ name: 'Alice' }])

        await expect(
          db.insertAll('person', [{ name: 'Alice', age: 20 }], {
            onConflict: null,
          }),
        ).rejects.toThrow()
      })

      it('noops with onConflict=ignore', async () => {
        await db.insertAll('person', [{ name: 'Alice' }])
        await db.insertAll('person', [{ name: 'Alice', age: 20 }], {
          onConflict: 'ignore',
        })

        await expect(
          db.query(sql`SELECT "name", "age" FROM "person"`),
        ).resolves.toMatchObject([{ name: 'Alice', age: null }])
      })

      it('noops with onConflict=ignore using column', async () => {
        await db.insertAll('person', [{ name: 'Alice' }])
        await db.insertAll('person', [{ name: 'Alice', age: 20 }], {
          onConflict: {
            action: 'ignore',
            column: 'name',
          },
        })

        await expect(
          db.query(sql`SELECT "name", "age" FROM "person"`),
        ).resolves.toMatchObject([{ name: 'Alice', age: null }])
      })

      it('noops with onConflict=ignore using constraint', async () => {
        await db.insertAll('person', [{ name: 'Alice' }])
        await db.insertAll('person', [{ name: 'Alice', age: 20 }], {
          onConflict: {
            action: 'ignore',
            constraint: 'person_name_key',
          },
        })

        await expect(
          db.query(sql`SELECT "name", "age" FROM "person"`),
        ).resolves.toMatchObject([{ name: 'Alice', age: null }])
      })

      it('errors with onConflict=ignore using another column', async () => {
        await db.query(
          sql`ALTER TABLE person ADD CONSTRAINT unique_age UNIQUE (age)`,
        )

        await db.insertAll('person', [{ name: 'Alice' }])
        await expect(
          db.insertAll('person', [{ name: 'Alice', age: 20 }], {
            onConflict: {
              action: 'ignore',
              column: 'age',
            },
          }),
        ).rejects.toThrow()
      })

      it('errors with onConflict=ignore using another constraint', async () => {
        await db.query(
          sql`ALTER TABLE person ADD CONSTRAINT unique_age UNIQUE (age)`,
        )

        await db.insertAll('person', [{ name: 'Alice' }])
        await expect(
          db.insertAll('person', [{ name: 'Alice', age: 20 }], {
            onConflict: {
              action: 'ignore',
              constraint: 'unique_age',
            },
          }),
        ).rejects.toThrow()
      })

      it('updates duplicates with onConflict=update using column', async () => {
        await db.insertAll('person', [{ name: 'Alice' }])
        await db.insertAll('person', [{ name: 'Alice', age: 20 }], {
          onConflict: {
            action: 'update',
            column: 'name',
          },
        })

        await expect(
          db.query(sql`SELECT "name", "age" FROM "person"`),
        ).resolves.toMatchObject([{ name: 'Alice', age: 20 }])
      })

      it('updates duplicates with onConflict=update using constraint', async () => {
        await db.insertAll('person', [{ name: 'Alice' }])
        await db.insertAll('person', [{ name: 'Alice', age: 20 }], {
          onConflict: {
            action: 'update',
            constraint: 'person_name_key',
          },
        })

        await expect(
          db.query(sql`SELECT "name", "age" FROM "person"`),
        ).resolves.toMatchObject([{ name: 'Alice', age: 20 }])
      })

      it('errors with onConflict=update using another column', async () => {
        await db.query(
          sql`ALTER TABLE person ADD CONSTRAINT unique_age UNIQUE (age)`,
        )

        await db.insertAll('person', [{ name: 'Alice' }])
        await expect(
          db.insertAll('person', [{ name: 'Alice', age: 20 }], {
            onConflict: {
              action: 'update',
              column: 'age',
            },
          }),
        ).rejects.toThrow()
      })

      it('errors with onConflict=update using another constraint', async () => {
        await db.query(
          sql`ALTER TABLE person ADD CONSTRAINT unique_age UNIQUE (age)`,
        )

        await db.insertAll('person', [{ name: 'Alice' }])
        await expect(
          db.insertAll('person', [{ name: 'Alice', age: 20 }], {
            onConflict: {
              action: 'update',
              constraint: 'unique_age',
            },
          }),
        ).rejects.toThrow()
      })
    })
  })

  describe('.migrate()', () => {
    it('can run migrations', async () => {
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
      await expect(db.clear()).resolves.toBeUndefined()
    })
  })
})
