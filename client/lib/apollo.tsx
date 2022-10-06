import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { MockLink } from '@apollo/client/testing'
import { ReactNode } from 'react'
import { toast } from 'react-toastify'

import { SearchSongsDocument } from '~/api/songApi.generated'
import { getToken } from '~/auth/client'
import { GRAPHQL_URL, MOCK_APOLLO_QUERIES } from '~/config'

const IS_SSR = typeof window === 'undefined'

export const apolloCache = new InMemoryCache()

const getApolloLink = () => {
  if (MOCK_APOLLO_QUERIES) {
    return new MockLink([
      {
        request: {
          query: SearchSongsDocument,
        },
        result: {
          data: {
            songs: [],
          },
        },
      },
    ])
  }

  const httpLink = new HttpLink({
    uri: GRAPHQL_URL ?? 'http://localhost:4000/graphql',
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

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((e) => {
        const { message, path } = e

        console.error(e)

        toast.error(
          [
            'GraphQL error',
            path ? ` at "${path.join('.')}"` : '',
            ': ',
            message,
          ].join(''),
        )
      })
    }

    if (networkError) {
      console.error(networkError)
      toast.error(networkError.toString())
    }
  })

  return from([authLink, errorLink, httpLink])
}

export const getApolloClient = () => {
  const apolloOptions = {
    ssrMode: IS_SSR,
    link: getApolloLink(),
    cache: apolloCache,
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
