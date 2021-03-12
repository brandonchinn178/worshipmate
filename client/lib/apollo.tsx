import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ReactNode } from 'react'

import { getToken } from '~/auth/client'

const IS_SSR = typeof window === 'undefined'
const { NEXT_PUBLIC_GRAPHQL_URL } = process.env

export const getApolloClient = () => {
  const httpLink = new HttpLink({
    uri: NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:4000/graphql',
    credentials: 'same-origin',
  })

  const authLink = setContext(async (_, { headers }) => {
    const token = await getToken()

    return {
      headers: {
        ...headers,
        authorization: token && `Bearer ${token}`,
      },
    }
  })

  const apolloOptions = {
    ssrMode: IS_SSR,
    link: from([authLink, httpLink]),
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
