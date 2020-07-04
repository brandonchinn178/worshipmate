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

1. `yarn server start`
