import { FC } from 'react'
import styled from 'styled-components'

const Header: FC = () => {
  return (
    <HeaderContainer>
      <Title>WorshipMate</Title>
      <ul>
        <li>About</li>
        <li>Login</li>
      </ul>
    </HeaderContainer>
  )
}

export default Header

const HeaderContainer = styled.div`
  background: blue;
`

const Title = styled.h1`
  color: white;
`
