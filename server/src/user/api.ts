import { Database, sql } from 'pg-fusion'

import { User } from './models'
import { UserRecord } from './schema'

export class UserAPI {
  constructor(private readonly db: Database) {}

  async getOrCreate(name: string): Promise<User> {
    await this.db.insertAll('user', [{ name }], {
      onConflict: 'ignore',
    })

    const user = await this.db.querySingle<UserRecord>(sql`
      SELECT * FROM "user"
      WHERE "name" = ${name}
    `)

    return user
  }
}
