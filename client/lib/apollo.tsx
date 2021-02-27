import {
  ApolloClient,
  ApolloProvider as ApolloClientProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ReactNode, useMemo } from 'react'

const IS_SSR = typeof window === 'undefined'

let cachedApolloClient: ApolloClient<unknown> | null = null

export const getApolloClient = () => {
  if (cachedApolloClient) {
    return cachedApolloClient
  }

  const apolloOptions = {
    ssrMode: IS_SSR,
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:4000/graphql',
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

const useApollo = () => {
  const client = useMemo(() => getApolloClient(), [])
  return client
}

export function ApolloProvider({ children }: { children: ReactNode }) {
  const client = useApollo()
  return <ApolloClientProvider client={client}>{children}</ApolloClientProvider>
}
