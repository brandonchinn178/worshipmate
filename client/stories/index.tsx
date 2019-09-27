import { storiesOf, Story as StoryInterface } from '@storybook/react'
import React from 'react'
import styled, { ThemeProvider } from 'styled-components'

import theme from '~/theme'
import GlobalStyle from '~/theme/global'

export default function Story(name: string): StoryInterface {
  return storiesOf(name, module).addDecorator((storyFn) => (
    <ThemeProvider theme={theme}>
      <Layout>
        <GlobalStyle />
        {storyFn()}
      </Layout>
    </ThemeProvider>
  ))
}

const Layout = styled.div`
  padding: 20px;
`
