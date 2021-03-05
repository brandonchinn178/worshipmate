# WorshipMate

A website for worship leaders to browse songs for worshipping individually or
corporately. Allows for easy key transposition and selection of full worship
sets.

## Quickstart

Pre-requirements: Install yarn and Docker

1. Install yarn dependencies

   ```bash
   yarn --immutable
   ```

1. Run a Postgres server in Docker

   ```bash
   docker-compose up -d
   ```

1. Start the GraphQL server and front end concurrently

   ```bash
   yarn start:dev
   ```

1. Go to `http://localhost:3000`

## Package overview

This repository is organized using the following Yarn workspaces:

- `client`: The NextJS project that runs the web frontend
- `server`: The apollo-server project that runs the GraphQL backend

## Authentication

This project uses [Okta](https://developer.okta.com/) to store user information
and handle authentication. Follow the Okta documentation to set up an Okta
application for development.

To mock out authentication, set `NEXT_PUBLIC_UNSAFE_IGNORE_AUTH=1` in
`client/.env.local` and `UNSAFE_IGNORE_AUTH=1` in `server/.env`. With these
environment variables set, you may use these credentials to login:

* Username: `testuser`
* Password: `password`
