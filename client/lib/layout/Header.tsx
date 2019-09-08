import styled from 'styled-components'

import Link from '~/toolkit/Link'

export default function Header() {
  return (
    <HeaderContainer>
      <div>
        <Title href="#">WorshipMate</Title>
      </div>
      <Links>
        <Link mode="light" href="#">
          About
        </Link>
        <Link mode="light" href="#">
          Login
        </Link>
      </Links>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: auto 75px;
  padding: 20px;
  background: ${(p) => p.theme.primary};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.75);
`

const shadow = '2px 2px 2px rgba(0, 0, 0, 0.9)'

const Title = styled.a`
  display: inline-block;
  margin: 0;
  padding: 5px 10px;
  color: ${(p) => p.theme.colors.white};
  font-family: ${(p) => p.theme.fontFamilies.alegreyaSC};
  font-size: 2.5rem;
  border-color: ${(p) => p.theme.colors.white};
  border-width: 3px;
  border-style: solid;
  text-shadow: ${shadow};
  box-shadow: ${shadow};
  letter-spacing: 1px;
`

const Links = styled.nav`
  display: grid;
  justify-items: end;
  align-items: center;
  ${(p) => p.theme.fonts.label}
  font-size: 1.2rem;
  color: ${(p) => p.theme.colors.white};
`
