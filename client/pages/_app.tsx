import { default as NextApp } from 'next/app'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import styled, { ThemeProvider } from 'styled-components'

import Header from '~/components/layout/Header'
import theme from '~/components/theme'

export default class App extends NextApp {
  render(): ReactElement {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <>
          <Head>
            <title>WorshipMate</title>
          </Head>
          <style jsx global>{`
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
          `}</style>
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
