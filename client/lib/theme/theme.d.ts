import { CSSProp } from 'styled-components'

import { theme } from '.'

type OurTheme = typeof theme

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends OurTheme {}
}

declare module 'react' {
  interface Attributes {
    css?: CSSProp<OurTheme>
  }
}
