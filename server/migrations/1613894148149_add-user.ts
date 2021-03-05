import { MigrationBuilder } from 'node-pg-migrate'

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('user', {
    id: 'id',
    name: {
      type: 'string',
      notNull: true,
      unique: true,
    },
  })
}
