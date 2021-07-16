import { MigrationBuilder } from 'node-pg-migrate'

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('artist', {
    id: 'id',
    slug: {
      type: 'string',
      notNull: true,
      unique: true,
    },
    name: {
      type: 'string',
      notNull: true,
      unique: true,
    },
  })

  pgm.addColumns('song', {
    artist: {
      type: 'integer',
      notNull: true,
      references: 'artist',
    },
  })
}
