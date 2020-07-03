import * as fc from 'fast-check'
import { RunnerOption } from 'node-pg-migrate'
import * as pg from 'pg'

import { SqlQuery } from '~/sql'

import { DatabaseClient } from './client'
import { Database } from './database'

beforeEach(jest.resetAllMocks)

/** Mock pg.Pool **/

jest.mock('pg', () => {
  return {
    Pool: jest.fn(),
  }
})

const mockPool = (pg.Pool as unknown) as jest.Mock

/** Mock DatabaseClient **/

jest.mock('./client', () => {
  return {
    DatabaseClient: jest.fn(),
  }
})

const mockDatabaseClient = (DatabaseClient as unknown) as jest.Mock

/** Tests **/

describe('Database', () => {
  it('can be constructed without a config', () => {
    new Database()
    expect(mockPool).toHaveBeenCalledWith(undefined)
  })

  it('can be constructed with any config', () => {
    fc.assert(
      fc.property(fc.anything(), (config) => {
        mockPool.mockReset()
        new Database(config as pg.PoolConfig)
        expect(mockPool).toHaveBeenCalledWith(config)
      }),
    )
  })

  describe('.withClient()', () => {
    const mkMockedPool = () => {
      const pool = {
        connect: jest.fn(),
        end: jest.fn(),
      }
      mockPool.mockReturnValue(pool)

      const pgClient = {
        release: jest.fn(),
      }
      pool.connect.mockResolvedValue(pgClient)

      return { pool, pgClient }
    }

    it('connects and releases a client', async () => {
      await fc.assert(
        fc.asyncProperty(fc.anything(), async (result) => {
          jest.resetAllMocks()

          const { pool, pgClient } = mkMockedPool()

          const client = jest.fn()
          mockDatabaseClient.mockReturnValue(client)

          const db = new Database()
          const callback = jest.fn().mockResolvedValue(result)
          await expect(db.withClient(callback)).resolves.toBe(result)

          expect(pool.connect).toHaveBeenCalled()
          expect(mockDatabaseClient).toHaveBeenCalledWith(pgClient)
          expect(callback).toHaveBeenCalledWith(client)
          expect(pgClient.release).toHaveBeenCalled()
        }),
      )
    })

    describe('.end()', () => {
      it('closes the pool', async () => {
        const { pool } = mkMockedPool()
        const db = new Database()
        await db.close()
        expect(pool.end).toHaveBeenCalled()
      })
    })

    it('releases a client even if an error occurs', async () => {
      await fc.assert(
        fc.asyncProperty(fc.anything(), async (err) => {
          jest.resetAllMocks()

          const { pgClient } = mkMockedPool()

          const db = new Database()
          const callback = jest.fn().mockRejectedValue(err)
          await expect(db.withClient(callback)).rejects.toBe(err)

          expect(pgClient.release).toHaveBeenCalled()
        }),
      )
    })
  })

  const mkDatabaseWithMockedClient = (client: unknown) => {
    const db = new Database()
    jest
      .spyOn(db, 'withClient')
      .mockImplementation((callback) => callback(client as DatabaseClient))
    return db
  }

  describe('.query()', () => {
    it('proxies to DatabaseClient', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.anything(),
          fc.anything(),
          async (query, result) => {
            const client = { query: jest.fn().mockResolvedValue(result) }

            const db = mkDatabaseWithMockedClient(client)
            await expect(db.query(query as SqlQuery)).resolves.toBe(result)

            expect(client.query).toHaveBeenCalledWith(query)
          },
        ),
      )
    })
  })

  describe('.queryOne()', () => {
    it('proxies to DatabaseClient', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.anything(),
          fc.anything(),
          async (query, result) => {
            const client = { queryOne: jest.fn().mockResolvedValue(result) }

            const db = mkDatabaseWithMockedClient(client)
            await expect(db.queryOne(query as SqlQuery)).resolves.toBe(result)

            expect(client.queryOne).toHaveBeenCalledWith(query)
          },
        ),
      )
    })
  })

  describe('.transaction()', () => {
    it('proxies to DatabaseClient', async () => {
      await fc.assert(
        fc.asyncProperty(fc.anything(), async (result) => {
          const callback = jest.fn().mockResolvedValue(result)
          const client = {
            transaction: jest.fn((f) => f()),
          }

          const db = mkDatabaseWithMockedClient(client)
          await expect(db.transaction(callback)).resolves.toBe(result)

          expect(client.transaction).toHaveBeenCalled()
          expect(callback).toHaveBeenCalledWith(client)
        }),
      )
    })
  })

  describe('.executeAll()', () => {
    it('proxies to DatabaseClient', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.anything()),
          fc.anything(),
          async (queries, result) => {
            const client = { executeAll: jest.fn().mockResolvedValue(result) }

            const db = mkDatabaseWithMockedClient(client)
            await expect(db.executeAll(queries as SqlQuery[])).resolves.toBe(
              result,
            )

            expect(client.executeAll).toHaveBeenCalledWith(queries)
          },
        ),
      )
    })
  })

  describe('.insertAll()', () => {
    it('proxies to DatabaseClient', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string(),
          fc.array(fc.anything()),
          fc.anything(),
          async (table, records, result) => {
            const client = { insertAll: jest.fn().mockResolvedValue(result) }

            const db = mkDatabaseWithMockedClient(client)
            await expect(
              db.insertAll(table, records as Array<Record<string, unknown>>),
            ).resolves.toBe(result)

            expect(client.insertAll).toHaveBeenCalledWith(table, records)
          },
        ),
      )
    })
  })

  describe('.migrate()', () => {
    it('proxies to DatabaseClient', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.anything(),
          fc.anything(),
          async (options, result) => {
            const client = { migrate: jest.fn().mockResolvedValue(result) }

            const db = mkDatabaseWithMockedClient(client)
            await expect(db.migrate(options as RunnerOption)).resolves.toBe(
              result,
            )

            expect(client.migrate).toHaveBeenCalledWith(options)
          },
        ),
      )
    })
  })

  describe('.clear()', () => {
    it('proxies to DatabaseClient', async () => {
      await fc.assert(
        fc.asyncProperty(fc.anything(), async (result) => {
          const client = { clear: jest.fn().mockResolvedValue(result) }

          const db = mkDatabaseWithMockedClient(client)
          await expect(db.clear()).resolves.toBe(result)

          expect(client.clear).toHaveBeenCalled()
        }),
      )
    })
  })
})
