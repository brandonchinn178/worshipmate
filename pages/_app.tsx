import React, { ReactElement } from 'react'
import { default as NextApp } from 'next/app'
import { ThemeProvider } from 'styled-components'

import Header from '@components/layout/Header'
import theme from '@components/theme'

export default class App extends NextApp {
  render(): ReactElement {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <>
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
          <Component {...pageProps} />
        </>
      </ThemeProvider>
    )
  }
}
