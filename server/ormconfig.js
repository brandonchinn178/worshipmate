module.exports = {
  type: 'postgres',

  // postgres credentials
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  username: process.env.PG_USERNAME || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'worship_mate',

  // entities
  entities: ['**/*.entity.ts'],

  // migration options
  synchronize: false,
  migrations: ['migration/*.ts'],
  cli: {
    migrationsDir: 'migration',
  },
}
