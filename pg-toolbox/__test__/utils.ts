import { Database, sql } from '~/index'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
const TEST_DB = 'pg_toolbox_test'

export const setupTestDatabase = (): Database => {
  const db = new Database({ database: TEST_DB })

  beforeEach(async () => {
    await db.executeAll([
      sql`DROP SCHEMA public CASCADE`,
      sql`CREATE SCHEMA public`,
    ])
  })

  afterAll(async () => {
    await db.close()
  })

  return db
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toEqualJSON(v: unknown): R
    }
  }
}

export const extendExpect = () => {
  expect.extend({
    // Expect the two values to equal when JSON-stringified.
    toEqualJSON(received: unknown, expected: unknown) {
      const pass = this.equals(
        JSON.stringify(received),
        JSON.stringify(expected),
      )

      const message = () => {
        const expectedPrefix = pass ? 'not ' : ''
        return [
          this.utils.matcherHint('toEqualJSON', undefined, undefined, {
            comment: 'equality after JSON.stringify',
            isNot: this.isNot,
            promise: this.promise,
          }),
          '',
          'Expected: ' + expectedPrefix + this.utils.printExpected(expected),
          'Received: ' + this.utils.printReceived(received),
        ].join('\n')
      }

      return { actual: received, message, pass }
    },
  })
}
