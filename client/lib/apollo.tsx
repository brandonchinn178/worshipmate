import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ReactNode } from 'react'

const IS_SSR = typeof window === 'undefined'
const { NEXT_PUBLIC_GRAPHQL_URL } = process.env

export const getApolloClient = () => {
  const httpLink = new HttpLink({
    uri: NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:4000/graphql',
    credentials: 'same-origin',
  })

  const apolloOptions = {
    ssrMode: IS_SSR,
    link: httpLink,
    cache: new InMemoryCache(),
  }

  return new ApolloClient(apolloOptions)
}

let cachedApolloClient: ApolloClient<unknown> | null = null

export function ApolloProvider({ children }: { children: ReactNode }) {
  if (!cachedApolloClient) {
    cachedApolloClient = getApolloClient()
  }

  return (
    <ApolloClientProvider client={cachedApolloClient}>
      {children}
    </ApolloClientProvider>
  )
}
