import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { act, render, RenderOptions } from '@testing-library/react'
import _ from 'lodash'
import { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'

import { theme } from '~/theme'
import { GlobalStyle } from '~/theme/global'

type Options = RenderOptions & {
  mocks?: ReadonlyArray<MockedResponse>
}

export const renderUI = (ui: ReactElement, options: Options = {}) => {
  const { mocks = [], ...renderOptions } = options

  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>
        <MockedProvider mocks={mocks}>
          <>
            <GlobalStyle />
            {children}
          </>
        </MockedProvider>
      </ThemeProvider>
    ),
    ...renderOptions,
  })
}

export const waitForAllStateChanges = async () => {
  await act(() => new Promise(_.defer))
}
