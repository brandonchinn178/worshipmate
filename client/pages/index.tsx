import { useRouter } from 'next/router'
import styled from 'styled-components'

import { useSearchSongs } from '~/api'
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

export default function Home() {
  const router = useRouter()

  const search = Array.isArray(router.query.search)
    ? router.query.search[0]
    : router.query.search

  const { data } = useSearchSongs({ variables: { search } })

  const numSongs = data?.songs?.length ?? 0

  return (
    <Grid>
      <Sidebar>TODO: Sidebar</Sidebar>
      <SongSearch>
        <SearchBar
          initial={search}
          onSubmit={(query: string) => {
            router.push({
              pathname: router.pathname,
              query: query && { search: query },
            })
          }}
        />
      </SongSearch>
      <SongCount>
        {numSongs} {pluralize('song', numSongs)}
      </SongCount>
      <SongTableCell>
        <SongTable songs={data?.songs ?? []} />
      </SongTableCell>
    </Grid>
  )
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
