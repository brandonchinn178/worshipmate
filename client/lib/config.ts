export const NODE_ENV: string | undefined = process.env.NEXT_PUBLIC_NODE_ENV

export const GRAPHQL_URL: string | undefined =
  process.env.NEXT_PUBLIC_GRAPHQL_URL

export const UNSAFE_IGNORE_AUTH = !!process.env.NEXT_PUBLIC_UNSAFE_IGNORE_AUTH
export const OKTA_DOMAIN: string | undefined =
  process.env.NEXT_PUBLIC_OKTA_DOMAIN
export const OKTA_CLIENT_ID: string | undefined =
  process.env.NEXT_PUBLIC_OKTA_CLIENT_ID

export const MOCK_APOLLO_QUERIES = !!process.env.NEXT_PUBLIC_MOCK_APOLLO_QUERIES
