# pg-toolbox

This package provides a wrapper around `pg.Pool` to provide a nicer, more
comprehensive interface to a Postgres database. Features provided in this
wrapper include:

- Initialization and clean up as easy as using `pg.Pool` directly

  ```ts
  import { Database } from 'pg-toolbox'

  const db = new Database(/* normal pg.Pool options */)

  // Use database

  await db.close()
  ```

- A helper for getting, using, and releasing a client

  ```ts
  db.withClient(async (client) => {
      const rows = await client.query(...)
      return rows.map(...)
  })
  ```

- A SQL query builder that automatically parametrizes values

  ```ts
  import { sql } from 'pg-toolbox'

  /**
   * Equivalent to:
   *
   * {
   *   text: 'SELECT * FROM song WHERE song.name = $1',
   *   values: [songName],
   * }
   */
  const query = sql`
      SELECT * FROM song WHERE song.name = ${songName}
  `
  ```

- Helpers for querying and executing queries

  ```ts
  await db.withClient(async (client) => {
    const songs = await client.query(sql`SELECT * FROM song`)

    // errors if 0 or more than 1 row comes back
    const numSongs = await client.queryOne(sql`SELECT COUNT(*) FROM song`)

    // executes in a single transaction
    await client.executeAll([
      sql`INSERT INTO song (name) VALUES (${song1})`,
      sql`INSERT INTO song (name) VALUES (${song2})`,
    ])
  })

  // All client methods are proxied through Database
  const songs = await db.query(sql`SELECT * FROM song`)
  ```

- A helper for running queries in a single transaction

  ```ts
  await db.withClient(async (client) => {
    await client.transaction(() => {
      await client.query(sql`INSERT INTO song (name) VALUES (${song1})`)

      return client.query(sql`SELECT * FROM song`)
    })
  })

  // Equivalent to above
  await db.transaction(async (client) => {
    await client.query(sql`INSERT INTO song (name) VALUES (${song1})`)

    return client.query(sql`SELECT * FROM song`)
  })
  ```

- A helper for inserting records into a table

  ```ts
  await db.withClient(async (client) => {
    await client.insertAll('song', [{ name: song1 }, { name: song2 }])
  })

  // Equivalent to above
  await db.insertAll('song', [{ name: song1 }, { name: song2 }])
  ```

- A helper for running migrations with `node-pg-migrate`

  See https://salsita.github.io/node-pg-migrate/#/api for available options.
  This function will automatically provide the following defaults (mirroring
  the CLI):

  - `migrationsTable`: `'pgmigrations'`
  - `dir`: `'migrations'`
  - `direction`: `'up'`
  - `count`: `Infinity`

  You may also set `loadFromArgs: true` to set `direction` and `count`
  according to command line arguments, similar to the CLI interface.

  ```ts
  await db.withClient(async (client) => {
    await client.migrate()
  })

  // Equivalent to above
  await db.migrate()
  ```

- A test helper for clearing all tables

  ```ts
  await db.withClient(async (client) => {
    await client.clear()
  })

  // Equivalent to above
  await db.clear()
  ```

- A test utility for testing SQL queries, which ignores whitespace differences

  ```ts
  const query = sql`
      INSERT INTO song (name)
      VALUES (${song1})
  `
  expect(query).toEqual(
    sqlMatches({
      text: 'INSERT INTO song (name) VALUES ($1)',
      values: [song1],
    }),
  )
  ```

## Build

```bash
yarn pg-toolbox build
```

## Tests

### Run unit tests

```bash
yarn pg-toolbox test
```

### Run end-to-end tests

1. Run a Postgres server in Docker

   ```bash
   docker run -d -p 5432:5432 \
       -e POSTGRES_HOST_AUTH_METHOD=trust \
       -e POSTGRES_DB=pg_toolbox_test \
       --name pg-toolbox-test \
       postgres:12
   ```

1. `yarn pg-toolbox test:e2e`
