import { MigrationBuilder } from 'node-pg-migrate'

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('song', {
    id: 'id',
    slug: {
      type: 'string',
      notNull: true,
      unique: true,
    },
    title: {
      type: 'string',
      notNull: true,
    },
    recommended_key: {
      type: 'string',
      notNull: true,
    },
    time_signature_top: {
      type: 'int',
      notNull: true,
    },
    time_signature_bottom: {
      type: 'int',
      notNull: true,
    },
    bpm: {
      type: 'int',
      notNull: true,
    },
  })
}
