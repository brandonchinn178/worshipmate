import '~/sql/testutils'

import * as fc from 'fast-check'
import migrate, { RunnerOption } from 'node-pg-migrate'
import * as pg from 'pg'

import { sql, SqlQuery } from '~/sql'

import { DatabaseClient } from './client'
import { parseMigrateArgs } from './migrate'

jest.mock('node-pg-migrate', () => {
  return {
    __esModule: true,
    ...jest.requireActual<Record<string, unknown>>('node-pg-migrate'),
    default: jest.fn(),
  }
})

jest.mock('./migrate', () => {
  return {
    parseMigrateArgs: jest.fn(),
  }
})

const mockParseMigrateArgs = (parseMigrateArgs as unknown) as jest.Mock

const mkClient = () => {
  const mockQuery = jest.fn()

  const pgClient = {
    query: mockQuery,
  } as unknown

  const client = new DatabaseClient(pgClient as pg.PoolClient)

  return { client, pgClient, mockQuery }
}

describe('DatabaseClient', () => {
  describe('.query()', () => {
    it('queries rows', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.anything(),
          fc.array(fc.anything()),
          async (query, rows) => {
            const { client, mockQuery } = mkClient()
            mockQuery.mockResolvedValue({ rows })

            await expect(client.query(query as SqlQuery)).resolves.toEqual(rows)
          },
        ),
      )
    })
  })

  describe('.queryOne()', () => {
    it('queries one row', async () => {
      await fc.assert(
        fc.asyncProperty(fc.anything(), fc.anything(), async (query, row) => {
          const { client, mockQuery } = mkClient()
          mockQuery.mockResolvedValue({ rows: [row] })

          await expect(client.queryOne(query as SqlQuery)).resolves.toEqual(row)
        }),
      )
    })

    it('errors with no rows', async () => {
      await fc.assert(
        fc.asyncProperty(fc.anything(), async (query) => {
          const { client, mockQuery } = mkClient()
          mockQuery.mockResolvedValue({ rows: [] })

          await expect(client.queryOne(query as SqlQuery)).rejects.toThrow()
        }),
      )
    })

    it('errors with multiple rows', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.anything(),
          fc.array(fc.anything(), 2, 10),
          async (query, rows) => {
            const { client, mockQuery } = mkClient()
            mockQuery.mockResolvedValue({ rows })

            await expect(client.queryOne(query as SqlQuery)).rejects.toThrow()
          },
        ),
      )
    })
  })

  describe('.transaction()', () => {
    it('runs the given callback in a transaction', async () => {
      await fc.assert(
        fc.asyncProperty(fc.anything(), async (result) => {
          const { client, mockQuery } = mkClient()

          const callback = jest.fn().mockResolvedValue(result)
          await expect(client.transaction(callback)).resolves.toBe(result)

          expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('BEGIN'))
          expect(callback).toHaveBeenCalled()
          expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('COMMIT'))
        }),
      )
    })

    it('rolls back the transaction if the callback rejects', async () => {
      await fc.assert(
        fc.asyncProperty(fc.anything(), async (result) => {
          const { client, mockQuery } = mkClient()

          const callback = jest.fn().mockRejectedValue(result)
          await expect(client.transaction(callback)).rejects.toBe(result)

          expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('BEGIN'))
          expect(callback).toHaveBeenCalled()
          expect(mockQuery).not.toHaveBeenCalledWith(
            expect.sqlMatching('COMMIT'),
          )
          expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('ROLLBACK'))
        }),
      )
    })
  })

  describe('.executeAll()', () => {
    it('does not query the database if no queries provided', async () => {
      const { client, mockQuery } = mkClient()
      await client.executeAll([])
      expect(mockQuery).not.toHaveBeenCalled()
    })

    it('executes the given queries', async () => {
      const song1 = 'Take On Me'
      const song2 = 'Separate Ways'

      const { client, mockQuery } = mkClient()
      await client.executeAll([
        sql`INSERT INTO "song" ("name") VALUES (${song1})`,
        sql`INSERT INTO "song" ("name") VALUES (${song2})`,
      ])

      expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('BEGIN'))
      expect(mockQuery).toHaveBeenCalledWith(
        expect.sqlMatching({
          text: 'INSERT INTO "song" ("name") VALUES ($1)',
          values: [song1],
        }),
      )
      expect(mockQuery).toHaveBeenCalledWith(
        expect.sqlMatching({
          text: 'INSERT INTO "song" ("name") VALUES ($1)',
          values: [song2],
        }),
      )
      expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('COMMIT'))
    })

    it('rolls back if any individual query fails', async () => {
      const { client, mockQuery } = mkClient()

      mockQuery.mockImplementation(async (query) => {
        if (query.text.match('UNKNOWN')) {
          throw new Error('fail')
        }
        return { rows: [] }
      })

      await expect(
        client.executeAll([
          sql`INSERT INTO "song" ("name") VALUES ('Take On Me')`,
          sql`INSERT INTO "song" ("name") VALUES ('UNKNOWN')`,
          sql`INSERT INTO "song" ("name") VALUES ('Separate Ways')`,
        ]),
      ).rejects.toThrow()

      expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('BEGIN'))
      expect(mockQuery).toHaveBeenCalledWith(
        expect.sqlMatching(`INSERT INTO "song" ("name") VALUES ('Take On Me')`),
      )
      expect(mockQuery).toHaveBeenCalledWith(
        expect.sqlMatching(`INSERT INTO "song" ("name") VALUES ('UNKNOWN')`),
      )
      expect(mockQuery).not.toHaveBeenCalledWith(
        expect.sqlMatching(`INSERT INTO "song" ("name") VALUES ('Separate')`),
      )
      expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('ROLLBACK'))
    })
  })

  describe('.insertAll()', () => {
    it('inserts the given records', async () => {
      const songs = [
        { name: 'Take On Me', artist: 'A-ha', rating: 5 },
        { name: 'Separate Ways', artist: 'Journey' },
      ]

      const { client } = mkClient()
      jest.spyOn(client, 'executeAll')
      await client.insertAll('song', songs)

      expect(client.executeAll).toHaveBeenCalledWith([
        expect.sqlMatching({
          text: `
            INSERT INTO "song" ("name","artist","rating")
            VALUES ($1,$2,$3)
          `,
          values: ['Take On Me', 'A-ha', 5],
        }),
        expect.sqlMatching({
          text: `
            INSERT INTO "song" ("name","artist")
            VALUES ($1,$2)
          `,
          values: ['Separate Ways', 'Journey'],
        }),
      ])
    })

    it('rolls back if any individual query fails', async () => {
      const { client, mockQuery } = mkClient()

      mockQuery.mockImplementation(async (query) => {
        if (query.values[0] === 'UNKNOWN') {
          throw new Error('fail')
        }
        return { rows: [] }
      })

      await expect(
        client.insertAll('song', [
          { name: 'Take On Me' },
          { name: 'UNKNOWN' },
          { name: 'Separate Ways' },
        ]),
      ).rejects.toThrow()

      expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('BEGIN'))
      expect(mockQuery).toHaveBeenCalledWith(
        expect.sqlMatching({
          text: `INSERT INTO "song" ("name") VALUES ($1)`,
          values: ['Take On Me'],
        }),
      )
      expect(mockQuery).toHaveBeenCalledWith(
        expect.sqlMatching({
          text: `INSERT INTO "song" ("name") VALUES ($1)`,
          values: ['UNKNOWN'],
        }),
      )
      expect(mockQuery).not.toHaveBeenCalledWith(
        expect.sqlMatching({
          text: `INSERT INTO "song" ("name") VALUES ($1)`,
          values: ['Separate Ways'],
        }),
      )
      expect(mockQuery).toHaveBeenCalledWith(expect.sqlMatching('ROLLBACK'))
    })
  })

  describe('.migrate()', () => {
    it('can run migration without passing options', async () => {
      const { client, pgClient } = mkClient()
      await client.migrate()

      expect(migrate).toHaveBeenCalledWith({
        dbClient: pgClient,
        migrationsTable: 'pgmigrations',
        dir: 'migrations',
        direction: 'up',
        count: Infinity,
      })
    })

    it('passes options through', async () => {
      await fc.assert(
        fc.asyncProperty(fc.object(), async (options) => {
          const { client } = mkClient()
          await client.migrate((options as unknown) as RunnerOption)

          expect(migrate).toHaveBeenCalledWith(expect.objectContaining(options))
        }),
      )
    })

    it('can load options from arguments', async () => {
      const fcMigrateDirectionOption = fc.record({
        direction: fc.constantFrom('up', 'down'),
        count: fc.constantFrom(Infinity, 1, 2, 3, 4),
      })

      await fc.assert(
        fc.asyncProperty(
          fc.array(fcMigrateDirectionOption, 1, 2),
          async (migrateDirectionOptions) => {
            mockParseMigrateArgs.mockReturnValue(migrateDirectionOptions)

            const { client } = mkClient()
            await client.migrate({ loadFromArgs: true })

            expect(mockParseMigrateArgs).toHaveBeenCalled()
            for (const options of migrateDirectionOptions) {
              expect(migrate).toHaveBeenCalledWith(
                expect.objectContaining(options),
              )
            }
          },
        ),
      )
    })
  })

  describe('.clear()', () => {
    const mockTableList = (mockQuery: jest.Mock, tables: string[]) => {
      mockQuery.mockImplementation(async (query) => {
        if (query.text.match('SELECT table_name AS table')) {
          return { rows: tables.map((table) => ({ table })) }
        }
        return { rows: [] }
      })
    }

    it('does not clear anything if no tables are in the database', async () => {
      const { client, mockQuery } = mkClient()
      mockTableList(mockQuery, [])

      await client.clear()

      expect(mockQuery).not.toHaveBeenCalledWith(
        expect.objectContaining({ text: expect.stringContaining('TRUNCATE') }),
      )
    })

    it('clears all tables', async () => {
      const { client, mockQuery } = mkClient()
      mockTableList(mockQuery, ['foo', 'bar'])

      await client.clear()

      expect(mockQuery).toHaveBeenCalledWith(
        expect.sqlMatching(
          'TRUNCATE "public"."foo","public"."bar" RESTART IDENTITY',
        ),
      )
    })
  })
})
