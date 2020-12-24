import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
import Head from 'next/head'
import styled, { ThemeProvider } from 'styled-components'

import { useApollo } from '~/apollo'
import { Header } from '~/layout/Header'
import { theme } from '~/theme'
import { GlobalStyle } from '~/theme/global'

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo()

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <>
          <Head>
            <title>WorshipMate</title>
          </Head>
          <GlobalStyle />
          <Header />
          <PageContent>
            <Component {...pageProps} />
          </PageContent>
        </>
      </ApolloProvider>
    </ThemeProvider>
  )
}

const PageContent = styled.div`
  padding: 15px;
`
