import {
  default as NextDocument,
  DocumentContext,
  DocumentInitialProps,
  Head,
  Main,
  NextScript,
} from 'next/document'
import { ReactElement } from 'react'
import { ServerStyleSheet } from 'styled-components'

export default class Document extends NextDocument {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet()

    try {
      const initialProps = await NextDocument.getInitialProps({
        ...ctx,
        renderPage: () =>
          ctx.renderPage({
            enhanceApp: (App) => (props): ReactElement =>
              sheet.collectStyles(<App {...props} />),
          }),
      })

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <html>
        <Head>
          {/* realfavicongenerator.net */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#134b4e" />
          <meta name="msapplication-TileColor" content="#2b5797" />
          <meta name="theme-color" content="#134b4e" />

          <link
            href="https://fonts.googleapis.com/css?family=Alegreya+Sans+SC:500|Alegreya+Sans:500|Noto+Serif:400,400i,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
