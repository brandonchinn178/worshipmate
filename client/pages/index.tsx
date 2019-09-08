import styled from 'styled-components'

import { Song } from '~/song'
import SongTableComponent from '~/song/SongTable'

type HomeProps = {
  songs: Song[]
}

export default function Home({ songs }: HomeProps) {
  return (
    <Grid>
      <Sidebar>TODO: Sidebar</Sidebar>
      <SearchBar>TODO: Search</SearchBar>
      <SongTable songs={songs} />
    </Grid>
  )
}

Home.getInitialProps = async () => {
  // TODO: get from graphql api
  const songs = [
    {
      slug: 'blessed-be-your-name',
      title: 'Blessed Be Your Name',
      artist: 'Matt Redman',
      themes: ['Praise', 'Worship', 'Devotion'],
    },
    {
      slug: 'build-my-life',
      title: 'Build My Life',
      artist: 'Housefires',
      themes: ['Worship', 'Love', 'Witness'],
    },
  ]

  return { songs }
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 400px auto;
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

const SongTable = styled(SongTableComponent)`
  grid-area: table;
`
