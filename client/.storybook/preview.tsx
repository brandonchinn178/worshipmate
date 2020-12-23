import styled, { ThemeProvider } from 'styled-components'

import { theme } from '~/theme'
import { GlobalStyle } from '~/theme/global'

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Layout>
        <GlobalStyle />
        <Story />
      </Layout>
    </ThemeProvider>
  ),
]

const Layout = styled.div`
  padding: 20px;
`
