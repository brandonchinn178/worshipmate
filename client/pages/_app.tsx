import { default as NextApp } from 'next/app'
import Head from 'next/head'
import React from 'react'
import styled, { ThemeProvider } from 'styled-components'

import Header from '~/layout/Header'
import theme from '~/theme'
import GlobalStyle from '~/theme/global'

export default class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props
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
}

const PageContent = styled.div`
  padding: 15px;
`
