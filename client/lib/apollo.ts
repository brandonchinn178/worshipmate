import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import * as _ from 'lodash'
import { useMemo } from 'react'

const SSR_MODE = typeof window === 'undefined'

let cachedApolloClient: ApolloClient<unknown> | null = null

export const getApolloClient = () => {
  if (cachedApolloClient) {
    return cachedApolloClient
  }

  const apolloOptions = {
    ssrMode: SSR_MODE,
    link: new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache(),
  }

  const apolloClient = new ApolloClient(apolloOptions)

  // never persist on server side; always create a new ApolloClient
  if (!SSR_MODE) {
    cachedApolloClient = apolloClient
  }

  return apolloClient
}

export const useApollo = (initialState: unknown) => {
  const client = useMemo(() => {
    const apolloClient = getApolloClient()

    if (initialState) {
      const existingCache = apolloClient.extract()
      const data = _.merge({}, existingCache, initialState)
      apolloClient.cache.restore(data)
    }

    return apolloClient
  }, [initialState])

  return client
}
