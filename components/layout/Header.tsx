import styled from "styled-components"

export default function Header() {
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

const HeaderContainer = styled.div`
  background: blue;
`

const Title = styled.h1`
  color: white;
`
