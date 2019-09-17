import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    position: relative;
    margin: 0;
    padding: 0;
    font-size: 100%;
    font-weight: normal;
    line-height: 100%;
  }

  html,
  body {
    font-family: ${(p) => p.theme.fontFamilies.notoSerif};
    font-size: 18px;
  }

  li {
    list-style-type: none;
  }

  a {
    color: ${(p) => p.theme.primary};
    font-weight: bold;
    text-decoration: none;

    &:hover {
      color: ${(p) => p.theme.secondary};
    }
  }
`

export default GlobalStyle
