import React, { Fragment } from "react"
import { default as NextApp } from "next/app"

import Header from "@components/layout/Header"

export default class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Fragment>
        <Header />
        <Component {...pageProps} />
      </Fragment>
    )
  }
}
