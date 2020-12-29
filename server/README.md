# GraphQL Server

This directory serves the backend for the website.

## Quickstart

1. Run a Postgres server in Docker

   ```bash
   docker-compose up -d
   ```

1. `yarn server migrate:dev`

1. `yarn server start:dev`

## Tests

### Run unit tests

```bash
yarn server test
```

### Run end-to-end tests

1. Have the `worship_mate` Postgres database running

1. `yarn server test:e2e`

## Migrations

To create a new migration, use `yarn server migrate:create name-of-migration`

To run migrations, run the following command:

```bash
yarn server migrate [up|down|redo] [N]
```
