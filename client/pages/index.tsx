import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Song } from '~/song'
import SongTable from '~/song/SongTable'
import SearchBar from '~/ui-kit/SearchBar'

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
  const router = useRouter()

  const initialSearch = Array.isArray(router.query.search)
    ? router.query.search[0]
    : router.query.search

  return (
    <Grid>
      <Sidebar>TODO: Sidebar</Sidebar>
      <SongSearch>
        <SearchBar
          initial={initialSearch}
          onSubmit={(query: string) => {
            router.push({
              pathname: router.pathname,
              query: query && { search: query },
            })
          }}
        />
      </SongSearch>
      <SongCount>
        {songs.length} {pluralize('song', songs.length)}
      </SongCount>
      <SongTableCell>
        <SongTable songs={songs} />
      </SongTableCell>
    </Grid>
  )
}

// TODO: get from graphql api
const searchSongs = async (query: string) => {
  const allSongs = [
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
      slug: 'give-me-faith',
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

  return allSongs.filter(({ title }) => title.match(new RegExp(query, 'i')))
}

Home.getInitialProps = async ({ query }: NextPageContext) => {
  const songs = await searchSongs(query.search as string)

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

const Sidebar = styled.div`
  grid-area: sidebar;
`

const SongSearch = styled.div`
  grid-area: search;
`

const SongCount = styled.p`
  font-weight: bold;
`

const SongTableCell = styled.div`
  grid-area: table;
`
