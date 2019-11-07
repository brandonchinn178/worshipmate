import { createGlobalStyle } from 'styled-components'

import { color, fontFamily } from '~/theme'

const GlobalStyle = createGlobalStyle`
  * {
    position: relative;
    margin: 0;
    padding: 0;
    font-size: 100%;
    font-weight: normal;
    line-height: 100%;
    box-sizing: border-box;
  }

  html,
  body {
    font-family: ${fontFamily('notoSerif')};
    font-size: 18px;
  }

  li {
    list-style-type: none;
  }

  a {
    color: ${color('primary')};
    font-weight: bold;
    text-decoration: none;

    &:hover {
      color: ${color('secondary')};
    }
  }
`

export default GlobalStyle
