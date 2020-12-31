import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { useMemo } from 'react'

const IS_SSR = typeof window === 'undefined'

let cachedApolloClient: ApolloClient<unknown> | null = null

export const getApolloClient = () => {
  if (cachedApolloClient) {
    return cachedApolloClient
  }

  const apolloOptions = {
    ssrMode: IS_SSR,
    link: new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache(),
  }

  const apolloClient = new ApolloClient(apolloOptions)

  // never persist on server side; always create a new ApolloClient
  if (!IS_SSR) {
    cachedApolloClient = apolloClient
  }

  return apolloClient
}

export const useApollo = () => {
  const client = useMemo(() => getApolloClient(), [])
  return client
}
