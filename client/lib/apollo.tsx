import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ReactNode } from 'react'

const IS_SSR = typeof window === 'undefined'

export const getApolloClient = () => {
  const apolloOptions = {
    ssrMode: IS_SSR,
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:4000/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache(),
  }

  return new ApolloClient(apolloOptions)
}

let cachedApolloClient: ApolloClient<unknown> | null = null

const getApolloClientCached = (): ApolloClient<unknown> => {
  if (IS_SSR) {
    // never persist on server side; always create a new ApolloClient
    return getApolloClient()
  }

  if (!cachedApolloClient) {
    cachedApolloClient = getApolloClient()
  }

  return cachedApolloClient
}

export function ApolloProvider({ children }: { children: ReactNode }) {
  const client = getApolloClientCached()
  return <ApolloClientProvider client={client}>{children}</ApolloClientProvider>
}
