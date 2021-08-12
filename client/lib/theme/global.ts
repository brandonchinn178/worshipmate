import { createGlobalStyle } from 'styled-components'

import { color, fontFamily } from '~/theme'

export const GlobalStyle = createGlobalStyle`
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

  button {
    cursor: pointer;

    background: ${color('darkTeal')};
    color: ${color('white')};
    border: 5px ${color('darkTeal')} solid;

    font-family: ${fontFamily('alegreya')};
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;

    &:hover {
      background: ${color('white')};
      color: ${color('darkTeal')};
    }

    &:disabled {
      background: ${color('lightGray')};
      border-color: ${color('lightGray')};
      cursor: initial;
      color: ${color('white')};
    }
  }
`
