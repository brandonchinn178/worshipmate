# pg-toolbox

TODO

## Tests

### Run unit tests

```bash
yarn pg-toolbox test
```

### Run end-to-end tests

1. Run a Postgres server in Docker

   ```bash
   docker run -d -p 5432:5432 \
       -e POSTGRES_HOST_AUTH_METHOD=trust \
       -e POSTGRES_DB=pg_toolbox_test \
       --name pg-toolbox-test \
       postgres:12
   ```

1. `yarn pg-toolbox test:e2e`
