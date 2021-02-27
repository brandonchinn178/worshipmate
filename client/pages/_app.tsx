import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
import Head from 'next/head'
import styled, { ThemeProvider } from 'styled-components'

import { useApollo } from '~/apollo'
import { Header } from '~/layout/Header'
import { theme } from '~/theme'
import { GlobalStyle } from '~/theme/global'

export default function App(props: AppProps) {
  const apolloClient = useApollo()

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <AppContent {...props} />
      </ApolloProvider>
    </ThemeProvider>
  )
}

function AppContent({ Component, pageProps }: AppProps) {
  return (
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
  )
}

const PageContent = styled.div`
  padding: 15px;
`
