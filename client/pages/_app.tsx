import { AppProps } from 'next/app'
import Head from 'next/head'
import styled, { ThemeProvider } from 'styled-components'

import { Header } from '~/layout/Header'
import { theme } from '~/theme'
import { GlobalStyle } from '~/theme/global'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  )
}

const PageContent = styled.div`
  padding: 15px;
`
