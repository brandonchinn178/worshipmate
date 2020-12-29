# GraphQL Server

This directory serves the backend for the website.

## Quickstart

1. Run a Postgres server in Docker

   ```bash
   docker run -d -p 5432:5432 \
       -e POSTGRES_HOST_AUTH_METHOD=trust \
       -e POSTGRES_DB=worship_mate \
       --name worship-mate \
       postgres:12
   ```

1. `yarn server migrate:dev`

1. `yarn server start`

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
