import styled from 'styled-components'

import { Song } from '~/song'
import SongTable from '~/song/SongTable'
import { Icon } from '~/ui-kit/Icon'
import { useSearch } from '~/ui-kit/SearchBar'

type HomeProps = {
  songs: Song[]
}

function pluralize(...args: [string, number] | [string, string, number]) {
  const [singular, plural, count] =
    args.length === 2 ? [args[0], args[0] + 's', args[1]] : args

  switch (count) {
    case 0:
      return plural
    case 1:
      return singular
    default:
      return plural
  }
}

export default function Home({ songs }: HomeProps) {
  const [searchResult, searchInputProps, searchState] = useSearch(
    songs,
    (query, song) => {
      // TODO: better filter
      return !!song.title.match(new RegExp(query, 'i'))
    },
  )

  return (
    <Grid>
      <Sidebar>TODO: Sidebar</Sidebar>
      <SearchBar>
        <SearchInput {...searchInputProps} />
        <IconBox onClick={searchState.doSearch}>
          <Icon name="search" />
        </IconBox>
      </SearchBar>
      <SongCount>
        {searchResult.length} {pluralize('song', searchResult.length)}
      </SongCount>
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
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'sidebar search'
    'sidebar song-count'
    'sidebar table';
  grid-gap: 10px;
`

const IconBox = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;

  height: 33px;
  width: 33px;
  border: 1px solid black;
  cursor: pointer;
`

const Sidebar = styled.div`
  grid-area: sidebar;
`

const SearchBar = styled.div`
  grid-area: search;

  display: grid;
  grid-template-columns: auto min-content;
  grid-template-areas: 'search-input search-button';
  grid-gap: 10px;
  align-items: center;
`

const SearchInput = styled.input`
  grid-area: search-input;
  width: 100%;
  border: 1px solid black;
  padding: 5px;
  outline: 0;
`

const SongCount = styled.p`
  font-weight: bold;
`

const SongTableCell = styled.div`
  grid-area: table;
`
