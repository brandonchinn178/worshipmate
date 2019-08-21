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
