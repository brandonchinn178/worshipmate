import React, { Fragment, ReactElement } from 'react'
import { default as NextApp } from 'next/app'

import Header from '@components/layout/Header'

export default class App extends NextApp {
  render(): ReactElement {
    const { Component, pageProps } = this.props
    return (
      <Fragment>
        <Header />
        <Component {...pageProps} />
      </Fragment>
    )
  }
}
