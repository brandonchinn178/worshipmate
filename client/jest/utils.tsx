import { render } from '@testing-library/react'
import { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'

import theme from '~/theme'
import GlobalStyle from '~/theme/global'

export const renderUI = (ui: ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          {children}
        </>
      </ThemeProvider>
    ),
    ...options,
  })
