# GraphQL Server

This directory serves the backend for the website.

## Quickstart

Requires a running PostgreSQL server. See `ormconfig.js` for the default
PostgreSQL configuration and the environment variables that can override them.

```bash
yarn server start
```

## Test

To run both all tests, run

```bash
yarn server test
```

This requires the PostgreSQL server to be running. It will use a test database
(`worship_mate_test` by default) so that it won't erase data being used in
development.

To run only one specific type of test, run one of:

```bash
yarn server test:unit
yarn server test:integration
yarn server test:e2e
```

The integration and end-to-end tests require PostgreSQL.
