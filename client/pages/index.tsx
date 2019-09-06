import { FC } from 'react'
import styled from 'styled-components'

const Home: FC = () => (
  <Grid>
    <Sidebar>TODO: Sidebar</Sidebar>
    <SearchBar>TODO: Search</SearchBar>
    <SongTable>TODO: SongTable</SongTable>
  </Grid>
)

export default Home

const Grid = styled.div`
  display: grid;
  grid-template-columns: 30% auto;
  grid-template-rows: 50px auto;
  grid-template-areas:
    'sidebar search'
    'sidebar table';
`

const Sidebar = styled.div`
  grid-area: sidebar;
`

const SearchBar = styled.div`
  grid-area: search;
`

const SongTable = styled.div`
  grid-area: table;
`
