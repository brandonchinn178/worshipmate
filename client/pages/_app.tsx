import { default as NextApp } from 'next/app'
import Head from 'next/head'
import React from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

import Header from '~/layout/Header'
import theme from '~/theme'

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

const GlobalStyle = createGlobalStyle`
  * {
    position: relative;
    margin: 0;
    padding: 0;
    font-size: 100%;
    font-weight: normal;
    line-height: 100%;
  }

  html,
  body {
    font-size: 18px;
  }

  li {
    list-style-type: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`

const PageContent = styled.div`
  padding: 15px;
`
