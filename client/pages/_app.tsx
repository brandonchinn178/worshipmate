import 'react-toastify/dist/ReactToastify.css'

import { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import styled, { ThemeProvider } from 'styled-components'

import { ApolloProvider } from '~/apollo'
import { SessionProvider, useSession } from '~/auth/session'
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
  const { session } = useSession()

  const showHeader = pageProps.header ?? true

  return (
    <AppContainer>
      <Head>
        <title>WorshipMate</title>
      </Head>
      <GlobalStyle />
      {showHeader && <Header isUserLoggedIn={!!session} />}
      <PageContent>
        <Component {...pageProps} />
      </PageContent>
      <ToastContainer />
    </AppContainer>
  )
}

const AppContainer = styled.div`
  min-width: min-content;
`

const PageContent = styled.div`
  padding: 15px;
`
