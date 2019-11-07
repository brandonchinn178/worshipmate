import { InterpolationFunction, ThemeProps } from 'styled-components'

import { colors } from './colors'
import { fontFamilies, fonts } from './fonts'

export const theme = {
  colors,
  fontFamilies,
  fonts,
}

type ThemeInterface = typeof theme

/**
 * A styled-components function for using a theme value.
 */
type StyledFunction<T> = (
  name: keyof T,
) => InterpolationFunction<ThemeProps<ThemeInterface>>

/**
 * Usage:
 *   styled.div`
 *     background: ${color('darkTeal')}
 *   `
 */
export const color: StyledFunction<typeof colors> = (name) => (p) =>
  p.theme.colors[name]

/**
 * Usage:
 *   styled.div`
 *     font-family: ${fontFamily('alegreya')}
 *   `
 */
export const fontFamily: StyledFunction<typeof fontFamilies> = (name) => (p) =>
  p.theme.fontFamilies[name]

/**
 * Usage:
 *   styled.div`
 *     ${font('label')}
 *   `
 */
export const font: StyledFunction<typeof fonts> = (name) => (p) =>
  p.theme.fonts[name]
