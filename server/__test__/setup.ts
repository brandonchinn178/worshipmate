import {
  Connection,
  createConnection,
  getConnection,
  getConnectionOptions,
} from 'typeorm'

// A helper for running an action with a database connection.
const withConnection = async (
  name: string,
  callback: (conn: Connection) => Promise<void>,
) => {
  let conn, isOriginallyConnected
  try {
    conn = await createConnection(name)
    isOriginallyConnected = false
  } catch (_) {
    conn = await getConnection(name)
    isOriginallyConnected = true
  }

  try {
    await callback(conn)
  } finally {
    if (!isOriginallyConnected) {
      await conn.close()
    }
  }
}

// A helper to manage the test database itself.
const manageTestDatabase = async (
  callback: (conn: Connection, testDatabase: string) => Promise<void>,
): Promise<void> => {
  const testDatabase = (await getConnectionOptions()).database as string

  await withConnection('original', async (originalConnection) => {
    await callback(originalConnection, testDatabase)
  })
}

// Set up Jest setup/teardown hooks to set up a test database.
const setupTestDatabase = () => {
  let beforeAllSucceeded = false

  beforeAll(async () => {
    // create test database
    await manageTestDatabase(async (conn, testDatabase) => {
      try {
        await conn.query(`CREATE DATABASE ${testDatabase}`)
      } catch (_) {
        throw new Error(
          `WARNING: test database '${testDatabase}' already exists. Please drop it.`,
        )
      }

      beforeAllSucceeded = true
    })
  })

  beforeEach(async () => {
    await withConnection('default', async (connection) => {
      // clear database
      await connection.transaction(async (manager) => {
        const tables = await manager.query(`
          SELECT table_name AS table FROM information_schema.tables
          WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        `)

        const truncationList = tables.map(
          ({ table }: { table: string }) => `public.${table}`,
        )

        await manager.query(
          `TRUNCATE ${truncationList.join(',')} RESTART IDENTITY`,
        )
      })
    })
  })

  afterAll(async () => {
    if (!beforeAllSucceeded) {
      return
    }

    // drop test database
    await manageTestDatabase(async (conn, testDatabase) => {
      await conn.query(`DROP DATABASE IF EXISTS ${testDatabase}`)
    })
  })
}

const TEST_TYPE = (process.env.TEST_TYPE || 'all') as
  | 'unit'
  | 'integration'
  | 'e2e'
  | 'all'

switch (TEST_TYPE) {
  case 'all':
  case 'integration':
  case 'e2e':
    setupTestDatabase()
}
