import { StoryApi } from '@storybook/addons'
import { storiesOf } from '@storybook/react'
import React, { ReactElement } from 'react'
import styled, { ThemeProvider } from 'styled-components'

import { theme } from '~/theme'
import GlobalStyle from '~/theme/global'

export const Story = (name: string): StoryApi<ReactElement> =>
  storiesOf(name, module).addDecorator((storyFn) => (
    <ThemeProvider theme={theme}>
      <Layout>
        <GlobalStyle />
        {storyFn()}
      </Layout>
    </ThemeProvider>
  ))

const Layout = styled.div`
  padding: 20px;
`
