import styled from 'styled-components'

import { color, font, fontFamily } from '~/theme'

export default function Header() {
  return (
    <HeaderContainer>
      <div>
        <Title href="#">WorshipMate</Title>
      </div>
      <Links>
        <Link href="#">About</Link>
        <Link href="#">Login</Link>
      </Links>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: auto 75px;
  padding: 20px;
  background: ${color('primary')};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.75);
`

const shadow = '2px 2px 2px rgba(0, 0, 0, 0.9)'

const Title = styled.a`
  display: inline-block;
  margin: 0;
  padding: 5px 10px;
  color: ${color('white')};
  font-family: ${fontFamily('alegreyaSC')};
  font-size: 2.5rem;
  border-color: ${color('white')};
  border-width: 3px;
  border-style: solid;
  text-shadow: ${shadow};
  box-shadow: ${shadow};
  letter-spacing: 1px;

  &:hover {
    color: ${color('white')};
  }
`

const Links = styled.nav`
  display: grid;
  justify-items: end;
  align-items: center;
`

const Link = styled.a`
  ${font('label')}
  font-size: 1.2rem;
  color: ${color('white')};
`
