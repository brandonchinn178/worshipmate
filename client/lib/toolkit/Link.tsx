import styled from 'styled-components'

type LinkProps = {
  // defaults to 'dark'
  mode?: 'light' | 'dark'
}

const Link = styled.a<{ mode?: 'light' | 'dark' }>`
  color: ${(p) => {
    const { mode = 'dark' } = p
    return mode === 'dark' ? p.theme.primary : p.theme.colors.white
  }}
  font-weight: bold;

  &:hover {
    color: ${(p) => p.theme.secondary};
  }
`

export default Link
