import {
  Connection,
  createConnection,
  getConnection,
  getConnectionOptions,
} from 'typeorm'

// A helper to manage the test database itself.
const manageTestDatabase = async (
  callback: (conn: Connection, testDatabase: string) => Promise<void>,
): Promise<void> => {
  const originalConnection = await createConnection('original')
  const testDatabase = (await getConnectionOptions()).database as string

  try {
    await callback(originalConnection, testDatabase)
  } finally {
    await originalConnection.close()
  }
}

// Set up Jest setup/teardown hooks to set up a test database.
const setupConnection = () => {
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
    })
  })

  beforeEach(async () => {
    const connection = await createConnection()

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

  afterAll(async () => {
    // close test database connection
    const connection = await getConnection()
    await connection.close()

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
    setupConnection()
}
