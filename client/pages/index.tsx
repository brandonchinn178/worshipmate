import styled from 'styled-components'

import { Song } from '~/song'
import SongTable from '~/song/SongTable'
import { SearchInput, useSearch } from '~/ui-kit/SearchBar'

type HomeProps = {
  songs: Song[]
}

export default function Home({ songs }: HomeProps) {
  const [searchResult, searchState] = useSearch(songs, (query, song) => {
    // TODO: better filter
    return !!song.title.match(new RegExp(query, 'i'))
  })

  return (
    <Grid>
      <Sidebar>TODO: Sidebar</Sidebar>
      <SearchBar>
        <SearchInput {...searchState} />
        <button onClick={searchState.doSearch}>&gt;&gt;</button>
      </SearchBar>
      <SongTableCell>
        <SongTable songs={searchResult} />
      </SongTableCell>
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
    {
      slug: 'ever-be',
      title: 'Ever Be',
      artist: 'Bethel Music',
      themes: ['Faithfulness', 'Worship'],
    },
    {
      slug: 'give-me-fatih',
      title: 'Give Me Faith',
      artist: 'Elevation Worship',
      themes: ['Faith', 'Surrender', 'Comfort'],
    },
    {
      slug: 'here-i-am-to-worship',
      title: 'Here I Am to Worship',
      artist: 'Michael W. Smith',
      themes: ['Worship'],
    },
    {
      slug: 'i-could-sing-of-your-love-forever',
      title: 'I Could Sing of Your Love Forever',
      artist: 'Delirious?',
      themes: ['Worship', 'Love'],
    },
    {
      slug: "they'll-know-we-are-christians-by-our-love",
      title: "They'll Know We Are Christians by Our Love",
      artist: 'Peter Scholtes',
      themes: ['Love', 'Outreach', 'Unity'],
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

const SongTableCell = styled.div`
  grid-area: table;
`
