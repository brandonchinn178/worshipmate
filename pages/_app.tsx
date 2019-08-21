import React, { Fragment, ReactElement } from 'react'
import { default as NextApp } from 'next/app'
import { ThemeProvider } from 'styled-components'

import Header from '@components/layout/Header'
import theme from '@components/theme'

export default class App extends NextApp {
  render(): ReactElement {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <Header />
          <Component {...pageProps} />
        </Fragment>
      </ThemeProvider>
    )
  }
}
