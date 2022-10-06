# NextJS client

This directory serves the frontend for the website.

## Quickstart

```bash
yarn client start:dev
```

To run the storybook, run

```bash
yarn client storybook
```

## Tests

### Run unit tests

```bash
yarn client test
```

### Run cypress tests

Cypress tests rely on authentication being mocked out. See the top-level `README.md` for more information.

1. `docker-compose up -d`
1. `yarn start:test`
1. `yarn client cypress open`
