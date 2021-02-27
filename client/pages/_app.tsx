import { AppProps } from 'next/app'
import Head from 'next/head'
import styled, { ThemeProvider } from 'styled-components'

import { ApolloProvider } from '~/apollo'
import { SessionProvider } from '~/auth/session'
import { Header } from '~/layout/Header'
import { theme } from '~/theme'
import { GlobalStyle } from '~/theme/global'

export default function App(props: AppProps) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <ApolloProvider>
          <AppContent {...props} />
        </ApolloProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

function AppContent({ Component, pageProps }: AppProps) {
  const showHeader = pageProps.header ?? true

  return (
    <>
      <Head>
        <title>WorshipMate</title>
      </Head>
      <GlobalStyle />
      {showHeader && <Header />}
      <PageContent>
        <Component {...pageProps} />
      </PageContent>
    </>
  )
}

const PageContent = styled.div`
  padding: 15px;
`
