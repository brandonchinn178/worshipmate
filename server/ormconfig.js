const IS_TS_NODE = !!process.env.TS_NODE || process.env.NODE_ENV === 'test'

const config = {
  type: 'postgres',

  // postgres credentials
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  username: process.env.PG_USERNAME || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'worship_mate',

  // entities
  entities: [IS_TS_NODE ? '**/*.entity.ts' : 'dist/**/*.entity.js'],

  // migration options
  synchronize: false,
  migrations: [IS_TS_NODE ? 'migration/*.ts' : 'dist/migration/*.js'],
  cli: {
    migrationsDir: 'migration',
  },
}

if (process.env.NODE_ENV !== 'test') {
  module.exports = config
} else {
  module.exports = [
    {
      ...config,
      name: 'default',
      database: `${config.database}_test`,
      synchronize: true,
    },
    {
      ...config,
      name: 'original',
    },
  ]
}
