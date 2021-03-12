import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { ReactNode } from 'react'
import { toast } from 'react-toastify'

import { getToken } from '~/auth/client'

const IS_SSR = typeof window === 'undefined'
const { NEXT_PUBLIC_GRAPHQL_URL } = process.env

export const apolloCache = new InMemoryCache()

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

  const apolloOptions = {
    ssrMode: IS_SSR,
    link: from([authLink, errorLink, httpLink]),
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
